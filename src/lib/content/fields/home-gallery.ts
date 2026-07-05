import { z } from "zod"

export const galleryPhotoSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
})

export const galleryItemSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  category: z.string(),
  photos: z.array(galleryPhotoSchema).min(1),
})

export const galleryValueSchema = z.object({
  items: z.array(galleryItemSchema),
})

export type GalleryPhoto = z.infer<typeof galleryPhotoSchema>
export type GalleryItem = z.infer<typeof galleryItemSchema>
export type GalleryValue = z.infer<typeof galleryValueSchema>

export const GALLERY_HEADING_LINE1_PATH = "gallery.heading.line1" as const
export const GALLERY_HEADING_LINE2_PATH = "gallery.heading.line2" as const
export const GALLERY_LEAD_PATH = "gallery.lead" as const
export const GALLERY_ITEMS_PATH = "gallery.items" as const

export const GALLERY_HEADING_LINE1_DEFAULT = "Veja em"
export const GALLERY_HEADING_LINE2_DEFAULT = "Ação"
export const GALLERY_LEAD_DEFAULT =
  "Conheça todos os detalhes dos nossos produtos através de fotos reais de nossas obras e instalações"

export function galleryHeadingLine1(raw: string | undefined) {
  return raw?.trim() || GALLERY_HEADING_LINE1_DEFAULT
}

export function galleryHeadingLine2(raw: string | undefined) {
  return raw?.trim() || GALLERY_HEADING_LINE2_DEFAULT
}

export function galleryLead(raw: string | undefined) {
  return raw?.trim() || GALLERY_LEAD_DEFAULT
}

const defaultGalleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    title: "Silos com estrutura verde de suporte",
    category: "Silos",
    photos: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-49%205-4Yi4d020Qf3VuOvVwmRiQoleY4vg7K.jpg",
        alt: "Silos com estrutura verde de suporte",
      },
    ],
  },
  {
    id: "gallery-2",
    title: "Transportador e silos em funcionamento",
    category: "Transportadores",
    photos: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-48-l5zdMTZGkINiN6KfyFb8crSwLqTPPv.jpg",
        alt: "Transportador e silos em funcionamento",
      },
    ],
  },
  {
    id: "gallery-3",
    title: "Silo cilíndrico metálico",
    category: "Silos",
    photos: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-50%202-YD6TDONX0JaPTY91buBkMXn7SeGMvl.jpg",
        alt: "Silo cilíndrico metálico",
      },
    ],
  },
  {
    id: "gallery-4",
    title: "Secador industrial em operação",
    category: "Secadores",
    photos: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52%205-zwHmJKuVoXRAQbByjRIeecEGn7vS11.jpg",
        alt: "Secador industrial em operação",
      },
    ],
  },
  {
    id: "gallery-5",
    title: "Sistema integrado de silos",
    category: "Infraestrutura",
    photos: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52%204-jDMhsrppVAlVevleSoUgYdR0xIfwzD.jpg",
        alt: "Sistema integrado de silos",
      },
    ],
  },
  {
    id: "gallery-6",
    title: "Infraestrutura metálica de suporte",
    category: "Infraestrutura",
    photos: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-53%203-gRR5d28i03A6yHHX9Jw4Rs53oBlkiO.jpg",
        alt: "Infraestrutura metálica de suporte",
      },
    ],
  },
]

export const DEFAULT_GALLERY_VALUE: GalleryValue = {
  items: defaultGalleryItems,
}

/** @deprecated use parseGalleryValue */
export const HOME_GALLERY_IMAGES = defaultGalleryItems.map((item) => ({
  url: item.photos[0]!.url,
  alt: item.title,
  category: item.category,
}))

export function serializeGalleryValue(value: GalleryValue) {
  return JSON.stringify(value)
}

export function parseGalleryValue(raw: string | undefined): GalleryValue {
  if (!raw) return DEFAULT_GALLERY_VALUE
  try {
    const parsed = galleryValueSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : DEFAULT_GALLERY_VALUE
  } catch {
    return DEFAULT_GALLERY_VALUE
  }
}

export function galleryItemCover(item: GalleryItem) {
  return item.photos[0]?.url ?? ""
}

export function galleryPhotoAlt(photo: GalleryPhoto, item: GalleryItem) {
  return photo.alt?.trim() || item.title
}

export function createGalleryItem(): GalleryItem {
  return {
    id: `gallery-${crypto.randomUUID()}`,
    title: "",
    category: "",
    photos: [],
  }
}

export function moveArrayItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length || from === to) return items
  const next = [...items]
  const [removed] = next.splice(from, 1)
  next.splice(to, 0, removed!)
  return next
}
