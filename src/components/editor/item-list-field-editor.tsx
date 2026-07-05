import { fileToBase64, type PageOption } from "@/components/editor/edit-field-editors"
import { ActionFieldEditor } from "@/components/editor/link-field-editor"
import {
  createItemListItem,
  moveArrayItem,
  type ItemListItem,
  type ItemListValue,
} from "@/lib/content/fields/item-list"
import { cn } from "@/lib/utils"
import { orpc } from "@/orpc/browser-client"
import { ChevronDown, ChevronUp, ImagePlus, Plus, Trash2 } from "lucide-react"
import { useRef, useState } from "react"

type ItemListFieldEditorProps = {
  draft: ItemListValue
  loading: boolean
  pageSlug: string
  fieldPath: string
  pages: PageOption[]
  onChange: (value: ItemListValue) => void
}

export function ItemListFieldEditor({
  draft,
  loading,
  pageSlug,
  fieldPath,
  pages,
  onChange,
}: ItemListFieldEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function updateItems(items: ItemListItem[]) {
    onChange({ items })
  }

  function updateItem(index: number, patch: Partial<ItemListItem>) {
    updateItems(
      draft.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    )
  }

  async function handleUpload(index: number, file: File) {
    setUploadingIndex(index)
    setUploadError(null)
    try {
      const upload = await orpc.content.uploadImage({
        pageSlug,
        path: fieldPath,
        mimeType: file.type,
        dataBase64: await fileToBase64(file),
      })
      updateItem(index, { image: upload.url })
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Falha ao enviar imagem."
      )
    } finally {
      setUploadingIndex(null)
    }
  }

  const busy = loading || uploadingIndex !== null

  return (
    <div className="space-y-4">
      {draft.items.map((item, index) => (
        <div
          key={item.id}
          className="space-y-4 rounded-2xl border bg-muted/20 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">Item {index + 1}</p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border bg-background disabled:opacity-40"
                onClick={() => updateItems(moveArrayItem(draft.items, index, index - 1))}
                disabled={busy || index === 0}
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border bg-background disabled:opacity-40"
                onClick={() => updateItems(moveArrayItem(draft.items, index, index + 1))}
                disabled={busy || index === draft.items.length - 1}
              >
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border border-destructive/30 text-destructive disabled:opacity-40"
                onClick={() =>
                  updateItems(draft.items.filter((_, itemIndex) => itemIndex !== index))
                }
                disabled={busy || draft.items.length <= 1}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {item.image ? (
            <img
              src={item.image}
              alt=""
              className="h-32 w-full rounded-xl border object-cover"
            />
          ) : null}

          <input
            ref={(node) => {
              fileInputRefs.current[item.id] = node
            }}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ""
              if (file) void handleUpload(index, file)
            }}
          />
          <button
            type="button"
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-3 text-sm text-muted-foreground",
              busy && "pointer-events-none opacity-60"
            )}
            onClick={() => fileInputRefs.current[item.id]?.click()}
            disabled={busy}
          >
            <ImagePlus className="size-4" />
            {uploadingIndex === index ? "Enviando..." : "Enviar imagem"}
          </button>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Título</span>
            <input
              type="text"
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={item.title}
              onChange={(event) => updateItem(index, { title: event.target.value })}
              disabled={busy}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Descrição</span>
            <textarea
              className="min-h-24 w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={item.description}
              onChange={(event) =>
                updateItem(index, { description: event.target.value })
              }
              disabled={busy}
            />
          </label>

          {item.primaryAction ? (
            <ActionFieldEditor
              label="Botão principal"
              actionLabel={item.primaryAction.label}
              link={item.primaryAction.link}
              pages={pages}
              loading={busy}
              onLabelChange={(label) =>
                updateItem(index, {
                  primaryAction: { ...item.primaryAction!, label },
                })
              }
              onLinkChange={(link) =>
                updateItem(index, {
                  primaryAction: { ...item.primaryAction!, link },
                })
              }
              onRemove={() => updateItem(index, { primaryAction: undefined })}
            />
          ) : (
            <button
              type="button"
              className="text-sm text-primary"
              onClick={() =>
                updateItem(index, {
                  primaryAction: {
                    label: "Saiba mais",
                    link: { kind: "page", pageSlug: "home" },
                  },
                })
              }
              disabled={busy}
            >
              + Adicionar botão interno/externo
            </button>
          )}

          {item.secondaryAction ? (
            <ActionFieldEditor
              label="Botão secundário"
              actionLabel={item.secondaryAction.label}
              link={item.secondaryAction.link}
              pages={pages}
              loading={busy}
              onLabelChange={(label) =>
                updateItem(index, {
                  secondaryAction: { ...item.secondaryAction!, label },
                })
              }
              onLinkChange={(link) =>
                updateItem(index, {
                  secondaryAction: { ...item.secondaryAction!, link },
                })
              }
              onRemove={() => updateItem(index, { secondaryAction: undefined })}
            />
          ) : item.primaryAction ? (
            <button
              type="button"
              className="text-sm text-primary"
              onClick={() =>
                updateItem(index, {
                  secondaryAction: {
                    label: "Link externo",
                    link: { kind: "external", url: "", openInNewTab: true },
                  },
                })
              }
              disabled={busy}
            >
              + Adicionar segundo botão
            </button>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-3 py-3 text-sm font-medium"
        onClick={() => updateItems([...draft.items, createItemListItem()])}
        disabled={busy}
      >
        <Plus className="size-4" />
        Adicionar item
      </button>

      {uploadError ? (
        <p className="text-sm text-destructive">{uploadError}</p>
      ) : null}
    </div>
  )
}
