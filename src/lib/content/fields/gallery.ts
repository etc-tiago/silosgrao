import { createId, moveArrayItem } from "@/lib/content/fields/array-utils"
import { z } from "zod"

export const gallerySlideSchema = z.object({
  id: z.string().min(1),
  url: z.string().min(1),
  caption: z.string(),
})

export const galleryValueSchema = z.object({
  slides: z.array(gallerySlideSchema),
})

export type GallerySlide = z.infer<typeof gallerySlideSchema>
export type GalleryValue = z.infer<typeof galleryValueSchema>

export const GALLERY_HEADING_LINE1_PATH = "gallery.heading.line1" as const
export const GALLERY_HEADING_LINE2_PATH = "gallery.heading.line2" as const
export const GALLERY_LEAD_PATH = "gallery.lead" as const
export const GALLERY_SLIDES_PATH = "gallery.slides" as const

/** @deprecated use GALLERY_SLIDES_PATH */
export const GALLERY_ITEMS_PATH = GALLERY_SLIDES_PATH

export const GALLERY_HEADING_LINE1_DEFAULT = "Veja em"
export const GALLERY_HEADING_LINE2_DEFAULT = "Ação"
export const GALLERY_LEAD_DEFAULT =
  "Conheça todos os detalhes dos nossos produtos através de fotos reais de nossas obras e instalações"

const DEFAULT_GALLERY_SLIDES: GallerySlide[] = [
  {
    id: "gallery-1",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-49%205-4Yi4d020Qf3VuOvVwmRiQoleY4vg7K.jpg",
    caption: "Silos com estrutura verde de suporte",
  },
  {
    id: "gallery-2",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-48-l5zdMTZGkINiN6KfyFb8crSwLqTPPv.jpg",
    caption: "Transportador e silos em funcionamento",
  },
  {
    id: "gallery-3",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-50%202-YD6TDONX0JaPTY91buBkMXn7SeGMvl.jpg",
    caption: "Silo cilíndrico metálico",
  },
  {
    id: "gallery-4",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52%205-zwHmJKuVoXRAQbByjRIeecEGn7vS11.jpg",
    caption: "Secador industrial em operação",
  },
  {
    id: "gallery-5",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52%204-jDMhsrppVAlVevleSoUgYdR0xIfwzD.jpg",
    caption: "Sistema integrado de silos",
  },
  {
    id: "gallery-6",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-53%203-gRR5d28i03A6yHHX9Jw4Rs53oBlkiO.jpg",
    caption: "Infraestrutura metálica de suporte",
  },
]

export const DEFAULT_GALLERY_VALUE: GalleryValue = {
  slides: DEFAULT_GALLERY_SLIDES,
}

export function galleryHeadingLine1(raw: string | undefined) {
  return raw?.trim() || GALLERY_HEADING_LINE1_DEFAULT
}

export function galleryHeadingLine2(raw: string | undefined) {
  return raw?.trim() || GALLERY_HEADING_LINE2_DEFAULT
}

export function galleryLead(raw: string | undefined) {
  return raw?.trim() || GALLERY_LEAD_DEFAULT
}

export function serializeGalleryValue(value: GalleryValue) {
  return JSON.stringify(value)
}

/** Flattens legacy nested gallery.items JSON */
function migrateLegacyGallery(raw: string): GalleryValue | undefined {
  try {
    const data = JSON.parse(raw) as {
      items?: Array<{
        id: string
        title: string
        category: string
        photos: Array<{ url: string; alt?: string }>
      }>
    }
    if (!data.items?.length) return undefined

    const slides: GallerySlide[] = []
    for (const item of data.items) {
      for (const photo of item.photos ?? []) {
        slides.push({
          id: createId("slide"),
          url: photo.url,
          caption:
            photo.alt?.trim() ||
            item.title?.trim() ||
            item.category?.trim() ||
            "",
        })
      }
    }
    return slides.length > 0 ? { slides } : undefined
  } catch {
    return undefined
  }
}

export function parseGalleryValue(
  raw: string | undefined,
  legacyContent?: Record<string, string>
): GalleryValue {
  if (raw) {
    try {
      const parsed = galleryValueSchema.safeParse(JSON.parse(raw))
      if (parsed.success) return parsed.data

      const migrated = migrateLegacyGallery(raw)
      if (migrated) return migrated
    } catch {
      const migrated = migrateLegacyGallery(raw)
      if (migrated) return migrated
    }
  }

  const legacyRaw =
    legacyContent?.["gallery.items"] ?? legacyContent?.[GALLERY_SLIDES_PATH]
  if (legacyRaw) {
    const migrated = migrateLegacyGallery(legacyRaw)
    if (migrated) return migrated
  }

  return DEFAULT_GALLERY_VALUE
}

export function createGallerySlide(): GallerySlide {
  return { id: createId("slide"), url: "", caption: "" }
}

export { moveArrayItem }
