import type { Db } from "@/db/client"
import { pages } from "@/db/schema"

const PAGE_SEEDS = [
  { slug: "home", title: "Início" },
  { slug: "site", title: "Site global" },
  { slug: "produtos", title: "Produtos" },
  { slug: "sobre", title: "Sobre" },
] as const

export type ContentPageSlug = (typeof PAGE_SEEDS)[number]["slug"]

export async function ensureContentPages(db: Db) {
  for (const page of PAGE_SEEDS) {
    await db.insert(pages).values(page).onConflictDoNothing()
  }
}

export const CONTENT_PAGE_SLUGS = PAGE_SEEDS.map((page) => page.slug)
