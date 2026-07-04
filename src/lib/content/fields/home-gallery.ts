export type GalleryImage = {
  url: string
  alt: string
  category: string
}

export const HOME_GALLERY_IMAGES = [
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-49%205-4Yi4d020Qf3VuOvVwmRiQoleY4vg7K.jpg",
    alt: "Silos com estrutura verde de suporte",
    category: "Silos",
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-48-l5zdMTZGkINiN6KfyFb8crSwLqTPPv.jpg",
    alt: "Transportador e silos em funcionamento",
    category: "Transportadores",
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-50%202-YD6TDONX0JaPTY91buBkMXn7SeGMvl.jpg",
    alt: "Silo cilíndrico metálico",
    category: "Silos",
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52%205-zwHmJKuVoXRAQbByjRIeecEGn7vS11.jpg",
    alt: "Secador industrial em operação",
    category: "Secadores",
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-52%204-jDMhsrppVAlVevleSoUgYdR0xIfwzD.jpg",
    alt: "Sistema integrado de silos",
    category: "Infraestrutura",
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-53%203-gRR5d28i03A6yHHX9Jw4Rs53oBlkiO.jpg",
    alt: "Infraestrutura metálica de suporte",
    category: "Infraestrutura",
  },
] as const satisfies readonly GalleryImage[]
