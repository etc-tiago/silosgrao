import type { EditableFields } from "@/lib/content/fields/types"

const columnIndices = [1, 2, 3, 4, 5] as const

const columnFields = Object.fromEntries(
  columnIndices.map((i) => [
    `hero.columns.${i}`,
    {
      label: `Imagem coluna ${i}`,
      editTipo: "img" as const,
      contentType: "image" as const,
      pageSlug: "home",
    },
  ])
)

const categoryFields = Object.fromEntries(
  columnIndices.map((i) => [
    `hero.categories.${i}`,
    {
      label: `Categoria coluna ${i}`,
      editTipo: "text" as const,
      contentType: "text" as const,
      pageSlug: "home",
    },
  ])
)

export const homeEditableFields = {
  "hero.headline.line1": {
    label: "Título — linha 1",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "hero.headline.line2": {
    label: "Título — linha 2",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "hero.intro": {
    label: "Apresentação",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  ...columnFields,
  ...categoryFields,
} satisfies EditableFields

export type HomeFieldPath = keyof typeof homeEditableFields

export const homeContentPaths = Object.keys(
  homeEditableFields
) as HomeFieldPath[]
