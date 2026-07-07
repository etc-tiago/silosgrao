import { getSessionEditor } from "@/lib/auth/session.server"
import {
  getHomepageCatalogByCategory,
  getPublicCatalogByCategory,
} from "@/lib/catalog/service"
import { loadMergedContent, loadPageContent } from "@/lib/content/load-page-content"
import { getServerDb } from "@/lib/server/env"
import { createServerFn } from "@tanstack/react-start"

export const loadHomeContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getServerDb()
    const editor = await getSessionEditor(db)
    const mode = editor ? "editor" : "public"

    const [content, homepageCatalog] = await Promise.all([
      loadMergedContent(db, ["home", "site"], mode),
      getHomepageCatalogByCategory(db),
    ])

    return { content, mode, homepageCatalog }
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
    const [content, catalog] = await Promise.all([
      loadMergedContent(db, ["produtos", "site"], mode),
      getPublicCatalogByCategory(db),
    ])
    return { content, mode, catalog }
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
      loadMergedContent(db, ["site"], mode),
    ])
    return { ...session, content, mode }
  }
)
