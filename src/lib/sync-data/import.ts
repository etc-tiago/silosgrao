import { sql } from "drizzle-orm"
import type { Db } from "@/db/client"
import {
  catalogCategories,
  catalogProductImages,
  catalogProducts,
  changeLog,
  contentEntries,
  pages,
} from "@/db/schema"
import { syncProductFts } from "@/lib/catalog/fts"
import { serializeSpecs } from "@/lib/catalog/product-fields"
import {
  siteDataBundleSchema,
  type SiteDataBundle,
} from "@/lib/sync-data/types"

export type ImportSiteDataResult = {
  pages: number
  contentEntries: number
  catalogCategories: number
  catalogProducts: number
  catalogProductImages: number
}

export async function importSiteData(
  db: Db,
  editorId: number,
  rawBundle: unknown
): Promise<ImportSiteDataResult> {
  const bundle = siteDataBundleSchema.parse(rawBundle)
  const now = new Date()

  return db.transaction(async (tx) => {
    await tx.delete(changeLog)
    await tx.delete(contentEntries)
    await tx.delete(catalogProductImages)
    await tx.run(sql`DELETE FROM catalog_products_fts`)
    await tx.delete(catalogProducts)
    await tx.delete(catalogCategories)

    const pageIdBySlug = new Map<string, number>()
    for (const page of bundle.pages) {
      await tx
        .insert(pages)
        .values({
          slug: page.slug,
          title: page.title,
        })
        .onConflictDoUpdate({
          target: pages.slug,
          set: { title: page.title },
        })

      const storedPage = await tx.query.pages.findFirst({
        where: (table, { eq }) => eq(table.slug, page.slug),
      })

      if (!storedPage) {
        throw new Error(`Falha ao sincronizar página "${page.slug}".`)
      }

      pageIdBySlug.set(page.slug, storedPage.id)
    }

    let contentEntryCount = 0
    for (const entry of bundle.contentEntries) {
      const pageId = pageIdBySlug.get(entry.pageSlug)
      if (!pageId) continue

      await tx.insert(contentEntries).values({
        pageId,
        path: entry.path,
        type: entry.type,
        value: entry.value,
        environment: entry.environment,
        updatedAt: now,
        updatedBy: editorId,
      })
      contentEntryCount += 1
    }

    const categoryIdBySlug = new Map<string, number>()
    for (const category of bundle.catalogCategories) {
      const [storedCategory] = await tx
        .insert(catalogCategories)
        .values({
          slug: category.slug,
          label: category.label,
          sortOrder: category.sortOrder,
          createdAt: now,
          updatedAt: now,
        })
        .returning({ id: catalogCategories.id })

      if (!storedCategory) {
        throw new Error(`Falha ao importar categoria "${category.slug}".`)
      }

      categoryIdBySlug.set(category.slug, storedCategory.id)
    }

    let productImageCount = 0
    for (const product of bundle.catalogProducts) {
      const categoryId = product.categorySlug
        ? (categoryIdBySlug.get(product.categorySlug) ?? null)
        : null

      const [storedProduct] = await tx
        .insert(catalogProducts)
        .values({
          slug: product.slug,
          title: product.title,
          priceCents: product.priceCents,
          description: product.description,
          capacity: product.capacity,
          specs: serializeSpecs(product.specs),
          imageUrl: product.imageUrl,
          categoryId,
          sortOrder: product.sortOrder,
          showOnHomepage: product.showOnHomepage && categoryId ? 1 : 0,
          createdAt: now,
          updatedAt: now,
          updatedBy: editorId,
        })
        .returning({ id: catalogProducts.id })

      if (!storedProduct) {
        throw new Error(`Falha ao importar produto "${product.slug}".`)
      }

      if (product.gallery.length > 0) {
        await tx.insert(catalogProductImages).values(
          product.gallery.map((image) => ({
            productId: storedProduct.id,
            imageUrl: image.imageUrl,
            sortOrder: image.sortOrder,
          }))
        )
        productImageCount += product.gallery.length
      }

      await syncProductFts(
        tx,
        storedProduct.id,
        product.title,
        product.description
      )
    }

    return {
      pages: bundle.pages.length,
      contentEntries: contentEntryCount,
      catalogCategories: bundle.catalogCategories.length,
      catalogProducts: bundle.catalogProducts.length,
      catalogProductImages: productImageCount,
    }
  })
}

export function summarizeBundle(bundle: SiteDataBundle) {
  return {
    pages: bundle.pages.length,
    contentEntries: bundle.contentEntries.length,
    catalogCategories: bundle.catalogCategories.length,
    catalogProducts: bundle.catalogProducts.length,
    exportedAt: bundle.exportedAt,
  }
}
