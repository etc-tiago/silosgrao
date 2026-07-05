import { ProductsCatalog, ProductsCategoryNav } from "@/components/products/products-catalog"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { homeSectionHeadingClass } from "@/components/home/home-section"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [{ title: "Produtos · Silos Grãos" }],
  }),
  component: ProdutosPage,
})

function ProdutosPage() {
  return (
    <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
      <div className="mx-auto max-w-7xl">
        <ProductBreadcrumb
          items={[
            { kind: "link", label: "Início", to: "/" },
            { kind: "page", label: "Produtos" },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <h1 className={cn(homeSectionHeadingClass, "text-4xl md:text-6xl")}>
            Produtos
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Catálogo completo de silos, secadores, transportadores e
            infraestrutura metálica para armazenamento de grãos.
          </p>
        </header>

        <ProductsCategoryNav className="mb-14" />
        <ProductsCatalog />
      </div>
    </main>
  )
}
