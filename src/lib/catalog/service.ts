import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  isNull,
  ne,
  sql,
} from "drizzle-orm"
import type { Db } from "@/db/client"
import {
  catalogCategories,
  catalogProductImages,
  catalogProducts,
} from "@/db/schema"
import { buildFtsQuery, deleteProductFts, syncProductFts } from "@/lib/catalog/fts"
import {
  resolveProductFields,
  serializeSpecs,
} from "@/lib/catalog/product-fields"
import { slugify, uniqueSlug } from "@/lib/catalog/slug"
import type {
  CatalogCategoryWithCount,
  CatalogImportRow,
  CatalogListItem,
  CatalogProductDetail,
  CatalogSort,
  HomepageCatalogCategory,
} from "@/lib/catalog/types"

export const HOMEPAGE_FEATURED_LIMIT = 3

export const HOMEPAGE_LIMIT_ERROR =
  "Limite de 3 produtos na homepage já atingido nesta categoria."

type ProductRow = {
  id: number
  slug: string
  title: string
  priceCents: number
  description: string | null
  capacity: string | null
  specs: string | null
  imageUrl: string
  categoryId: number | null
  categoryLabel: string | null
  showOnHomepage: number
  createdAt: Date
}

function mapProductRow(row: ProductRow): CatalogListItem {
  const fields = resolveProductFields(row)

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    priceCents: row.priceCents,
    description: fields.description,
    capacity: fields.capacity,
    specs: fields.specs,
    imageUrl: row.imageUrl,
    categoryId: row.categoryId,
    categoryLabel: row.categoryLabel,
    showOnHomepage: row.showOnHomepage === 1,
    createdAt: row.createdAt,
  }
}

function productSelectFields() {
  return {
    id: catalogProducts.id,
    slug: catalogProducts.slug,
    title: catalogProducts.title,
    priceCents: catalogProducts.priceCents,
    description: catalogProducts.description,
    capacity: catalogProducts.capacity,
    specs: catalogProducts.specs,
    imageUrl: catalogProducts.imageUrl,
    categoryId: catalogProducts.categoryId,
    categoryLabel: catalogCategories.label,
    showOnHomepage: catalogProducts.showOnHomepage,
    createdAt: catalogProducts.createdAt,
  }
}

type ListProductsInput = {
  page: number
  pageSize: number
  search?: string
  categoryId?: number | null
  sort: CatalogSort
  sortDir: "asc" | "desc"
}

function sortColumn(sort: CatalogSort) {
  switch (sort) {
    case "title":
      return catalogProducts.title
    case "price":
      return catalogProducts.priceCents
    case "created":
    default:
      return catalogProducts.createdAt
  }
}

export async function listCatalogProducts(
  db: Db,
  input: ListProductsInput
): Promise<{ items: CatalogListItem[]; total: number }> {
  const { page, pageSize, search, categoryId, sort, sortDir } = input
  const offset = (page - 1) * pageSize
  const ftsQuery = search?.trim() ? buildFtsQuery(search) : null

  const categoryFilter =
    categoryId === null
      ? isNull(catalogProducts.categoryId)
      : categoryId
        ? eq(catalogProducts.categoryId, categoryId)
        : undefined

  let productIds: number[] | null = null

  if (ftsQuery) {
    const ftsRows = await db.all<{ rowid: number }>(
      sql`SELECT rowid FROM catalog_products_fts WHERE catalog_products_fts MATCH ${ftsQuery} ORDER BY rank`
    )
    productIds = ftsRows.map((row) => row.rowid)
    if (productIds.length === 0) {
      return { items: [], total: 0 }
    }
  }

  const filters = [
    productIds ? inArray(catalogProducts.id, productIds) : undefined,
    categoryFilter,
  ].filter(Boolean)

  const whereClause = filters.length > 0 ? and(...filters) : undefined

  const [totalRow] = await db
    .select({ total: count() })
    .from(catalogProducts)
    .where(whereClause)

  const order = sortDir === "asc" ? asc(sortColumn(sort)) : desc(sortColumn(sort))

  const rows = await db
    .select(productSelectFields())
    .from(catalogProducts)
    .leftJoin(
      catalogCategories,
      eq(catalogProducts.categoryId, catalogCategories.id)
    )
    .where(whereClause)
    .orderBy(order)
    .limit(pageSize)
    .offset(offset)

  return {
    items: rows.map(mapProductRow),
    total: totalRow?.total ?? 0,
  }
}

