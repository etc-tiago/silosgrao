import { CatalogCategoryManager } from "@/components/catalog/catalog-category-manager"
import { CatalogProductCard } from "@/components/catalog/catalog-product-card"
import { CatalogProductForm } from "@/components/catalog/catalog-product-form"
import { CatalogSearchBar } from "@/components/catalog/catalog-search-bar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CatalogCategoryWithCount, CatalogListItem } from "@/lib/catalog/types"
import { orpc } from "@/orpc/browser-client"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

const PAGE_SIZE = 24

export function CatalogPanel() {
  const [activeTab, setActiveTab] = useState("products")
  const [items, setItems] = useState<CatalogListItem[]>([])
  const [categories, setCategories] = useState<CatalogCategoryWithCount[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | null | undefined>(
    undefined
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const loadCategories = useCallback(async () => {
    const result = await orpc.catalog.categories.list()
    setCategories(result)
  }, [])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await orpc.catalog.list({
        page,
        pageSize: PAGE_SIZE,
        search: search || undefined,
        categoryId,
        sort: "created",
        sortDir: "desc",
      })
      setItems(result.items)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar catálogo.")
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryId])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  function openCreateForm() {
    setEditingSlug(null)
    setFormOpen(true)
  }

  function openEditForm(slug: string) {
    setEditingSlug(slug)
    setFormOpen(true)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleCategoryChange(value: number | null | undefined) {
    setCategoryId(value)
    setPage(1)
  }

  async function handleSaved() {
    await Promise.all([loadProducts(), loadCategories()])
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-28 pt-28 md:px-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar ao site
          </Link>
          <div>
            <h1 className="font-display text-3xl md:text-4xl">Catálogo</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie produtos e categorias
            </p>
          </div>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="size-4" />
          Novo produto
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6 space-y-6">
          <CatalogSearchBar
            search={search}
            categoryId={categoryId}
            categories={categories}
            total={total}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
          />

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl border bg-muted/40"
                />
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <p className="font-medium">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajuste os filtros ou cadastre um novo item.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <div key={product.id} className="relative">
                  <CatalogProductCard
                    product={product}
                    onClick={() => openEditForm(product.slug)}
                  />
                  {product.showOnHomepage ? (
                    <span className="absolute top-3 left-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      Homepage
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Próxima
                <ChevronRight className="size-4" />
              </Button>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CatalogCategoryManager
            categories={categories}
            onChanged={() => void handleSaved()}
          />
        </TabsContent>
      </Tabs>

      <CatalogProductForm
        open={formOpen}
        productSlug={editingSlug}
        categories={categories}
        onClose={() => setFormOpen(false)}
        onSaved={() => void handleSaved()}
      />
    </div>
  )
}
