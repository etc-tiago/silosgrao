import { ORPCError, os } from "@orpc/server"
import type { ORPCContext } from "@/orpc/context"

export const authed = os.$context<ORPCContext>().use(async ({ context, next }) => {
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

export const adminOnly = authed.use(async ({ context, next }) => {
  if (context.editor!.tipo !== "admin") {
    throw new ORPCError("FORBIDDEN", {
      message: "Apenas administradores podem realizar esta ação.",
    })
  }

  return next({ context })
})
