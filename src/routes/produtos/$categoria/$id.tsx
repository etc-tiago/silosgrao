import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { ContentActionButton } from "@/components/content/content-link"
import {
  homeCardImageWrapClass,
  homeSectionSubheadingClass,
} from "@/components/home/home-section"
import {
  findCatalogProduct,
  PRODUTOS_CATALOG_PATH,
  parseCatalogValue,
} from "@/lib/content/fields/catalog"
import { mergeProdutosEditorFields } from "@/lib/content/fields"
import { editSearchSchema } from "@/lib/content/fields/search"
import {
  isProductCategoryId,
  whatsappProductUrl,
} from "@/lib/content/fields/home-products"
import { loadProdutosContent } from "@/lib/content/home.fn"
import { cn } from "@/lib/utils"
import { Link, createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/produtos/$categoria/$id")({
  validateSearch: editSearchSchema,
  loader: async ({ params }) => {
    if (!isProductCategoryId(params.categoria)) {
      throw notFound()
    }

    const productId = Number(params.id)
    if (!Number.isInteger(productId) || productId <= 0) {
      throw notFound()
    }

    const { content, mode } = await loadProdutosContent()
    const catalog = parseCatalogValue(content[PRODUTOS_CATALOG_PATH], content)
    const product = findCatalogProduct(catalog, params.categoria, productId)
    const category = catalog.categories.find(
      (item) => item.id === params.categoria
    )

    if (!product || !category) {
      throw notFound()
    }

    return {
      content,
      mode,
      product,
      categoryId: params.categoria,
      categoryLabel: category.label,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produtos · Silos Grãos" }] }
    }

    return {
      meta: [{ title: `${loaderData.product.name} · Silos Grãos` }],
    }
  },
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { content, mode, product, categoryId, categoryLabel } =
    Route.useLoaderData()
  const search = Route.useSearch()
  const fields = mergeProdutosEditorFields()
  const quoteAction = product.primaryAction ?? {
    label: "Solicitar Orçamento",
    link: {
      kind: "external" as const,
      url: whatsappProductUrl(product.name),
      openInNewTab: true,
    },
  }

  return (
    <EditorPageProvider
      mode={mode}
      content={content}
      fields={fields}
      search={search}
    >
      <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
        <div className="mx-auto max-w-4xl">
          <ProductBreadcrumb
            items={[
              { kind: "link", label: "Início", to: "/" },
              { kind: "link", label: "Produtos", to: "/produtos" },
              {
                kind: "link",
                label: categoryLabel,
                to: "/produtos/$categoria",
                params: { categoria: categoryId },
              },
              { kind: "page", label: product.name },
            ]}
            className="mb-8"
          />

          <article>
            <div className={cn(homeCardImageWrapClass, "aspect-4/3 w-full")}>
              <img
                src={product.image}
                alt={product.name}
                width={1200}
                height={900}
                className="size-full object-cover"
              />
            </div>

            <header className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {categoryLabel}
              </p>
              <h1 className={cn(homeSectionSubheadingClass, "mt-2 font-bold")}>
                {product.name}
              </h1>
              <p className="mt-3 text-base font-semibold text-primary">
                Capacidade: {product.capacity}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </header>

            <section className="mt-10 rounded-3xl border border-border bg-card p-6">
              <h2 className="font-display text-xl text-ink">
                Especificações Técnicas
              </h2>
              <ul className="mt-4 space-y-3">
                {product.specs.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-0.5 font-bold text-primary">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/produtos/$categoria"
                params={{ categoria: categoryId }}
                className="flex flex-1 items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Ver categoria
              </Link>
              <Link
                to="/produtos"
                className="flex flex-1 items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Ver catálogo
              </Link>
              <ContentActionButton
                label={quoteAction.label}
                link={quoteAction.link}
                className="flex flex-1 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              />
            </div>
          </article>
        </div>
      </main>
    </EditorPageProvider>
  )
}
