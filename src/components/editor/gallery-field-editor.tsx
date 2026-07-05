import { fileToBase64 } from "@/components/editor/edit-field-editors"
import {
  createGalleryItem,
  moveArrayItem,
  type GalleryItem,
  type GalleryValue,
} from "@/lib/content/fields/home-gallery"
import { cn } from "@/lib/utils"
import { orpc } from "@/orpc/browser-client"
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react"
import { useRef, useState } from "react"

type GalleryFieldEditorProps = {
  draft: GalleryValue
  loading: boolean
  pageSlug: string
  fieldPath: string
  onChange: (value: GalleryValue) => void
}

export function GalleryFieldEditor({
  draft,
  loading,
  pageSlug,
  fieldPath,
  onChange,
}: GalleryFieldEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function updateItems(items: GalleryItem[]) {
    onChange({ items })
  }

  function updateItem(index: number, patch: Partial<GalleryItem>) {
    updateItems(
      draft.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    )
  }

  async function uploadPhoto(file: File) {
    const upload = await orpc.content.uploadImage({
      pageSlug,
      path: fieldPath,
      mimeType: file.type,
      dataBase64: await fileToBase64(file),
    })
    return upload.url
  }

  async function handleAddPhoto(itemIndex: number, file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      const url = await uploadPhoto(file)
      const item = draft.items[itemIndex]
      if (!item) return
      updateItem(itemIndex, {
        photos: [...item.photos, { url, alt: item.title }],
      })
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Falha ao enviar imagem."
      )
    } finally {
      setUploading(false)
    }
  }

  function moveItem(index: number, direction: -1 | 1) {
    updateItems(moveArrayItem(draft.items, index, index + direction))
  }

  function movePhoto(itemIndex: number, photoIndex: number, direction: -1 | 1) {
    const item = draft.items[itemIndex]
    if (!item) return
    updateItem(itemIndex, {
      photos: moveArrayItem(item.photos, photoIndex, photoIndex + direction),
    })
  }

  function removeItem(index: number) {
    updateItems(draft.items.filter((_, itemIndex) => itemIndex !== index))
  }

  function removePhoto(itemIndex: number, photoIndex: number) {
    const item = draft.items[itemIndex]
    if (!item) return
    updateItem(itemIndex, {
      photos: item.photos.filter((_, index) => index !== photoIndex),
    })
  }

  const busy = loading || uploading

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Cada item pode ter várias fotos. A primeira é a capa exibida na grade.
      </p>

      {draft.items.map((item, itemIndex) => (
        <div
          key={item.id}
          className="space-y-4 rounded-2xl border bg-muted/20 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">Item {itemIndex + 1}</p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border bg-background disabled:opacity-40"
                onClick={() => moveItem(itemIndex, -1)}
                disabled={busy || itemIndex === 0}
                aria-label="Mover item para cima"
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border bg-background disabled:opacity-40"
                onClick={() => moveItem(itemIndex, 1)}
                disabled={busy || itemIndex === draft.items.length - 1}
                aria-label="Mover item para baixo"
              >
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border border-destructive/30 bg-background text-destructive disabled:opacity-40"
                onClick={() => removeItem(itemIndex)}
                disabled={busy || draft.items.length <= 1}
                aria-label="Remover item"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Título
            </span>
            <input
              type="text"
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={item.title}
              onChange={(event) =>
                updateItem(itemIndex, { title: event.target.value })
              }
              disabled={busy}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Categoria
            </span>
            <input
              type="text"
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={item.category}
              onChange={(event) =>
                updateItem(itemIndex, { category: event.target.value })
              }
              disabled={busy}
            />
          </label>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Fotos</p>
            {item.photos.length === 0 ? (
              <p className="text-xs italic text-muted-foreground">
                Adicione ao menos uma foto para este item.
              </p>
            ) : (
              <div className="space-y-2">
                {item.photos.map((photo, photoIndex) => (
                  <div
                    key={`${photo.url}-${photoIndex}`}
                    className="flex items-center gap-3 rounded-xl border bg-background p-2"
                  >
                    <img
                      src={photo.url}
                      alt=""
                      className="size-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">
                        {photoIndex === 0 ? "Capa" : `Foto ${photoIndex + 1}`}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {photo.alt || item.title || "Sem legenda"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-lg border disabled:opacity-40"
                        onClick={() => movePhoto(itemIndex, photoIndex, -1)}
                        disabled={busy || photoIndex === 0}
                        aria-label="Mover foto para cima"
                      >
                        <ChevronUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-lg border disabled:opacity-40"
                        onClick={() => movePhoto(itemIndex, photoIndex, 1)}
                        disabled={busy || photoIndex === item.photos.length - 1}
                        aria-label="Mover foto para baixo"
                      >
                        <ChevronDown className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-lg border border-destructive/30 text-destructive disabled:opacity-40"
                        onClick={() => removePhoto(itemIndex, photoIndex)}
                        disabled={busy}
                        aria-label="Remover foto"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                if (file) void handleAddPhoto(itemIndex, file)
              }}
            />
            <button
              type="button"
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/40",
                busy && "pointer-events-none opacity-60"
              )}
              onClick={() => fileInputRefs.current[item.id]?.click()}
              disabled={busy}
            >
              <ImagePlus className="size-4" />
              {uploading ? "Enviando..." : "Adicionar foto"}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-3 py-3 text-sm font-medium transition-colors hover:bg-muted/40 disabled:opacity-60"
        onClick={() => updateItems([...draft.items, createGalleryItem()])}
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
