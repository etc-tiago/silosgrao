import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { ProductsCatalog, ProductsCategoryNav } from "@/components/products/products-catalog"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { P, Span } from "@/components/content"
import { homeSectionHeadingClass } from "@/components/home/home-section"
import {
  PRODUTOS_CATALOG_PATH,
  PRODUTOS_HEADING_PATH,
  PRODUTOS_LEAD_PATH,
  PRODUTOS_HEADING_DEFAULT,
  PRODUTOS_LEAD_DEFAULT,
  parseCatalogValue,
} from "@/lib/content/fields/catalog"
import { mergeEditableFields } from "@/lib/content/fields"
import { editSearchSchema } from "@/lib/content/fields/search"
import { loadProdutosContent } from "@/lib/content/home.fn"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/produtos")({
  validateSearch: editSearchSchema,
  loader: () => loadProdutosContent(),
  head: () => ({
    meta: [{ title: "Produtos · Silos Grãos" }],
  }),
  component: ProdutosPage,
})

function ProdutosPage() {
  const { content, mode } = Route.useLoaderData()
  const search = Route.useSearch()
  const catalog = parseCatalogValue(content[PRODUTOS_CATALOG_PATH], content)
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
              { kind: "page", label: "Produtos" },
            ]}
            className="mb-8"
          />

          <header className="mb-10">
            <h1 className={cn(homeSectionHeadingClass, "text-4xl md:text-6xl")}>
              <Span
                path={PRODUTOS_HEADING_PATH}
                editTipo="text"
                value={content[PRODUTOS_HEADING_PATH]?.trim() || PRODUTOS_HEADING_DEFAULT}
              />
            </h1>
            <P
              path={PRODUTOS_LEAD_PATH}
              editTipo="text"
              value={content[PRODUTOS_LEAD_PATH]?.trim() || PRODUTOS_LEAD_DEFAULT}
              className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
            />
          </header>

          <ProductsCategoryNav catalog={catalog} className="mb-14" />
          <ProductsCatalog catalog={catalog} />
        </div>
      </main>
    </EditorPageProvider>
  )
}
