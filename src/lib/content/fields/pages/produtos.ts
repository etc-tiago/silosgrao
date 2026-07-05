import type { EditableFields } from "@/lib/content/fields/types"
import {
  PRODUTOS_CATALOG_PATH,
  PRODUTOS_HEADING_PATH,
  PRODUTOS_LEAD_PATH,
} from "@/lib/content/fields/catalog"

export const produtosEditableFields = {
  [PRODUTOS_HEADING_PATH]: {
    label: "Produtos — título",
    editTipo: "text",
    contentType: "text",
    pageSlug: "produtos",
  },
  [PRODUTOS_LEAD_PATH]: {
    label: "Produtos — intro",
    editTipo: "text",
    contentType: "text",
    pageSlug: "produtos",
  },
  [PRODUTOS_CATALOG_PATH]: {
    label: "Produtos — catálogo",
    editTipo: "catalog",
    contentType: "text",
    pageSlug: "produtos",
  },
} satisfies EditableFields

export const produtosContentPaths = Object.keys(produtosEditableFields)
