import { authRouter } from "@/orpc/procedures/auth"
import { catalogRouter } from "@/orpc/procedures/catalog"
import { contentRouter } from "@/orpc/procedures/content"
import { editorRouter } from "@/orpc/procedures/editor"

export const router = {
  auth: authRouter,
  catalog: catalogRouter,
  content: contentRouter,
  editor: editorRouter,
}

export type AppRouter = typeof router
