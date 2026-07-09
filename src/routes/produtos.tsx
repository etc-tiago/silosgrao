import { PublicCatalogSection } from "@/components/catalog/public-catalog-section"
import { P, Span } from "@/components/content"
import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { homeSectionHeadingClass } from "@/components/home/home-section"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { mergeProdutosEditorFields } from "@/lib/content/fields"
import {
  PRODUTOS_HEADING_DEFAULT,
  PRODUTOS_HEADING_PATH,
  PRODUTOS_LEAD_DEFAULT,
  PRODUTOS_LEAD_PATH,
} from "@/lib/content/fields/catalog"
import { editSearchSchema } from "@/lib/content/fields/search"
import { loadProdutosContent } from "@/lib/content/home.fn"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/produtos")({
  validateSearch: editSearchSchema,
  loader: () => loadProdutosContent(),
  head: () => ({
    meta: [{ title: "Produtos · Silos Grão" }],
  }),
  component: ProdutosPage,
})

function ProdutosPage() {
  const { content, mode, catalog } = Route.useLoaderData()
  const search = Route.useSearch()
  const fields = mergeProdutosEditorFields()

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

          <header className="mb-10 text-center">
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
              className="mt-4 text-base leading-relaxed text-muted-foreground"
            />
          </header>

          <PublicCatalogSection catalog={catalog} />
        </div>
      </main>
    </EditorPageProvider>
  )
}
