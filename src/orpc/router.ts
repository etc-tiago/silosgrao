import { authRouter } from "@/orpc/procedures/auth"
import { catalogRouter } from "@/orpc/procedures/catalog"
import { contentRouter } from "@/orpc/procedures/content"
import { editorRouter } from "@/orpc/procedures/editor"
import { syncDataRouter } from "@/orpc/procedures/sync-data"
import { usersRouter } from "@/orpc/procedures/users"

export const router = {
  auth: authRouter,
  catalog: catalogRouter,
  content: contentRouter,
  editor: editorRouter,
  syncData: syncDataRouter,
  users: usersRouter,
}

export type AppRouter = typeof router
