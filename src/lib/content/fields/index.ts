import { homeContentPaths, homeEditableFields } from "@/lib/content/fields/pages/home"
import {
  produtosContentPaths,
  produtosEditableFields,
} from "@/lib/content/fields/pages/produtos"
import {
  sobreContentPaths,
  sobreEditableFields,
} from "@/lib/content/fields/pages/sobre"
import {
  siteContentPaths,
  siteEditableFields,
} from "@/lib/content/fields/pages/site"
import type { EditableFields } from "@/lib/content/fields/types"

export const editableFieldsByPage = {
  home: homeEditableFields,
  site: siteEditableFields,
  produtos: produtosEditableFields,
  sobre: sobreEditableFields,
} as const satisfies Record<string, EditableFields>

export type ContentPageSlug = keyof typeof editableFieldsByPage

export function editableFieldsForPage(pageSlug: ContentPageSlug) {
  return editableFieldsByPage[pageSlug]
}

export function contentPathsForPage(pageSlug: ContentPageSlug) {
  switch (pageSlug) {
    case "home":
      return homeContentPaths
    case "site":
      return siteContentPaths
    case "produtos":
      return produtosContentPaths
    case "sobre":
      return sobreContentPaths
  }
}

export function mergeEditableFields(
  ...pageSlugs: ContentPageSlug[]
): EditableFields {
  return pageSlugs.reduce<EditableFields>((acc, slug) => {
    return { ...acc, ...editableFieldsByPage[slug] }
  }, {})
}

export function mergeHomeEditorFields() {
  return mergeEditableFields("home", "site")
}

export function mergeProdutosEditorFields() {
  return mergeEditableFields("produtos", "site")
}

export function mergeSobreEditorFields() {
  return mergeEditableFields("sobre", "site")
}

/** @deprecated use homeEditableFields from pages/home.ts */
export { homeEditableFields, homeContentPaths }