export async function getCatalogProduct(
  db: Db,
  slug: string
): Promise<CatalogProductDetail | null> {
  const [product] = await db
    .select({
      ...productSelectFields(),
      updatedAt: catalogProducts.updatedAt,
    })
    .from(catalogProducts)
    .leftJoin(
      catalogCategories,
      eq(catalogProducts.categoryId, catalogCategories.id)
    )
    .where(eq(catalogProducts.slug, slug))
    .limit(1)

  if (!product) return null

  const gallery = await db
    .select({
      id: catalogProductImages.id,
      imageUrl: catalogProductImages.imageUrl,
      sortOrder: catalogProductImages.sortOrder,
    })
    .from(catalogProductImages)
    .where(eq(catalogProductImages.productId, product.id))
    .orderBy(asc(catalogProductImages.sortOrder))

  return { ...mapProductRow(product), updatedAt: product.updatedAt, gallery }
}

export async function countFeaturedInCategory(
  db: Db,
  categoryId: number,
  excludeProductId?: number
) {
  const filters = [
    eq(catalogProducts.categoryId, categoryId),
    eq(catalogProducts.showOnHomepage, 1),
    excludeProductId ? ne(catalogProducts.id, excludeProductId) : undefined,
  ].filter(Boolean)

  const [row] = await db
    .select({ total: count() })
    .from(catalogProducts)
    .where(and(...filters))

  return row?.total ?? 0
}

export async function assertCanFeatureOnHomepage(
  db: Db,
  categoryId: number | null | undefined,
  showOnHomepage: boolean,
  excludeProductId?: number
) {
  if (!showOnHomepage) return

  if (!categoryId) {
    throw new Error("Selecione uma categoria para destacar na homepage.")
  }

  const featuredCount = await countFeaturedInCategory(
    db,
    categoryId,
    excludeProductId
  )

  if (featuredCount >= HOMEPAGE_FEATURED_LIMIT) {
    throw new Error(HOMEPAGE_LIMIT_ERROR)
  }
}

export async function getHomepageFeaturedStatus(
  db: Db,
  categoryId: number,
  excludeProductId?: number
) {
  const featuredCount = await countFeaturedInCategory(
    db,
    categoryId,
    excludeProductId
  )

  return {
    categoryId,
    count: featuredCount,
    limit: HOMEPAGE_FEATURED_LIMIT,
    canEnable: featuredCount < HOMEPAGE_FEATURED_LIMIT,
  }
}

async function listProductsForCategory(db: Db, categoryId: number) {
  const rows = await db
    .select(productSelectFields())
    .from(catalogProducts)
    .leftJoin(
      catalogCategories,
      eq(catalogProducts.categoryId, catalogCategories.id)
    )
    .where(eq(catalogProducts.categoryId, categoryId))
    .orderBy(asc(catalogProducts.sortOrder), asc(catalogProducts.title))

  return rows.map(mapProductRow)
}

function selectHomepageProducts(products: CatalogListItem[]) {
  const featured = products
    .filter((product) => product.showOnHomepage)
    .slice(0, HOMEPAGE_FEATURED_LIMIT)

  const featuredIds = new Set(featured.map((product) => product.id))
  const fillers = products
    .filter((product) => !featuredIds.has(product.id))
    .slice(0, HOMEPAGE_FEATURED_LIMIT - featured.length)

  return [...featured, ...fillers]
}

export async function getHomepageCatalogByCategory(
  db: Db
): Promise<HomepageCatalogCategory[]> {
  const categories = await listCatalogCategories(db)
  const result: HomepageCatalogCategory[] = []

  for (const category of categories) {
    const products = selectHomepageProducts(
      await listProductsForCategory(db, category.id)
    )

    if (products.length > 0) {
      result.push({ category, products })
    }
  }

  return result
}

export async function getPublicCatalogByCategory(
  db: Db
): Promise<HomepageCatalogCategory[]> {
  const categories = await listCatalogCategories(db)
  const result: HomepageCatalogCategory[] = []

  for (const category of categories) {
    const products = await listProductsForCategory(db, category.id)

    if (products.length > 0) {
      result.push({ category, products })
    }
  }

  return result
}

async function existingProductSlugs(db: Db) {
  const rows = await db.select({ slug: catalogProducts.slug }).from(catalogProducts)
  return new Set(rows.map((row) => row.slug))
}

