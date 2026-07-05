import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { ProductsCatalog, ProductsCategoryNav } from "@/components/products/products-catalog"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { P, Span } from "@/components/content"
import { useEditNavigation, useEditorMode } from "@/components/content/editor-mode"
import { homeSectionHeadingClass } from "@/components/home/home-section"
import {
  PRODUTOS_CATALOG_PATH,
  PRODUTOS_HEADING_PATH,
  PRODUTOS_LEAD_PATH,
  PRODUTOS_HEADING_DEFAULT,
  PRODUTOS_LEAD_DEFAULT,
  parseCatalogValue,
  type CatalogValue,
} from "@/lib/content/fields/catalog"
import { mergeProdutosEditorFields } from "@/lib/content/fields"
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
          <ProdutosCatalogSection catalog={catalog} />
        </div>
      </main>
    </EditorPageProvider>
  )
}

function ProdutosCatalogSection({ catalog }: { catalog: CatalogValue }) {
  const { isEditor } = useEditorMode()
  const { editPath, openEdit } = useEditNavigation()
  const catalogSelected = editPath === PRODUTOS_CATALOG_PATH

  return (
    <div
      className={cn(
        isEditor &&
          catalogSelected &&
          "rounded-3xl outline outline-2 outline-offset-4 outline-primary/60"
      )}
      {...(isEditor ? { "data-edit-path": PRODUTOS_CATALOG_PATH } : {})}
      onClick={
        isEditor ? () => openEdit(PRODUTOS_CATALOG_PATH, "catalog") : undefined
      }
      onKeyDown={
        isEditor
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                openEdit(PRODUTOS_CATALOG_PATH, "catalog")
              }
            }
          : undefined
      }
      role={isEditor ? "button" : undefined}
      tabIndex={isEditor ? 0 : undefined}
    >
      <ProductsCatalog catalog={catalog} />
    </div>
  )
}
