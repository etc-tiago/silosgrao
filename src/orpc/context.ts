import { getDb } from "@/db/client"
import { getWorkerEnv } from "@/lib/server/env"
import { getSessionEditor } from "@/lib/auth/session.server"

export async function createContext(request: Request) {
  const workerEnv = getWorkerEnv()
  const db = getDb(workerEnv.DB)
  const editor = await getSessionEditor(db)

  return {
    env: workerEnv,
    db,
    request,
    headers: request.headers,
    ip: request.headers.get("CF-Connecting-IP") ?? "127.0.0.1",
    editor,
  }
}

export type ORPCContext = Awaited<ReturnType<typeof createContext>>
