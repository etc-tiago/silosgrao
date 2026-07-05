import type { ProductCategoryId } from "@/lib/content/fields/home-products"
import { z } from "zod"

export const categoryIconSchema = z.enum([
  "building-2",
  "wind",
  "droplets",
  "zap",
  "warehouse",
  "factory",
  "truck",
  "package",
  "layers",
  "box",
  "boxes",
  "cog",
  "gauge",
  "flame",
  "thermometer",
  "hard-hat",
])

export type CategoryIconId = z.infer<typeof categoryIconSchema>

export const CATEGORY_ICON_LABELS: Record<CategoryIconId, string> = {
  "building-2": "Prédio",
  wind: "Vento",
  droplets: "Gotas",
  zap: "Energia",
  warehouse: "Armazém",
  factory: "Fábrica",
  truck: "Caminhão",
  package: "Pacote",
  layers: "Camadas",
  box: "Caixa",
  boxes: "Caixas",
  cog: "Engrenagem",
  gauge: "Medidor",
  flame: "Chama",
  thermometer: "Termômetro",
  "hard-hat": "Capacete",
}

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
