import { getSessionEditor } from "@/lib/auth/session.server"
import { loadMergedContent, loadPageContent } from "@/lib/content/load-page-content"
import { getServerDb } from "@/lib/server/env"
import { createServerFn } from "@tanstack/react-start"

export const loadHomeContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getServerDb()
    const editor = await getSessionEditor(db)
    const mode = editor ? "editor" : "public"

    const content = await loadMergedContent(db, ["home", "site", "produtos"], mode)

    return { content, mode }
  }
)

export const loadSiteContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getServerDb()
    const editor = await getSessionEditor(db)
    const mode = editor ? "editor" : "public"
    const content = await loadPageContent(db, "site", mode)
    return { content, mode }
  }
)

export const loadProdutosContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getServerDb()
    const editor = await getSessionEditor(db)
    const mode = editor ? "editor" : "public"
    const content = await loadMergedContent(db, ["produtos", "site"], mode)
    return { content, mode }
  }
)

export const loadRootContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getServerDb()
    const editor = await getSessionEditor(db)
    const mode = editor ? "editor" : "public"
    const [session, content] = await Promise.all([
      (async () => {
        const { getServerOrpcClient } = await import("@/orpc/server-client")
        return getServerOrpcClient().auth.getSession()
      })(),
      loadMergedContent(db, ["site", "produtos"], mode),
    ])
    return { ...session, content, mode }
  }
)
