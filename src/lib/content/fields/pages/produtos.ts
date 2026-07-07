import type { EditableFields } from "@/lib/content/fields/types"
import {
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
} satisfies EditableFields

export const produtosContentPaths = Object.keys(produtosEditableFields)
