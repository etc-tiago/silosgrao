import { z } from "zod"

export const contentLinkSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("page"),
    pageSlug: z.string().min(1),
    hash: z.string().optional(),
  }),
  z.object({
    kind: z.literal("external"),
    url: z.string().min(1),
    openInNewTab: z.boolean().optional(),
  }),
])

export type ContentLink = z.infer<typeof contentLinkSchema>

export function pageSlugToPath(slug: string) {
  return slug === "home" ? "/" : `/${slug}`
}

export function pathToPageSlug(path: string): string {
  if (path === "/") return "home"
  return path.replace(/^\//, "")
}

export function serializeContentLink(value: ContentLink) {
  return JSON.stringify(value)
}

export function parseContentLink(
  raw: string | undefined,
  fallback?: ContentLink
): ContentLink | undefined {
  if (!raw) return fallback
  try {
    const parsed = contentLinkSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : fallback
  } catch {
    return fallback
  }
}

/** Migrates legacy intent-link JSON to ContentLink */
export function migrateIntentLink(raw: string | undefined): ContentLink | undefined {
  if (!raw) return undefined
  try {
    const data = JSON.parse(raw) as Record<string, unknown>
    if (data.kind === "route" && typeof data.to === "string") {
      return {
        kind: "page",
        pageSlug: data.to === "/" ? "home" : pathToPageSlug(data.to),
        hash: typeof data.hash === "string" ? data.hash : undefined,
      }
    }
    if (data.kind === "external" && typeof data.href === "string") {
      return {
        kind: "external",
        url: data.href,
        openInNewTab: true,
      }
    }
    return parseContentLink(raw)
  } catch {
    return undefined
  }
}

export function contentLinkHref(link: ContentLink) {
  if (link.kind === "external") return link.url
  const base = pageSlugToPath(link.pageSlug)
  return link.hash ? `${base}#${link.hash}` : base
}

export function contentLinkIsExternal(link: ContentLink) {
  return link.kind === "external"
}