async function existingCategorySlugs(db: Db) {
  const rows = await db
    .select({ slug: catalogCategories.slug })
    .from(catalogCategories)
  return new Set(rows.map((row) => row.slug))
}

export async function createCatalogProduct(
  db: Db,
  editorId: number,
  input: {
    title: string
    priceCents: number
    description?: string | null
    capacity?: string | null
    specs?: string[]
    imageUrl: string
    categoryId?: number | null
    gallery?: string[]
    slug?: string
    showOnHomepage?: boolean
  }
) {
  const categoryId = input.categoryId ?? null
  const showOnHomepage = Boolean(input.showOnHomepage && categoryId)

  await assertCanFeatureOnHomepage(db, categoryId, showOnHomepage)

  const slugs = await existingProductSlugs(db)
  const slug = input.slug
    ? uniqueSlug(input.slug, slugs)
    : uniqueSlug(input.title, slugs)
  const now = new Date()

  const [product] = await db
    .insert(catalogProducts)
    .values({
      slug,
      title: input.title,
      priceCents: input.priceCents,
      description: input.description ?? null,
      capacity: input.capacity?.trim() || null,
      specs: serializeSpecs(input.specs ?? []),
      imageUrl: input.imageUrl,
      categoryId,
      showOnHomepage: showOnHomepage ? 1 : 0,
      updatedBy: editorId,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  if (!product) {
    throw new Error("Falha ao criar produto.")
  }

  if (input.gallery?.length) {
    await db.insert(catalogProductImages).values(
      input.gallery.map((imageUrl, index) => ({
        productId: product.id,
        imageUrl,
        sortOrder: index,
      }))
    )
  }

  await syncProductFts(db, product.id, product.title, product.description)

  return getCatalogProduct(db, product.slug)
}

export async function updateCatalogProduct(
  db: Db,
  editorId: number,
  slug: string,
  input: {
    title: string
    priceCents: number
    description?: string | null
    capacity?: string | null
    specs?: string[]
    imageUrl: string
    categoryId?: number | null
    gallery?: string[]
    showOnHomepage?: boolean
  }
) {
  const existing = await getCatalogProduct(db, slug)
  if (!existing) return null

  const categoryId = input.categoryId ?? null
  const showOnHomepage = Boolean(
    input.showOnHomepage && categoryId
  )

  await assertCanFeatureOnHomepage(
    db,
    categoryId,
    showOnHomepage,
    existing.id
  )

  const now = new Date()

  await db
    .update(catalogProducts)
    .set({
      title: input.title,
      priceCents: input.priceCents,
      description: input.description ?? null,
      capacity: input.capacity?.trim() || null,
      specs: serializeSpecs(input.specs ?? []),
      imageUrl: input.imageUrl,
      categoryId,
      showOnHomepage: showOnHomepage ? 1 : 0,
      updatedBy: editorId,
      updatedAt: now,
    })
    .where(eq(catalogProducts.slug, slug))

  if (input.gallery !== undefined) {
    await db
      .delete(catalogProductImages)
      .where(eq(catalogProductImages.productId, existing.id))

    if (input.gallery.length > 0) {
      await db.insert(catalogProductImages).values(
        input.gallery.map((imageUrl, index) => ({
          productId: existing.id,
          imageUrl,
          sortOrder: index,
        }))
      )
    }
  }

  await syncProductFts(db, existing.id, input.title, input.description ?? null)

  return getCatalogProduct(db, slug)
}

export async function deleteCatalogProduct(db: Db, slug: string) {
  const existing = await getCatalogProduct(db, slug)
  if (!existing) return false

  await db.delete(catalogProducts).where(eq(catalogProducts.slug, slug))
  await deleteProductFts(db, existing.id)

  return true
}

export async function listCatalogCategories(
  db: Db
): Promise<CatalogCategoryWithCount[]> {
  const rows = await db
    .select({
      id: catalogCategories.id,
      slug: catalogCategories.slug,
      label: catalogCategories.label,
      sortOrder: catalogCategories.sortOrder,
      productCount: count(catalogProducts.id),
    })
    .from(catalogCategories)
    .leftJoin(
      catalogProducts,
      eq(catalogProducts.categoryId, catalogCategories.id)
    )
    .groupBy(catalogCategories.id)
    .orderBy(asc(catalogCategories.sortOrder), asc(catalogCategories.label))

  return rows
}

export async function upsertCatalogCategory(
  db: Db,
  input: {
    id?: number
    label: string
    slug?: string
    sortOrder?: number
  }
) {
  const now = new Date()

  if (input.id) {
    const [existing] = await db
      .select()
      .from(catalogCategories)
      .where(eq(catalogCategories.id, input.id))
      .limit(1)

    if (!existing) return null

    const [updated] = await db
      .update(catalogCategories)
      .set({
        label: input.label,
        slug: input.slug ?? existing.slug,
        sortOrder: input.sortOrder ?? existing.sortOrder,
        updatedAt: now,
      })
      .where(eq(catalogCategories.id, input.id))
      .returning()

    return updated ?? null
  }

  const slugs = await existingCategorySlugs(db)
  const slug = uniqueSlug(input.slug ?? input.label, slugs)

  const [created] = await db
    .insert(catalogCategories)
    .values({
      slug,
      label: input.label,
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return created ?? null
}

export async function deleteCatalogCategory(db: Db, id: number) {
  const [existing] = await db
    .select({ id: catalogCategories.id })
    .from(catalogCategories)
    .where(eq(catalogCategories.id, id))
    .limit(1)

  if (!existing) return false

  await db
    .update(catalogProducts)
    .set({ categoryId: null })
    .where(eq(catalogProducts.categoryId, id))

  await db.delete(catalogCategories).where(eq(catalogCategories.id, id))

  return true
}

export async function findCategoryBySlug(db: Db, slug: string) {
  const [category] = await db
    .select()
    .from(catalogCategories)
    .where(eq(catalogCategories.slug, slug))
    .limit(1)

  return category ?? null
}

export function parseImportRow(row: Record<string, string>): CatalogImportRow | null {
  const title = row.title?.trim()
  const imageUrl = row.image_url?.trim() || row.imageUrl?.trim()

  if (!title || !imageUrl) return null

  const priceRaw = row.price?.trim() || row.price_cents?.trim() || "0"
  const priceCents = priceRaw.includes(".") || priceRaw.includes(",")
    ? Math.round(Number.parseFloat(priceRaw.replace(/\./g, "").replace(",", ".")) * 100)
    : Number.parseInt(priceRaw, 10) || 0

  const galleryRaw = row.gallery_urls?.trim() || row.galleryUrls?.trim() || ""
  const galleryUrls = galleryRaw
    ? galleryRaw.split("|").map((url) => url.trim()).filter(Boolean)
    : []

  return {
    slug: row.slug?.trim() || undefined,
    title,
    priceCents,
    categorySlug: row.category_slug?.trim() || row.categorySlug?.trim() || null,
    description: row.description?.trim() || null,
    imageUrl,
    galleryUrls,
  }
}

export async function bulkUpsertProducts(
  db: Db,
  editorId: number,
  rows: CatalogImportRow[]
) {
  const productSlugs = await existingProductSlugs(db)
  const categoryRows = await db.select().from(catalogCategories)
  const categoryBySlug = new Map(categoryRows.map((row) => [row.slug, row.id]))
  let created = 0
  let updated = 0

  for (const row of rows) {
    let categoryId: number | null = null
    if (row.categorySlug) {
      categoryId = categoryBySlug.get(row.categorySlug) ?? null
      if (!categoryId) {
        const label = row.categorySlug.replace(/-/g, " ")
        const createdCategory = await upsertCatalogCategory(db, {
          label: label.charAt(0).toUpperCase() + label.slice(1),
          slug: slugify(row.categorySlug),
        })
        if (createdCategory) {
          categoryId = createdCategory.id
          categoryBySlug.set(createdCategory.slug, createdCategory.id)
        }
      }
    }

    const slug = row.slug
      ? uniqueSlug(row.slug, productSlugs)
      : uniqueSlug(row.title, productSlugs)

    const existing = row.slug ? await getCatalogProduct(db, row.slug) : null

    if (existing) {
      await updateCatalogProduct(db, editorId, existing.slug, {
        title: row.title,
        priceCents: row.priceCents,
        description: row.description,
        imageUrl: row.imageUrl,
        categoryId,
        gallery: row.galleryUrls,
      })
      updated += 1
      continue
    }

    const createdProduct = await createCatalogProduct(db, editorId, {
      title: row.title,
      priceCents: row.priceCents,
      description: row.description,
      imageUrl: row.imageUrl,
      categoryId,
      gallery: row.galleryUrls,
      slug: row.slug ? slug : undefined,
    })
    if (createdProduct) {
      productSlugs.add(createdProduct.slug)
      created += 1
    }
  }

  return { created, updated, total: rows.length }
}
