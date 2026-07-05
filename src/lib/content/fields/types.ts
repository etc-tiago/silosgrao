import type { ContentType } from "@/db/schema"

export const editTipoEnum = [
  "text",
  "img",
  "bg-image",
  "video",
  "button",
  "logo-preset",
  "category-icon",
  "gallery",
  "item-list",
  "hero-strip",
  "catalog",
] as const
export type EditTipo = (typeof editTipoEnum)[number]

export type FieldDef = {
  label: string
  editTipo: EditTipo
  contentType: ContentType
  pageSlug: string
}

export type EditableFields = Record<string, FieldDef>
