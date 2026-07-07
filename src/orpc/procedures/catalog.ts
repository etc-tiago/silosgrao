import { ORPCError, os } from "@orpc/server"
import { z } from "zod"
import {
  createCatalogProduct,
  deleteCatalogCategory,
  deleteCatalogProduct,
  getCatalogProduct,
  getHomepageFeaturedStatus,
  HOMEPAGE_LIMIT_ERROR,
  listCatalogCategories,
  listCatalogProducts,
  updateCatalogProduct,
  upsertCatalogCategory,
} from "@/lib/catalog/service"
import {
  catalogCategoryInputSchema,
  catalogListInputSchema,
  catalogProductInputSchema,
} from "@/lib/catalog/types"
import { isAllowedCatalogImageUrl } from "@/lib/content/image-url"
import type { ORPCContext } from "@/orpc/context"

const authed = os.$context<ORPCContext>().use(async ({ context, next }) => {
  if (!context.editor) {
    throw new ORPCError("UNAUTHORIZED")
  }

  return next({
    context: {
      ...context,
      editor: context.editor,
    },
  })
})

function assertValidImageUrls(request: Request, urls: string[]) {
  for (const url of urls) {
    if (!isAllowedCatalogImageUrl(request, url)) {
      throw new ORPCError("BAD_REQUEST", {
        message: "URL de imagem inválida.",
      })
    }
  }
}

const list = authed
  .input(catalogListInputSchema)
  .handler(async ({ context, input }) => {
    return listCatalogProducts(context.db, input)
  })

const get = authed
  .input(z.object({ slug: z.string().min(1) }))
  .handler(async ({ context, input }) => {
    const product = await getCatalogProduct(context.db, input.slug)
    if (!product) {
      throw new ORPCError("NOT_FOUND", { message: "Produto não encontrado." })
    }
    return product
  })

const create = authed
  .input(catalogProductInputSchema)
  .handler(async ({ context, input }) => {
    assertValidImageUrls(context.request, [
      input.imageUrl,
      ...(input.gallery ?? []),
    ])

    try {
      const product = await createCatalogProduct(
        context.db,
        context.editor!.id,
        input
      )
      if (!product) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Falha ao criar produto.",
        })
      }
      return product
    } catch (error) {
      if (error instanceof Error && error.message === HOMEPAGE_LIMIT_ERROR) {
        throw new ORPCError("BAD_REQUEST", { message: error.message })
      }
      throw error
    }
  })

const update = authed
  .input(
    z.object({
      slug: z.string().min(1),
      data: catalogProductInputSchema,
    })
  )
  .handler(async ({ context, input }) => {
    assertValidImageUrls(context.request, [
      input.data.imageUrl,
      ...(input.data.gallery ?? []),
    ])

    try {
      const product = await updateCatalogProduct(
        context.db,
        context.editor!.id,
        input.slug,
        input.data
      )

      if (!product) {
        throw new ORPCError("NOT_FOUND", { message: "Produto não encontrado." })
      }

      return product
    } catch (error) {
      if (error instanceof Error && error.message === HOMEPAGE_LIMIT_ERROR) {
        throw new ORPCError("BAD_REQUEST", { message: error.message })
      }
      throw error
    }
  })

const remove = authed
  .input(z.object({ slug: z.string().min(1) }))
  .handler(async ({ context, input }) => {
    const deleted = await deleteCatalogProduct(context.db, input.slug)
    if (!deleted) {
      throw new ORPCError("NOT_FOUND", { message: "Produto não encontrado." })
    }
    return { ok: true as const }
  })

const categoriesList = authed.handler(async ({ context }) => {
  return listCatalogCategories(context.db)
})

const categoriesUpsert = authed
  .input(catalogCategoryInputSchema)
  .handler(async ({ context, input }) => {
    const category = await upsertCatalogCategory(context.db, input)
    if (!category) {
      throw new ORPCError("NOT_FOUND", { message: "Categoria não encontrada." })
    }
    return category
  })

const categoriesDelete = authed
  .input(z.object({ id: z.number().int().positive() }))
  .handler(async ({ context, input }) => {
    const deleted = await deleteCatalogCategory(context.db, input.id)
    if (!deleted) {
      throw new ORPCError("NOT_FOUND", { message: "Categoria não encontrada." })
    }
    return { ok: true as const }
  })

const homepageStatus = authed
  .input(
    z.object({
      categoryId: z.number().int().positive(),
      excludeProductId: z.number().int().positive().optional(),
    })
  )
  .handler(async ({ context, input }) => {
    return getHomepageFeaturedStatus(
      context.db,
      input.categoryId,
      input.excludeProductId
    )
  })

export const catalogRouter = {
  list,
  get,
  create,
  update,
  delete: remove,
  homepageStatus,
  categories: {
    list: categoriesList,
    upsert: categoriesUpsert,
    delete: categoriesDelete,
  },
}
