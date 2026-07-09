import { editores } from "@/db/schema"
import { isActiveEditor } from "@/lib/auth/editor"
import { createOtpChallenge, verifyOtpChallenge } from "@/lib/auth/otp"
import { checkRateLimit } from "@/lib/auth/rate-limit"
import {
  createSession,
  destroySession,
  getSessionEditor,
} from "@/lib/auth/session.server"
import { getEditorState } from "@/lib/content/write"
import type { ORPCContext } from "@/orpc/context"
import { ORPCError, os } from "@orpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const base = os.$context<ORPCContext>()

const requestOtp = base
  .input(
    z.object({
      email: z.email(),
    })
  )
  .handler(async ({ input, context }) => {
    const email = input.email.toLowerCase().trim()

    await checkRateLimit(context.db, `otp:email:${email}`, 3, 15 * 60 * 1000)
    await checkRateLimit(context.db, `otp:ip:${context.ip}`, 10, 15 * 60 * 1000)

    const editor = await context.db.query.editores.findFirst({
      where: eq(editores.email, email),
    })

    if (editor && isActiveEditor(editor)) {
      const { code } = await createOtpChallenge(context.db, email)

      try {
        await context.env.EMAIL.send({
          to: email,
          from: {
            email: context.env.OTP_FROM_EMAIL,
            name: "Silo Grão",
          },
          subject: "Seu código de acesso",
          text: `Seu código de acesso é: ${code}. Válido por 10 minutos.`,
          html: `<p>Seu código de acesso é: <strong>${code}</strong></p><p>Válido por 10 minutos.</p>`,
        })
      } catch {
        // Email may fail in local dev without configured domain
        console.info(`[dev] OTP for ${email}: ${code}`)
      }
    }

    return { ok: true as const }
  })

const verifyOtp = base
  .input(
    z.object({
      email: z.email(),
      code: z.string().length(6),
    })
  )
  .handler(async ({ input, context }) => {
    const email = input.email.toLowerCase().trim()

    await checkRateLimit(
      context.db,
      `verify:ip:${context.ip}`,
      20,
      15 * 60 * 1000
    )

    const editor = await context.db.query.editores.findFirst({
      where: eq(editores.email, email),
    })

    if (!editor || !isActiveEditor(editor)) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Código inválido ou expirado.",
      })
    }

    const valid = await verifyOtpChallenge(context.db, email, input.code)

    if (!valid) {
      throw new ORPCError("UNAUTHORIZED", {
        message: "Código inválido ou expirado.",
      })
    }

    await createSession(context.db, editor.id)

    return {
      editor: {
        id: editor.id,
        email: editor.email,
        tipo: editor.tipo,
        hash: editor.hash,
      },
    }
  })

const logout = base.handler(async ({ context }) => {
  await destroySession(context.db)
  return { ok: true as const }
})

const getSession = base.handler(async ({ context }) => {
  const editor = context.editor ?? (await getSessionEditor(context.db))

  if (!editor) {
    return { editor: null, editorState: null }
  }

  const editorState = await getEditorState(context.db, editor.id)

  return {
    editor: {
      id: editor.id,
      email: editor.email,
      tipo: editor.tipo,
      hash: editor.hash,
    },
    editorState,
  }
})

export const authRouter = {
  requestOtp,
  verifyOtp,
  logout,
  getSession,
}
