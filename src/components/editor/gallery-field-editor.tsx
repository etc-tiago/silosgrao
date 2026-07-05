import { fileToBase64 } from "@/components/editor/edit-field-editors"
import {
  createGallerySlide,
  moveArrayItem,
  type GalleryValue,
} from "@/lib/content/fields/gallery"
import { cn } from "@/lib/utils"
import { orpc } from "@/orpc/browser-client"
import { ChevronDown, ChevronUp, ImagePlus, Plus, Trash2 } from "lucide-react"
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  function updateSlides(slides: GalleryValue["slides"]) {
    onChange({ slides })
  }

  async function handleAddPhoto(file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      const upload = await orpc.content.uploadImage({
        pageSlug,
        path: fieldPath,
        mimeType: file.type,
        dataBase64: await fileToBase64(file),
      })
      updateSlides([
        ...draft.slides,
        { ...createGallerySlide(), url: upload.url },
      ])
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Falha ao enviar imagem."
      )
    } finally {
      setUploading(false)
    }
  }

  const busy = loading || uploading

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Cada slide tem uma foto e uma legenda. A ordem define a exibição na
        grade.
      </p>

      {draft.slides.map((slide, index) => (
        <div
          key={slide.id}
          className="space-y-3 rounded-2xl border bg-muted/20 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">Slide {index + 1}</p>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border bg-background disabled:opacity-40"
                onClick={() =>
                  updateSlides(moveArrayItem(draft.slides, index, index - 1))
                }
                disabled={busy || index === 0}
                aria-label="Mover para cima"
              >
                <ChevronUp className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border bg-background disabled:opacity-40"
                onClick={() =>
                  updateSlides(moveArrayItem(draft.slides, index, index + 1))
                }
                disabled={busy || index === draft.slides.length - 1}
                aria-label="Mover para baixo"
              >
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg border border-destructive/30 bg-background text-destructive disabled:opacity-40"
                onClick={() =>
                  updateSlides(
                    draft.slides.filter((_, slideIndex) => slideIndex !== index)
                  )
                }
                disabled={busy}
                aria-label="Remover slide"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {slide.url ? (
            <img
              src={slide.url}
              alt=""
              className="h-32 w-full rounded-xl border object-cover"
            />
          ) : null}

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Legenda
            </span>
            <input
              type="text"
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={slide.caption}
              onChange={(event) =>
                updateSlides(
                  draft.slides.map((item, slideIndex) =>
                    slideIndex === index
                      ? { ...item, caption: event.target.value }
                      : item
                  )
                )
              }
              disabled={busy}
            />
          </label>
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
          if (file) void handleAddPhoto(file)
        }}
      />
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/40",
          busy && "pointer-events-none opacity-60"
        )}
        onClick={() => fileInputRef.current?.click()}
        disabled={busy}
      >
        <ImagePlus className="size-4" />
        {uploading ? "Enviando..." : "Adicionar foto"}
      </button>

      {draft.slides.length === 0 ? (
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border bg-background px-3 py-3 text-sm"
          onClick={() => updateSlides([createGallerySlide()])}
          disabled={busy}
        >
          <Plus className="size-4" />
          Criar slide vazio
        </button>
      ) : null}

      {uploadError ? (
        <p className="text-sm text-destructive">{uploadError}</p>
      ) : null}
    </div>
  )
}
