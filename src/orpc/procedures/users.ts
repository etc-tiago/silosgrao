import { editores, editorTipoEnum } from "@/db/schema"
import { isActiveEditor } from "@/lib/auth/editor"
import { checkRateLimit } from "@/lib/auth/rate-limit"
import { destroyEditorSessions } from "@/lib/auth/session.server"
import { editorHashFromEmail } from "@/lib/crypto"
import { adminOnly } from "@/orpc/middleware/auth"
import { ORPCError } from "@orpc/server"
import { and, asc, eq, isNull, sql } from "drizzle-orm"
import { z } from "zod"

function toPublicEditor(editor: typeof editores.$inferSelect) {
  return {
    id: editor.id,
    email: editor.email,
    tipo: editor.tipo,
    createdAt: editor.createdAt,
  }
}

const list = adminOnly.handler(async ({ context }) => {
  const items = await context.db.query.editores.findMany({
    where: isNull(editores.revokedAt),
    orderBy: [asc(editores.email)],
  })

  return items.map(toPublicEditor)
})

const invite = adminOnly
  .input(
    z.object({
      email: z.email(),
      tipo: z.enum(editorTipoEnum).default("usuario"),
    })
  )
  .handler(async ({ input, context }) => {
    const email = input.email.toLowerCase().trim()
    const admin = context.editor!

    await checkRateLimit(
      context.db,
      `invite:admin:${admin.id}`,
      10,
      60 * 60 * 1000
    )

    const existing = await context.db.query.editores.findFirst({
      where: eq(editores.email, email),
    })

    if (existing && isActiveEditor(existing)) {
      throw new ORPCError("CONFLICT", {
        message: "Este email já possui acesso ativo.",
      })
    }

    const hash = editorHashFromEmail(email)
    let editor: typeof editores.$inferSelect

    if (existing) {
      const [updated] = await context.db
        .update(editores)
        .set({
          tipo: input.tipo,
          hash,
          revokedAt: null,
        })
        .where(eq(editores.id, existing.id))
        .returning()

      if (!updated) {
        throw new ORPCError("INTERNAL_SERVER_ERROR")
      }

      editor = updated
    } else {
      const [created] = await context.db
        .insert(editores)
        .values({
          email,
          tipo: input.tipo,
          hash,
        })
        .returning()

      if (!created) {
        throw new ORPCError("INTERNAL_SERVER_ERROR")
      }

      editor = created
    }

    const loginUrl = new URL("/editar", context.request.url).toString()
    const roleLabel = input.tipo === "admin" ? "administrador" : "usuário"

    try {
      await context.env.EMAIL.send({
        to: email,
        from: {
          email: context.env.OTP_FROM_EMAIL,
          name: "Silos Grão",
        },
        subject: "Convite para editar o site Silos Grão",
        text: `Você foi convidado como ${roleLabel} para editar o site Silos Grão.\n\nAcesse ${loginUrl} e informe este email para receber um código de acesso.`,
        html: `<p>Você foi convidado como <strong>${roleLabel}</strong> para editar o site Silos Grão.</p><p><a href="${loginUrl}">Acesse aqui</a> e informe este email para receber um código de acesso.</p>`,
      })
    } catch {
      console.info(`[dev] Invite for ${email}: ${loginUrl}`)
    }

    return toPublicEditor(editor)
  })

const revoke = adminOnly
  .input(
    z.object({
      editorId: z.number().int().positive(),
    })
  )
  .handler(async ({ input, context }) => {
    const admin = context.editor!

    if (input.editorId === admin.id) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Você não pode revogar o próprio acesso.",
      })
    }

    const target = await context.db.query.editores.findFirst({
      where: eq(editores.id, input.editorId),
    })

    if (!target || !isActiveEditor(target)) {
      throw new ORPCError("NOT_FOUND", {
        message: "Usuário não encontrado.",
      })
    }

    if (target.tipo === "admin") {
      const [countRow] = await context.db
        .select({ count: sql<number>`count(*)` })
        .from(editores)
        .where(and(eq(editores.tipo, "admin"), isNull(editores.revokedAt)))

      if ((countRow?.count ?? 0) <= 1) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Não é possível revogar o último administrador.",
        })
      }
    }

    await context.db
      .update(editores)
      .set({ revokedAt: new Date() })
      .where(eq(editores.id, target.id))

    await destroyEditorSessions(context.db, target.id)

    return { ok: true as const }
  })

export const usersRouter = {
  list,
  invite,
  revoke,
}
