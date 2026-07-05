import { createId, moveArrayItem } from "@/lib/content/fields/array-utils"
import { contentLinkSchema } from "@/lib/content/fields/link"
import { HERO_COLUMN_DEFAULTS } from "@/lib/content/fields/home-hero"
import { z } from "zod"

export const heroTileSchema = z.object({
  id: z.string().min(1),
  image: z.string().min(1),
  caption: z.string(),
  link: contentLinkSchema.optional(),
})

export const heroStripValueSchema = z.object({
  tiles: z.array(heroTileSchema),
})

export type HeroTile = z.infer<typeof heroTileSchema>
export type HeroStripValue = z.infer<typeof heroStripValueSchema>

export const HERO_TILES_PATH = "hero.tiles" as const

const DEFAULT_HERO_CAPTIONS = [
  "Silos",
  "Secadores",
  "Transportadores",
  "Infraestrutura",
  "Soluções",
] as const

export const DEFAULT_HERO_STRIP_VALUE: HeroStripValue = {
  tiles: HERO_COLUMN_DEFAULTS.map((image, index) => ({
    id: `hero-tile-${index + 1}`,
    image,
    caption: DEFAULT_HERO_CAPTIONS[index] ?? "",
  })),
}

export function serializeHeroStripValue(value: HeroStripValue) {
  return JSON.stringify(value)
}

function migrateLegacyHeroTiles(
  legacyContent: Record<string, string>
): HeroStripValue | undefined {
  const tiles: HeroTile[] = []

  for (let index = 1; index <= 5; index += 1) {
    const image =
      legacyContent[`hero.columns.${index}`] ??
      HERO_COLUMN_DEFAULTS[index - 1]
    const caption = legacyContent[`hero.categories.${index}`] ?? ""
    const fallback = DEFAULT_HERO_STRIP_VALUE.tiles[index - 1]

    tiles.push({
      id: fallback?.id ?? createId("hero-tile"),
      image: image ?? fallback?.image ?? "",
      caption: caption || fallback?.caption || "",
      link: fallback?.link,
    })
  }

  return tiles.some((tile) => tile.image) ? { tiles } : undefined
}

export function parseHeroStripValue(
  raw: string | undefined,
  legacyContent?: Record<string, string>
): HeroStripValue {
  if (raw) {
    try {
      const parsed = heroStripValueSchema.safeParse(JSON.parse(raw))
      if (parsed.success) return parsed.data
    } catch {
      // fall through
    }
  }

  if (legacyContent) {
    const migrated = migrateLegacyHeroTiles(legacyContent)
    if (migrated) return migrated
  }

  return DEFAULT_HERO_STRIP_VALUE
}

export function createHeroTile(): HeroTile {
  return { id: createId("hero-tile"), image: "", caption: "" }
}

export { moveArrayItem }
