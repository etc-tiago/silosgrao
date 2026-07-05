import type { FieldDef } from "@/lib/content/fields/types"
import type { ContentGroupId } from "@/lib/content/fields/search"
import {
  ImageIcon,
  Layers,
  Palette,
  Shapes,
  Type,
  type LucideIcon,
} from "lucide-react"

export type ContentFieldGroup = {
  id: ContentGroupId
  label: string
  panelTitle: string
  icon: LucideIcon
  fields: Array<[string, FieldDef]>
}

const GROUP_META: Record<
  ContentGroupId,
  { label: string; panelTitle: string; icon: LucideIcon }
> = {
  textos: { label: "Textos", panelTitle: "Textos da página", icon: Type },
  imagens: { label: "Imagens", panelTitle: "Imagens da página", icon: ImageIcon },
  secoes: { label: "Seções", panelTitle: "Seções da página", icon: Layers },
  icones: { label: "Ícones", panelTitle: "Ícones da página", icon: Shapes },
  logo: { label: "Logo", panelTitle: "Logo da página", icon: Palette },
}

export function getContentGroupIdForField(field: FieldDef): ContentGroupId | null {
  if (field.editTipo === "text" || field.editTipo === "button") return "textos"
  if (field.editTipo === "img" || field.editTipo === "bg-image") return "imagens"
  if (
    field.editTipo === "gallery" ||
    field.editTipo === "item-list" ||
    field.editTipo === "hero-strip" ||
    field.editTipo === "catalog"
  ) {
    return "secoes"
  }
  if (field.editTipo === "category-icon") return "icones"
  if (field.editTipo === "logo-preset") return "logo"
  return null
}

export function buildContentFieldGroups(grouped: {
  textFields: Array<[string, FieldDef]>
  imageFields: Array<[string, FieldDef]>
  sectionFields: Array<[string, FieldDef]>
  logoFields: Array<[string, FieldDef]>
  iconFields: Array<[string, FieldDef]>
}): ContentFieldGroup[] {
  const groups: Array<[ContentGroupId, Array<[string, FieldDef]>]> = [
    ["textos", grouped.textFields],
    ["imagens", grouped.imageFields],
    ["secoes", grouped.sectionFields],
    ["icones", grouped.iconFields],
    ["logo", grouped.logoFields],
  ]

  return groups.map(([id, fields]) => ({
    id,
    fields,
    ...GROUP_META[id],
  }))
}

export function getContentGroupPanelTitle(categoria: ContentGroupId) {
  return GROUP_META[categoria].panelTitle
}
