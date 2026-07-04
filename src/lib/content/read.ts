import { and, eq, inArray } from "drizzle-orm"
import type { Db } from "@/db/client"
import { contentEntries, pages } from "@/db/schema"
import type { ContentType } from "@/db/schema"

export type ContentReadMode = "public" | "editor"

export async function getPageBySlug(db: Db, slug: string) {
  return db.query.pages.findFirst({
    where: eq(pages.slug, slug),
  })
}

export async function readContent(
  db: Db,
  pageSlug: string,
  paths: string[],
  mode: ContentReadMode
): Promise<Record<string, string>> {
  const page = await getPageBySlug(db, pageSlug)
  if (!page || paths.length === 0) return {}

  const entries = await db.query.contentEntries.findMany({
    where: and(
      eq(contentEntries.pageId, page.id),
      inArray(contentEntries.path, paths)
    ),
  })

  const result: Record<string, string> = {}

  for (const path of paths) {
    const prod = entries.find(
      (e) => e.path === path && e.environment === "prod"
    )
    const dev = entries.find((e) => e.path === path && e.environment === "dev")

    if (mode === "public") {
      if (prod) result[path] = prod.value
      continue
    }

    result[path] = dev?.value ?? prod?.value ?? ""
  }

  return result
}

export async function getEntryValue(
  db: Db,
  pageId: number,
  path: string,
  environment: "prod" | "dev"
) {
  const entry = await db.query.contentEntries.findFirst({
    where: and(
      eq(contentEntries.pageId, pageId),
      eq(contentEntries.path, path),
      eq(contentEntries.environment, environment)
    ),
  })

  return entry?.value ?? null
}

export async function getEditorOverlayValue(
  db: Db,
  pageId: number,
  path: string
) {
  const dev = await getEntryValue(db, pageId, path, "dev")
  if (dev !== null) return dev
  return getEntryValue(db, pageId, path, "prod")
}

export type { ContentType }
