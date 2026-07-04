import { getSessionEditor } from "@/lib/auth/session.server"
import { readContent } from "@/lib/content/read"
import { getServerDb } from "@/lib/server/env"
import { createServerFn } from "@tanstack/react-start"

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

    return { content, mode }
  }
)
