import type { EditableFields } from "@/lib/content/fields/types"
import { INTENT_INDICES, intentItemPath } from "@/lib/content/fields/home-intents"
import { PRODUCT_CATEGORIES } from "@/lib/content/fields/home-products"

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

const productCategoryFields = Object.fromEntries(
  PRODUCT_CATEGORIES.map(({ id, label }) => [
    `products.categories.${id}`,
    {
      label: `Produtos — ${label}`,
      editTipo: "text" as const,
      contentType: "text" as const,
      pageSlug: "home",
    },
  ])
)

const productCategoryIconFields = Object.fromEntries(
  PRODUCT_CATEGORIES.map(({ id, label }) => [
    `products.categories.${id}.icon`,
    {
      label: `Produtos — ícone ${label}`,
      editTipo: "category-icon" as const,
      contentType: "text" as const,
      pageSlug: "home",
    },
  ])
)

const intentItemFields = Object.fromEntries(
  INTENT_INDICES.flatMap((index) => {
    const label = `Intenções — item ${index}`
    return [
      [
        intentItemPath(index, "title"),
        {
          label: `${label} — título`,
          editTipo: "text" as const,
          contentType: "text" as const,
          pageSlug: "home",
        },
      ],
      [
        intentItemPath(index, "description"),
        {
          label: `${label} — descrição`,
          editTipo: "text" as const,
          contentType: "text" as const,
          pageSlug: "home",
        },
      ],
      [
        intentItemPath(index, "image"),
        {
          label: `${label} — imagem`,
          editTipo: "img" as const,
          contentType: "image" as const,
          pageSlug: "home",
        },
      ],
      [
        intentItemPath(index, "link"),
        {
          label: `${label} — destino`,
          editTipo: "intent-link" as const,
          contentType: "text" as const,
          pageSlug: "home",
        },
      ],
    ]
  })
)

export const homeEditableFields = {
  "header.logoPreset": {
    label: "Cor da logo",
    editTipo: "logo-preset",
    contentType: "text",
    pageSlug: "home",
  },
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
  "products.sectionTitle": {
    label: "Produtos — título da seção",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "intents.heading.line1": {
    label: "Intenções — título linha 1",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "intents.heading.line2": {
    label: "Intenções — título linha 2",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "intents.cta": {
    label: "Intenções — botão Falar conosco",
    editTipo: "button",
    contentType: "text",
    pageSlug: "home",
  },
  "gallery.heading.line1": {
    label: "Galeria — título linha 1",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "gallery.heading.line2": {
    label: "Galeria — título linha 2",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "gallery.lead": {
    label: "Galeria — texto de apoio",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "gallery.items": {
    label: "Galeria — itens e fotos",
    editTipo: "gallery",
    contentType: "text",
    pageSlug: "home",
  },
  ...intentItemFields,
  ...productCategoryFields,
  ...productCategoryIconFields,
  ...columnFields,
  ...categoryFields,
} satisfies EditableFields

export type HomeFieldPath = keyof typeof homeEditableFields

export const homeContentPaths = Object.keys(
  homeEditableFields
) as HomeFieldPath[]
