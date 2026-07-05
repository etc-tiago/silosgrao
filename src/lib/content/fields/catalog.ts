import { createId } from "@/lib/content/fields/array-utils"
import { categoryIconSchema } from "@/lib/content/fields/category-icon"
import {
  DEFAULT_CATEGORY_ICONS,
  type CategoryIconId,
} from "@/lib/content/fields/category-icon"
import {
  HOME_PRODUCTS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_TITLES,
  type ProductCategoryId,
  whatsappProductUrl,
} from "@/lib/content/fields/home-products"
import { itemListActionSchema } from "@/lib/content/fields/item-list"
import { z } from "zod"

export const catalogProductSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  capacity: z.string(),
  description: z.string(),
  specs: z.array(z.string()),
  image: z.string().min(1),
  primaryAction: itemListActionSchema.optional(),
})

export const catalogCategorySchema = z.object({
  id: z.enum(["silos", "secadores", "transportadores", "infraestrutura"]),
  label: z.string().min(1),
  icon: categoryIconSchema,
  products: z.array(catalogProductSchema),
})

export const catalogValueSchema = z.object({
  categories: z.array(catalogCategorySchema),
})

export type CatalogProduct = z.infer<typeof catalogProductSchema>
export type CatalogCategory = z.infer<typeof catalogCategorySchema>
export type CatalogValue = z.infer<typeof catalogValueSchema>

export const PRODUTOS_CATALOG_PATH = "produtos.catalog" as const
export const PRODUTOS_HEADING_PATH = "produtos.heading" as const
export const PRODUTOS_LEAD_PATH = "produtos.lead" as const

export const PRODUTOS_HEADING_DEFAULT = "Produtos"
export const PRODUTOS_LEAD_DEFAULT =
  "Catálogo completo de silos, secadores, transportadores e infraestrutura metálica para armazenamento de grãos."

function buildDefaultCatalog(): CatalogValue {
  return {
    categories: PRODUCT_CATEGORIES.map(({ id }) => ({
      id,
      label: PRODUCT_CATEGORY_TITLES[id],
      icon: DEFAULT_CATEGORY_ICONS[id],
      products: (HOME_PRODUCTS[id] ?? []).map((product) => ({
        ...product,
        primaryAction: {
          label: "Solicitar orçamento",
          link: {
            kind: "external" as const,
            url: whatsappProductUrl(product.name),
            openInNewTab: true,
          },
        },
      })),
    })),
  }
}

export const DEFAULT_CATALOG_VALUE = buildDefaultCatalog()

export function serializeCatalogValue(value: CatalogValue) {
  return JSON.stringify(value)
}

export function parseCatalogValue(
  raw: string | undefined,
  legacyContent?: Record<string, string>
): CatalogValue {
  if (raw) {
    try {
      const parsed = catalogValueSchema.safeParse(JSON.parse(raw))
      if (parsed.success) return parsed.data
    } catch {
      // fall through
    }
  }

  if (legacyContent) {
    const migrated = migrateLegacyCatalog(legacyContent)
    if (migrated) return migrated
  }

  return DEFAULT_CATALOG_VALUE
}

function migrateLegacyCatalog(
  legacyContent: Record<string, string>
): CatalogValue | undefined {
  const base = buildDefaultCatalog()
  let changed = false

  const categories = base.categories.map((category) => {
    const labelOverride = legacyContent[`products.categories.${category.id}`]
    const iconOverride = legacyContent[`products.categories.${category.id}.icon`]

    let label = category.label
    let icon = category.icon

    if (labelOverride?.trim()) {
      label = labelOverride.trim()
      changed = true
    }

    if (iconOverride?.trim()) {
      const parsed = categoryIconSchema.safeParse(iconOverride.trim())
      if (parsed.success) {
        icon = parsed.data
        changed = true
      }
    }

    return { ...category, label, icon }
  })

  return changed ? { categories } : undefined
}

export function findCatalogProduct(
  catalog: CatalogValue,
  categoryId: ProductCategoryId,
  productId: number
) {
  return catalog.categories
    .find((category) => category.id === categoryId)
    ?.products.find((product) => product.id === productId)
}

export function findCatalogCategory(
  catalog: CatalogValue,
  categoryId: ProductCategoryId
) {
  return catalog.categories.find((category) => category.id === categoryId)
}

export function catalogCategories(catalog: CatalogValue) {
  return catalog.categories.map(({ id, label }) => ({ id, label }))
}

export function createCatalogProduct(nextId: number): CatalogProduct {
  return {
    id: nextId,
    name: "",
    capacity: "",
    description: "",
    specs: [],
    image: "",
  }
}

export function createCatalogCategory(
  id: ProductCategoryId,
  icon: CategoryIconId = DEFAULT_CATEGORY_ICONS[id]
): CatalogCategory {
  return {
    id,
    label: PRODUCT_CATEGORY_TITLES[id],
    icon,
    products: [],
  }
}

export function nextProductId(products: CatalogProduct[]) {
  const maxId = products.reduce((max, product) => Math.max(max, product.id), 0)
  return maxId + 1
}

export { createId }
