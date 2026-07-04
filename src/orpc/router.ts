import { authRouter } from "@/orpc/procedures/auth"
import { contentRouter } from "@/orpc/procedures/content"
import { editorRouter } from "@/orpc/procedures/editor"

export const router = {
  auth: authRouter,
  content: contentRouter,
  editor: editorRouter,
}

export type AppRouter = typeof router
