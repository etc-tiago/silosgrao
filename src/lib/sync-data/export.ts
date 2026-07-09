import { asc } from "drizzle-orm"
import type { Db } from "@/db/client"
import {
  catalogCategories,
  catalogProductImages,
  catalogProducts,
  contentEntries,
  pages,
} from "@/db/schema"
import { parseSpecsJson } from "@/lib/catalog/product-fields"
import { ensureContentPages } from "@/lib/content/ensure-pages"
import { SITE_DATA_VERSION, type SiteDataBundle } from "@/lib/sync-data/types"

export async function exportSiteData(db: Db): Promise<SiteDataBundle> {
  await ensureContentPages(db)

  const [pageRows, entryRows, categoryRows, productRows, imageRows] =
    await Promise.all([
      db.select().from(pages).orderBy(asc(pages.slug)),
      db.select().from(contentEntries),
      db.select().from(catalogCategories).orderBy(asc(catalogCategories.sortOrder)),
      db.select().from(catalogProducts).orderBy(asc(catalogProducts.sortOrder)),
      db
        .select()
        .from(catalogProductImages)
        .orderBy(asc(catalogProductImages.productId), asc(catalogProductImages.sortOrder)),
    ])

  const pageSlugById = new Map(pageRows.map((page) => [page.id, page.slug]))
  const categorySlugById = new Map(
    categoryRows.map((category) => [category.id, category.slug])
  )

  const galleryByProductId = new Map<number, SiteDataBundle["catalogProducts"][number]["gallery"]>()
  for (const image of imageRows) {
    const gallery = galleryByProductId.get(image.productId) ?? []
    gallery.push({
      imageUrl: image.imageUrl,
      sortOrder: image.sortOrder,
    })
    galleryByProductId.set(image.productId, gallery)
  }

  return {
    version: SITE_DATA_VERSION,
    exportedAt: new Date().toISOString(),
    pages: pageRows.map((page) => ({
      slug: page.slug,
      title: page.title,
    })),
    contentEntries: entryRows
      .map((entry) => {
        const pageSlug = pageSlugById.get(entry.pageId)
        if (!pageSlug) return null

        return {
          pageSlug,
          path: entry.path,
          type: entry.type,
          value: entry.value,
          environment: entry.environment,
        }
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    catalogCategories: categoryRows.map((category) => ({
      slug: category.slug,
      label: category.label,
      sortOrder: category.sortOrder,
    })),
    catalogProducts: productRows.map((product) => ({
      slug: product.slug,
      title: product.title,
      priceCents: product.priceCents,
      description: product.description,
      capacity: product.capacity,
      specs: parseSpecsJson(product.specs),
      imageUrl: product.imageUrl,
      categorySlug: product.categoryId
        ? (categorySlugById.get(product.categoryId) ?? null)
        : null,
      sortOrder: product.sortOrder,
      showOnHomepage: product.showOnHomepage === 1,
      gallery: galleryByProductId.get(product.id) ?? [],
    })),
  }
}
