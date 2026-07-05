import { fileToBase64 } from "@/components/editor/edit-field-editors"
import {
  CATEGORY_ICON_LABELS,
  type CategoryIconId,
} from "@/lib/content/fields/category-icon"
import { CategoryIcon } from "@/components/icons/category-icon"
import {
  createCatalogProduct,
  nextProductId,
  type CatalogCategory,
  type CatalogProduct,
  type CatalogValue,
} from "@/lib/content/fields/catalog"
import { cn } from "@/lib/utils"
import { orpc } from "@/orpc/browser-client"
import { ChevronDown, ChevronUp, ImagePlus, Plus, Trash2 } from "lucide-react"
import { useRef, useState } from "react"

type CatalogFieldEditorProps = {
  draft: CatalogValue
  loading: boolean
  pageSlug: string
  fieldPath: string
  onChange: (value: CatalogValue) => void
}

export function CatalogFieldEditor({
  draft,
  loading,
  pageSlug,
  fieldPath,
  onChange,
}: CatalogFieldEditorProps) {
  const [uploadTarget, setUploadTarget] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingUploadRef = useRef<{
    categoryIndex: number
    productIndex: number
  } | null>(null)

  function updateCategories(categories: CatalogCategory[]) {
    onChange({ categories })
  }

  function updateCategory(
    categoryIndex: number,
    patch: Partial<CatalogCategory>
  ) {
    updateCategories(
      draft.categories.map((category, index) =>
        index === categoryIndex ? { ...category, ...patch } : category
      )
    )
  }

  function updateProduct(
    categoryIndex: number,
    productIndex: number,
    patch: Partial<CatalogProduct>
  ) {
    const category = draft.categories[categoryIndex]
    if (!category) return
    updateCategory(categoryIndex, {
      products: category.products.map((product, index) =>
        index === productIndex ? { ...product, ...patch } : product
      ),
    })
  }

  async function handleUpload(file: File) {
    const target = pendingUploadRef.current
    if (!target) return

    setUploadTarget(`${target.categoryIndex}-${target.productIndex}`)
    setUploadError(null)
    try {
      const upload = await orpc.content.uploadImage({
        pageSlug,
        path: fieldPath,
        mimeType: file.type,
        dataBase64: await fileToBase64(file),
      })
      updateProduct(target.categoryIndex, target.productIndex, {
        image: upload.url,
      })
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Falha ao enviar imagem."
      )
    } finally {
      setUploadTarget(null)
      pendingUploadRef.current = null
    }
  }

  const busy = loading || uploadTarget !== null

  return (
    <div className="space-y-6">
      {draft.categories.map((category, categoryIndex) => (
        <div
          key={category.id}
          className="space-y-4 rounded-2xl border bg-muted/20 p-4"
        >
          <div className="flex items-center gap-3">
            <CategoryIcon icon={category.icon} className="size-6" />
            <p className="text-sm font-medium">{category.id}</p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Nome da categoria
            </span>
            <input
              type="text"
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={category.label}
              onChange={(event) =>
                updateCategory(categoryIndex, { label: event.target.value })
              }
              disabled={busy}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Ícone</span>
            <select
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={category.icon}
              onChange={(event) => {
                updateCategory(categoryIndex, {
                  icon: event.target.value as CategoryIconId,
                })
              }}
              disabled={busy}
            >
              {(Object.keys(CATEGORY_ICON_LABELS) as CategoryIconId[]).map((icon) => (
                <option key={icon} value={icon}>
                  {CATEGORY_ICON_LABELS[icon]}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Produtos</p>
            {category.products.map((product, productIndex) => (
              <div
                key={`${category.id}-${product.id}`}
                className="space-y-3 rounded-xl border bg-background p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {product.name || `Produto ${product.id}`}
                  </p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-lg border disabled:opacity-40"
                      onClick={() => {
                        const products = [...category.products]
                        if (productIndex > 0) {
                          const [removed] = products.splice(productIndex, 1)
                          products.splice(productIndex - 1, 0, removed!)
                          updateCategory(categoryIndex, { products })
                        }
                      }}
                      disabled={busy || productIndex === 0}
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-lg border disabled:opacity-40"
                      onClick={() => {
                        const products = [...category.products]
                        if (productIndex < products.length - 1) {
                          const [removed] = products.splice(productIndex, 1)
                          products.splice(productIndex + 1, 0, removed!)
                          updateCategory(categoryIndex, { products })
                        }
                      }}
                      disabled={
                        busy || productIndex === category.products.length - 1
                      }
                    >
                      <ChevronDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="grid size-8 place-items-center rounded-lg border border-destructive/30 text-destructive disabled:opacity-40"
                      onClick={() =>
                        updateCategory(categoryIndex, {
                          products: category.products.filter(
                            (_, index) => index !== productIndex
                          ),
                        })
                      }
                      disabled={busy}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {product.image ? (
                  <img
                    src={product.image}
                    alt=""
                    className="h-28 w-full rounded-lg border object-cover"
                  />
                ) : null}

                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-2 text-sm text-muted-foreground",
                    busy && "pointer-events-none opacity-60"
                  )}
                  onClick={() => {
                    pendingUploadRef.current = { categoryIndex, productIndex }
                    fileInputRef.current?.click()
                  }}
                  disabled={busy}
                >
                  <ImagePlus className="size-4" />
                  {uploadTarget === `${categoryIndex}-${productIndex}`
                    ? "Enviando..."
                    : "Enviar imagem"}
                </button>

                {(
                  [
                    ["name", "Nome"],
                    ["capacity", "Capacidade"],
                    ["description", "Descrição"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} className="block space-y-1">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    {field === "description" ? (
                      <textarea
                        className="min-h-20 w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
                        value={product.description}
                        onChange={(event) =>
                          updateProduct(categoryIndex, productIndex, {
                            description: event.target.value,
                          })
                        }
                        disabled={busy}
                      />
                    ) : (
                      <input
                        type="text"
                        className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
                        value={product[field]}
                        onChange={(event) =>
                          updateProduct(categoryIndex, productIndex, {
                            [field]: event.target.value,
                          })
                        }
                        disabled={busy}
                      />
                    )}
                  </label>
                ))}

                <label className="block space-y-1">
                  <span className="text-xs text-muted-foreground">
                    Especificações (uma por linha)
                  </span>
                  <textarea
                    className="min-h-24 w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
                    value={product.specs.join("\n")}
                    onChange={(event) =>
                      updateProduct(categoryIndex, productIndex, {
                        specs: event.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean),
                      })
                    }
                    disabled={busy}
                  />
                </label>
              </div>
            ))}

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm"
              onClick={() =>
                updateCategory(categoryIndex, {
                  products: [
                    ...category.products,
                    createCatalogProduct(nextProductId(category.products)),
                  ],
                })
              }
              disabled={busy}
            >
              <Plus className="size-4" />
              Adicionar produto
            </button>
          </div>
        </div>
      ))}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) void handleUpload(file)
        }}
      />

      {uploadError ? (
        <p className="text-sm text-destructive">{uploadError}</p>
      ) : null}
    </div>
  )
}
