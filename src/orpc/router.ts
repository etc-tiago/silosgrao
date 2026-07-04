import { authRouter } from "@/orpc/procedures/auth"
import { editorRouter } from "@/orpc/procedures/editor"

export const router = {
  auth: authRouter,
  editor: editorRouter,
}

export type AppRouter = typeof router
