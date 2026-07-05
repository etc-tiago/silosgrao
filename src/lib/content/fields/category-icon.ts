import type { ProductCategoryId } from "@/lib/content/fields/home-products"
import { z } from "zod"

export const CATEGORY_ICON_ENTRIES = [
  { id: "anchor", label: "Âncora" },
  { id: "bean", label: "Grão" },
  { id: "bolt", label: "Fixação" },
  { id: "box", label: "Caixa" },
  { id: "boxes", label: "Caixas" },
  { id: "building-2", label: "Prédio" },
  { id: "cloud", label: "Clima" },
  { id: "cog", label: "Engrenagem" },
  { id: "cone", label: "Sinalização" },
  { id: "construction", label: "Construção" },
  { id: "container", label: "Container" },
  { id: "droplets", label: "Gotas" },
  { id: "factory", label: "Fábrica" },
  { id: "filter", label: "Filtro" },
  { id: "flame", label: "Chama" },
  { id: "forklift", label: "Empilhadeira" },
  { id: "fuel", label: "Combustível" },
  { id: "gauge", label: "Medidor" },
  { id: "grid-3x3", label: "Grade" },
  { id: "hammer", label: "Martelo" },
  { id: "hard-hat", label: "Capacete" },
  { id: "home", label: "Residencial" },
  { id: "landmark", label: "Institucional" },
  { id: "layers", label: "Camadas" },
  { id: "layout-grid", label: "Módulos" },
  { id: "leaf", label: "Folha" },
  { id: "mountain", label: "Terreno" },
  { id: "network", label: "Rede" },
  { id: "nut", label: "Semente" },
  { id: "package", label: "Pacote" },
  { id: "pickaxe", label: "Picareta" },
  { id: "recycle", label: "Sustentável" },
  { id: "route", label: "Rota" },
  { id: "ruler", label: "Medidas" },
  { id: "scale", label: "Balança" },
  { id: "settings", label: "Ajustes" },
  { id: "ship", label: "Navio" },
  { id: "shovel", label: "Pá" },
  { id: "signpost", label: "Direção" },
  { id: "snowflake", label: "Refrigeração" },
  { id: "sprout", label: "Broto" },
  { id: "store", label: "Comércio" },
  { id: "sun", label: "Sol" },
  { id: "thermometer", label: "Termômetro" },
  { id: "tower-control", label: "Torre" },
  { id: "truck", label: "Caminhão" },
  { id: "utility-pole", label: "Energia" },
  { id: "warehouse", label: "Armazém" },
  { id: "waves", label: "Fluidos" },
  { id: "wheat", label: "Trigo" },
  { id: "wind", label: "Vento" },
  { id: "workflow", label: "Processo" },
  { id: "wrench", label: "Ferramenta" },
  { id: "zap", label: "Energia" },
] as const

export const categoryIconSchema = z.enum(
  CATEGORY_ICON_ENTRIES.map((entry) => entry.id) as [
    (typeof CATEGORY_ICON_ENTRIES)[number]["id"],
    ...(typeof CATEGORY_ICON_ENTRIES)[number]["id"][],
  ]
)

export type CategoryIconId = z.infer<typeof categoryIconSchema>

export const CATEGORY_ICON_LABELS: Record<CategoryIconId, string> =
  Object.fromEntries(
    CATEGORY_ICON_ENTRIES.map((entry) => [entry.id, entry.label])
  ) as Record<CategoryIconId, string>

export const DEFAULT_CATEGORY_ICONS: Record<ProductCategoryId, CategoryIconId> = {
  silos: "building-2",
  secadores: "wind",
  transportadores: "droplets",
  infraestrutura: "zap",
}

export function parseCategoryIconValue(
  raw: string | undefined,
  fallback: CategoryIconId
): CategoryIconId {
  const parsed = categoryIconSchema.safeParse(raw)
  return parsed.success ? parsed.data : fallback
}

export function categoryIconFallbackForPath(path: string): CategoryIconId {
  const match = path.match(/^products\.categories\.([^.]+)\.icon$/)
  if (!match) return "building-2"

  const id = match[1] as ProductCategoryId
  return DEFAULT_CATEGORY_ICONS[id] ?? "building-2"
}
