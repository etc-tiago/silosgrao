import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { ProductCard } from "@/components/products/product-card"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { ProductsCategoryNav } from "@/components/products/products-catalog"
import { CategoryIcon } from "@/components/icons/category-icon"
import { homeSectionSubheadingClass } from "@/components/home/home-section"
import {
  findCatalogCategory,
  PRODUTOS_CATALOG_PATH,
  parseCatalogValue,
} from "@/lib/content/fields/catalog"
import { mergeEditableFields } from "@/lib/content/fields"
import { editSearchSchema } from "@/lib/content/fields/search"
import {
  isProductCategoryId,
  whatsappCustomUrl,
} from "@/lib/content/fields/home-products"
import { loadProdutosContent } from "@/lib/content/home.fn"
import { cn } from "@/lib/utils"
import { Link, createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/produtos/$categoria")({
  validateSearch: editSearchSchema,
  loader: async ({ params }) => {
    if (!isProductCategoryId(params.categoria)) {
      throw notFound()
    }

    const { content, mode } = await loadProdutosContent()
    const catalog = parseCatalogValue(content[PRODUTOS_CATALOG_PATH], content)
    const category = findCatalogCategory(catalog, params.categoria)

    if (!category) {
      throw notFound()
    }

    return {
      content,
      mode,
      categoryId: params.categoria,
      category,
      catalog,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produtos · Silos Grãos" }] }
    }

    return {
      meta: [{ title: `${loaderData.category.label} · Silos Grãos` }],
    }
  },
  component: ProductCategoryPage,
})

function ProductCategoryPage() {
  const { content, mode, categoryId, category, catalog } = Route.useLoaderData()
  const search = Route.useSearch()
  const fields = mergeEditableFields("produtos", "site")

  return (
    <EditorPageProvider
      mode={mode}
      content={content}
      fields={fields}
      search={search}
    >
      <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
        <div className="mx-auto max-w-7xl">
          <ProductBreadcrumb
            items={[
              { kind: "link", label: "Início", to: "/" },
              { kind: "link", label: "Produtos", to: "/produtos" },
              { kind: "page", label: category.label },
            ]}
            className="mb-8"
          />

          <header className="mb-10">
            <div className="flex items-center gap-3">
              <CategoryIcon icon={category.icon} className="size-10" />
              <h1 className={cn(homeSectionSubheadingClass, "font-bold")}>
                {category.label}
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Conheça nossa linha de {category.label.toLowerCase()} e solicite um
              orçamento personalizado para sua operação.
            </p>
          </header>

          <ProductsCategoryNav catalog={catalog} className="mb-14" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.products.map((product) => (
              <ProductCard
                key={`${categoryId}-${product.id}`}
                product={product}
                categoryId={categoryId}
              />
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/produtos"
              className="flex flex-1 items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              Ver todo o catálogo
            </Link>
            <a
              href={whatsappCustomUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Conversar com um Especialista
            </a>
          </div>
        </div>
      </main>
    </EditorPageProvider>
  )
}
