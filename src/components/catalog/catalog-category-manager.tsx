import { Button } from "@/components/ui/button"
import type { CatalogCategoryWithCount } from "@/lib/catalog/types"
import { orpc } from "@/orpc/browser-client"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

type CatalogCategoryManagerProps = {
  categories: CatalogCategoryWithCount[]
  onChanged: () => void
}

export function CatalogCategoryManager({
  categories,
  onChanged,
}: CatalogCategoryManagerProps) {
  const [label, setLabel] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!label.trim()) return

    setLoading(true)
    setError(null)

    try {
      await orpc.catalog.categories.upsert({
        id: editingId ?? undefined,
        label: label.trim(),
      })
      setLabel("")
      setEditingId(null)
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar categoria.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Excluir esta categoria? Os produtos ficarão sem categoria.")) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await orpc.catalog.categories.delete({ id })
      if (editingId === id) {
        setEditingId(null)
        setLabel("")
      }
      onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir categoria.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border p-4">
      <div>
        <h2 className="font-medium">Categorias</h2>
        <p className="text-sm text-muted-foreground">
          Organize o catálogo com categorias opcionais.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder={editingId ? "Editar categoria" : "Nova categoria"}
          className="h-10 flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
        <Button
          type="button"
          disabled={loading || !label.trim()}
          onClick={() => void handleSave()}
        >
          <Plus className="size-4" />
          {editingId ? "Atualizar" : "Adicionar"}
        </Button>
        {editingId ? (
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => {
              setEditingId(null)
              setLabel("")
            }}
          >
            Cancelar
          </Button>
        ) : null}
      </div>

      {categories.length > 0 ? (
        <ul className="divide-y rounded-xl border">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <p className="font-medium">{category.label}</p>
                <p className="text-xs text-muted-foreground">
                  {category.productCount}{" "}
                  {category.productCount === 1 ? "produto" : "produtos"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={loading}
                  onClick={() => {
                    setEditingId(category.id)
                    setLabel(category.label)
                  }}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={loading}
                  onClick={() => void handleDelete(category.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
