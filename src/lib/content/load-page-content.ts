import type { Db } from "@/db/client"
import { ensureContentPages } from "@/lib/content/ensure-pages"
import { contentPathsForPage, type ContentPageSlug } from "@/lib/content/fields"
import { readContent, type ContentReadMode } from "@/lib/content/read"

export async function loadPageContent(
  db: Db,
  pageSlug: ContentPageSlug,
  mode: ContentReadMode
) {
  await ensureContentPages(db)
  const paths = contentPathsForPage(pageSlug)
  return readContent(db, pageSlug, paths, mode)
}

export async function loadMergedContent(
  db: Db,
  pageSlugs: ContentPageSlug[],
  mode: ContentReadMode
) {
  await ensureContentPages(db)
  const merged: Record<string, string> = {}
  for (const slug of pageSlugs) {
    const paths = contentPathsForPage(slug)
    const content = await readContent(db, slug, paths, mode)
    Object.assign(merged, content)
  }
  return merged
}
