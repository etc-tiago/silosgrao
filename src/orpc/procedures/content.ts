import { ORPCError, os } from "@orpc/server"
import { asc } from "drizzle-orm"
import { z } from "zod"
import { contentTypeEnum, pages } from "@/db/schema"
import { setField as setFieldValue } from "@/lib/content/write"
import { isUploadedContentAssetUrl } from "@/lib/content/image-url"
import { getEditorState } from "@/lib/content/write"
import type { ORPCContext } from "@/orpc/context"

const authed = os.$context<ORPCContext>().use(async ({ context, next }) => {
  if (!context.editor) {
    throw new ORPCError("UNAUTHORIZED")
  }

  return next({
    context: {
      ...context,
      editor: context.editor,
    },
  })
})

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
])
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

function contentAssetUrl(request: Request, key: string) {
  const origin = new URL(request.url).origin
  return `${origin}/api/content-assets/${key}`
}

const setField = authed
  .input(
    z.object({
      pageSlug: z.string().min(1),
      path: z.string().min(1),
      type: z.enum(contentTypeEnum),
      value: z.string(),
    })
  )
  .handler(async ({ context, input }) => {
    if (input.type === "image" && !isUploadedContentAssetUrl(context.request, input.value)) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Valor de imagem inválido.",
      })
    }

    await setFieldValue(
      context.db,
      context.editor!.id,
      input.pageSlug,
      input.path,
      input.type,
      input.value
    )

    const editorState = await getEditorState(context.db, context.editor!.id)
    return { editorState }
  })

const uploadImage = authed
  .input(
    z.object({
      pageSlug: z.string().min(1),
      path: z.string().min(1),
      mimeType: z.string().min(1),
      dataBase64: z.string().min(1),
    })
  )
  .handler(async ({ context, input }) => {
    if (!ALLOWED_IMAGE_TYPES.has(input.mimeType)) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Tipo de imagem não suportado.",
      })
    }

    const bucket = context.env.CONTENT_ASSETS
    if (!bucket) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Armazenamento de imagens indisponível.",
      })
    }

    const binary = Uint8Array.from(atob(input.dataBase64), (c) => c.charCodeAt(0))

    if (binary.byteLength > MAX_IMAGE_BYTES) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Imagem excede o tamanho máximo de 5MB.",
      })
    }

    const ext =
      input.mimeType === "image/png"
        ? "png"
        : input.mimeType === "image/webp"
          ? "webp"
          : "jpg"

    const key = `content/${input.pageSlug}/${input.path.replace(/\./g, "/")}/${crypto.randomUUID()}.${ext}`

    await bucket.put(key, binary, {
      httpMetadata: { contentType: input.mimeType },
    })

    return { url: contentAssetUrl(context.request, key) }
  })

const listPages = authed.handler(async ({ context }) => {
  return context.db
    .select({ slug: pages.slug, title: pages.title })
    .from(pages)
    .orderBy(asc(pages.title))
})

export const contentRouter = {
  setField,
  uploadImage,
  listPages,
}
