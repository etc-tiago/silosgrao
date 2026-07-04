import { createServerFn } from "@tanstack/react-start"
import { getServerDb } from "@/lib/server/env"
import { getSessionEditor } from "@/lib/auth/session.server"
import { readContent } from "@/lib/content/read"

export const loadHomeContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getServerDb()
    const editor = await getSessionEditor(db)
    const mode = editor ? "editor" : "public"

    const content = await readContent(
      db,
      "home",
      ["hero.title", "hero.subtitle"],
      mode
    )

    return { content }
  }
)
