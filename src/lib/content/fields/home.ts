import type { EditableFields } from "@/lib/content/fields/types"

export const homeEditableFields = {
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
} satisfies EditableFields

export type HomeFieldPath = keyof typeof homeEditableFields
