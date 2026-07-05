import { ProductCard } from "@/components/products/product-card"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { ProductsCategoryNav } from "@/components/products/products-catalog"
import { CategoryIcon } from "@/components/icons/category-icon"
import { homeSectionSubheadingClass } from "@/components/home/home-section"
import {
  DEFAULT_CATEGORY_ICONS,
} from "@/lib/content/fields/category-icon"
import {
  HOME_PRODUCTS,
  isProductCategoryId,
  PRODUCT_CATEGORY_TITLES,
  whatsappCustomUrl,
} from "@/lib/content/fields/home-products"
import { cn } from "@/lib/utils"
import { Link, createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/produtos/$categoria")({
  loader: ({ params }) => {
    if (!isProductCategoryId(params.categoria)) {
      throw notFound()
    }

    return {
      categoryId: params.categoria,
      categoryTitle: PRODUCT_CATEGORY_TITLES[params.categoria],
      products: HOME_PRODUCTS[params.categoria] ?? [],
    }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData.categoryTitle} · Silos Grãos` }],
  }),
  component: ProductCategoryPage,
})

function ProductCategoryPage() {
  const { categoryId, categoryTitle, products } = Route.useLoaderData()
  const icon = DEFAULT_CATEGORY_ICONS[categoryId]

  return (
    <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
      <div className="mx-auto max-w-7xl">
        <ProductBreadcrumb
          items={[
            { kind: "link", label: "Início", to: "/" },
            { kind: "link", label: "Produtos", to: "/produtos" },
            { kind: "page", label: categoryTitle },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <div className="flex items-center gap-3">
            <CategoryIcon icon={icon} className="size-10" />
            <h1 className={cn(homeSectionSubheadingClass, "font-bold")}>
              {categoryTitle}
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Conheça nossa linha de {categoryTitle.toLowerCase()} e solicite um
            orçamento personalizado para sua operação.
          </p>
        </header>

        <ProductsCategoryNav className="mb-14" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
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
  )
}
