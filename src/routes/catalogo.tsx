import { CatalogPanel } from "@/components/catalog/catalog-panel"
import { PublicCatalogSection } from "@/components/catalog/public-catalog-section"
import { homeSectionHeadingClass } from "@/components/home/home-section"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { loadCatalogoContent } from "@/lib/content/home.fn"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/catalogo")({
  loader: () => loadCatalogoContent(),
  head: () => ({
    meta: [{ title: "Catálogo · Silo Grão" }],
  }),
  component: CatalogoPage,
})

function CatalogoPage() {
  const { catalog, isEditor } = Route.useLoaderData()

  if (isEditor) {
    return (
      <main className="min-h-svh bg-background">
        <CatalogPanel />
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
      <div className="mx-auto max-w-7xl">
        <ProductBreadcrumb
          items={[
            { kind: "link", label: "Início", to: "/" },
            { kind: "page", label: "Catálogo" },
          ]}
          className="mb-8"
        />

        <header className="mb-10 text-center">
          <h1 className={cn(homeSectionHeadingClass, "text-4xl md:text-6xl")}>
            Catálogo
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Conheça nossa linha de produtos e solicite um orçamento.
          </p>
        </header>

        <PublicCatalogSection catalog={catalog} />
      </div>
    </main>
  )
}
