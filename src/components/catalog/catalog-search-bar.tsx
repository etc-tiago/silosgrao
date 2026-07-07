import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"

type CatalogSearchBarProps = {
  search: string
  categoryId: number | null | undefined
  categories: Array<{ id: number; label: string; productCount: number }>
  total: number
  onSearchChange: (value: string) => void
  onCategoryChange: (categoryId: number | null | undefined) => void
}

export function CatalogSearchBar({
  search,
  categoryId,
  categories,
  total,
  onSearchChange,
  onCategoryChange,
}: CatalogSearchBarProps) {
  const [draft, setDraft] = useState(search)

  useEffect(() => {
    setDraft(search)
  }, [search])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (draft !== search) {
        onSearchChange(draft)
      }
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [draft, onSearchChange, search])

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative max-w-xl flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Buscar por título ou descrição..."
          className="h-10 w-full rounded-full border bg-background pr-10 pl-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
        {draft ? (
          <button
            type="button"
            onClick={() => {
              setDraft("")
              onSearchChange("")
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={categoryId === undefined ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onCategoryChange(undefined)}
        >
          Todas
        </Button>
        <Button
          size="sm"
          variant={categoryId === null ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onCategoryChange(null)}
        >
          Sem categoria
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={categoryId === category.id ? "default" : "outline"}
            className="rounded-full"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
            <span className="text-xs opacity-70">({category.productCount})</span>
          </Button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground lg:min-w-28 lg:text-right">
        {total} {total === 1 ? "produto" : "produtos"}
      </p>
    </div>
  )
}
