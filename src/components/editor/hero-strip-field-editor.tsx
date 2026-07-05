import { fileToBase64, type PageOption } from "@/components/editor/edit-field-editors"
import { LinkFieldEditor } from "@/components/editor/link-field-editor"
import {
  createHeroTile,
  moveArrayItem,
  type HeroStripValue,
  type HeroTile,
} from "@/lib/content/fields/hero-strip"
import { cn } from "@/lib/utils"
import { orpc } from "@/orpc/browser-client"
import { ChevronDown, ChevronUp, ImagePlus, Plus, Trash2 } from "lucide-react"
import { useRef, useState } from "react"

type HeroStripFieldEditorProps = {
  draft: HeroStripValue
  loading: boolean
  pageSlug: string
  fieldPath: string
  pages: PageOption[]
  onChange: (value: HeroStripValue) => void
}

export function HeroStripFieldEditor({
  draft,
  loading,
  pageSlug,
  fieldPath,
  pages,
  onChange,
}: HeroStripFieldEditorProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function updateTiles(tiles: HeroTile[]) {
    onChange({ tiles })
  }

  function updateTile(index: number, patch: Partial<HeroTile>) {
    updateTiles(
      draft.tiles.map((tile, tileIndex) =>
        tileIndex === index ? { ...tile, ...patch } : tile
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
      updateTile(index, { image: upload.url })
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
      {draft.tiles.map((tile, index) => (
        <div
          key={tile.id}
          className="space-y-4 rounded-2xl border bg-muted/20 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">Coluna {index + 1}</p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border bg-background disabled:opacity-40"
                onClick={() => updateTiles(moveArrayItem(draft.tiles, index, index - 1))}
                disabled={busy || index === 0}
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border bg-background disabled:opacity-40"
                onClick={() => updateTiles(moveArrayItem(draft.tiles, index, index + 1))}
                disabled={busy || index === draft.tiles.length - 1}
              >
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border border-destructive/30 text-destructive disabled:opacity-40"
                onClick={() =>
                  updateTiles(draft.tiles.filter((_, tileIndex) => tileIndex !== index))
                }
                disabled={busy || draft.tiles.length <= 1}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {tile.image ? (
            <img
              src={tile.image}
              alt=""
              className="h-40 w-full rounded-xl border object-cover"
            />
          ) : null}

          <input
            ref={(node) => {
              fileInputRefs.current[tile.id] = node
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
            onClick={() => fileInputRefs.current[tile.id]?.click()}
            disabled={busy}
          >
            <ImagePlus className="size-4" />
            {uploadingIndex === index ? "Enviando..." : "Enviar imagem"}
          </button>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Legenda</span>
            <input
              type="text"
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={tile.caption}
              onChange={(event) => updateTile(index, { caption: event.target.value })}
              disabled={busy}
            />
          </label>

          {tile.link ? (
            <div className="space-y-2">
              <LinkFieldEditor
                link={tile.link}
                pages={pages}
                loading={busy}
                onChange={(link) => updateTile(index, { link })}
              />
              <button
                type="button"
                className="text-xs text-destructive"
                onClick={() => updateTile(index, { link: undefined })}
                disabled={busy}
              >
                Remover destino
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="text-sm text-primary"
              onClick={() =>
                updateTile(index, {
                  link: { kind: "page", pageSlug: "home" },
                })
              }
              disabled={busy}
            >
              + Adicionar destino
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-3 py-3 text-sm font-medium"
        onClick={() => updateTiles([...draft.tiles, createHeroTile()])}
        disabled={busy}
      >
        <Plus className="size-4" />
        Adicionar coluna
      </button>

      {uploadError ? (
        <p className="text-sm text-destructive">{uploadError}</p>
      ) : null}
    </div>
  )
}
