import { z } from "zod"

export const catalogSortSchema = z.enum(["title", "price", "created"])
export type CatalogSort = z.infer<typeof catalogSortSchema>

export const catalogListInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(24),
  search: z.string().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  sort: catalogSortSchema.default("created"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
})

export const catalogProductInputSchema = z.object({
  title: z.string().min(1),
  priceCents: z.number().int().min(0),
  description: z.string().nullable().optional(),
  capacity: z.string().nullable().optional(),
  specs: z.array(z.string().min(1)).optional(),
  imageUrl: z.string().min(1),
  categoryId: z.number().int().positive().nullable().optional(),
  gallery: z.array(z.string().min(1)).optional(),
  showOnHomepage: z.boolean().optional(),
})

export const catalogCategoryInputSchema = z.object({
  id: z.number().int().positive().optional(),
  label: z.string().min(1),
  slug: z.string().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export type CatalogListItem = {
  id: number
  slug: string
  title: string
  priceCents: number
  description: string | null
  capacity: string | null
  specs: string[]
  imageUrl: string
  categoryId: number | null
  categoryLabel: string | null
  showOnHomepage: boolean
  createdAt: Date
}

export type HomepageCatalogCategory = {
  category: CatalogCategoryWithCount
  products: CatalogListItem[]
}

export type CatalogProductDetail = CatalogListItem & {
  gallery: Array<{ id: number; imageUrl: string; sortOrder: number }>
  updatedAt: Date
}

export type CatalogCategoryWithCount = {
  id: number
  slug: string
  label: string
  sortOrder: number
  productCount: number
}

export type CatalogImportRow = {
  slug?: string
  title: string
  priceCents: number
  categorySlug?: string | null
  description?: string | null
  capacity?: string | null
  specs?: string[]
  imageUrl: string
  galleryUrls?: string[]
}
