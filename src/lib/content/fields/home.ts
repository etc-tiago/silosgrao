import type { EditableFields } from "@/lib/content/fields/types"

export const HERO_IMAGE_DEFAULT =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2026-07-03-17-11-49%202-I6gTLjbHgz46DFOg9LglSdNaboEAF4.jpg"

export const homeEditableFields = {
  "hero.image": {
    label: "Imagem de fundo",
    editTipo: "bg-image",
    contentType: "json",
    pageSlug: "home",
  },
  "hero.title": {
    label: "Título",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "hero.subtitle": {
    label: "Subtítulo",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "hero.cta.primary": {
    label: "Botão principal",
    editTipo: "button",
    contentType: "json",
    pageSlug: "home",
  },
  "hero.cta.whatsapp": {
    label: "Botão WhatsApp",
    editTipo: "button",
    contentType: "json",
    pageSlug: "home",
  },
} satisfies EditableFields

export type HomeFieldPath = keyof typeof homeEditableFields

export const homeContentPaths = Object.keys(
  homeEditableFields
) as HomeFieldPath[]
