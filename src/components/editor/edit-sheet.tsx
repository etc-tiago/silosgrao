import { Dialog } from "@base-ui/react/dialog"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { useEditNavigation } from "@/components/content/editor-mode"
import type { EditableFields } from "@/lib/content/fields/types"
import type { EditSearch } from "@/lib/content/fields/search"
import { orpc } from "@/orpc/browser-client"
import { refreshEditorData } from "@/lib/content/refresh-editor-data"
import { cn } from "@/lib/utils"

type EditSheetProps = {
  content: Record<string, string>
  fields: EditableFields
  search: EditSearch
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result !== "string") {
        reject(new Error("Falha ao ler arquivo."))
        return
      }
      const base64 = result.split(",")[1]
      if (!base64) {
        reject(new Error("Falha ao ler arquivo."))
        return
      }
      resolve(base64)
    }
    reader.onerror = () => reject(reader.error ?? new Error("Falha ao ler arquivo."))
    reader.readAsDataURL(file)
  })
}

export function EditSheet({ content, fields, search }: EditSheetProps) {
  const router = useRouter()
  const { closeEdit } = useEditNavigation()
  const open = Boolean(search.editar && search.tipo)
  const field = search.editar ? fields[search.editar] : undefined
  const tipo = search.tipo
  const currentValue = search.editar ? (content[search.editar] ?? "") : ""
  const [draft, setDraft] = useState(currentValue)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setDraft(currentValue)
    setImageFile(null)
    setImagePreview(null)
    setError(null)
  }, [open, currentValue, search.editar])

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null)
      return
    }

    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  async function refreshData() {
    await refreshEditorData(router)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      closeEdit()
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setError(null)
  }

  async function handleSave() {
    if (!field || !search.editar || !tipo) return

    if (tipo !== field.editTipo) {
      setError("Tipo de edição inválido para este campo.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      let value = draft

      if (tipo === "img") {
        if (!imageFile) {
          setError("Selecione uma imagem para enviar.")
          return
        }

        const upload = await orpc.content.uploadImage({
          pageSlug: field.pageSlug,
          path: search.editar,
          mimeType: imageFile.type,
          dataBase64: await fileToBase64(imageFile),
        })
        value = upload.url
      } else if (tipo === "video") {
        setError("Editor de vídeo em breve.")
        return
      }

      await orpc.content.setField({
        pageSlug: field.pageSlug,
        path: search.editar,
        type: field.contentType,
        value,
      })

      await refreshData()
      closeEdit()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar.")
    } finally {
      setLoading(false)
    }
  }

  const canSave =
    tipo === "text"
      ? draft !== currentValue
      : tipo === "img"
        ? imageFile !== null
        : false

  if (!open || !field || !tipo) {
    return null
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[90] bg-black/40 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col border-l bg-background shadow-2xl",
            "transition-transform duration-200 data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b px-6 py-4">
            <Dialog.Title className="text-lg font-semibold">
              Editar {field.label}
            </Dialog.Title>
            <Dialog.Close
              render={
                <Button variant="ghost" size="sm" disabled={loading}>
                  Fechar
                </Button>
              }
            />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {tipo === "text" ? (
              <label className="block space-y-2">
                <span className="text-sm font-medium">{field.label}</span>
                <textarea
                  className="min-h-32 w-full rounded-xl border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={loading}
                />
              </label>
            ) : null}

            {tipo === "img" ? (
              <div className="space-y-4">
                {currentValue ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Imagem atual</p>
                    <img
                      src={imagePreview ?? currentValue}
                      alt={field.label}
                      className="max-h-48 w-full rounded-xl border object-contain"
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Enviar nova imagem</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    {imageFile ? imageFile.name : "Clique ou arraste uma imagem"}
                  </button>
                </div>
              </div>
            ) : null}

            {tipo === "video" ? (
              <p className="text-sm text-muted-foreground">
                Editor de vídeo em breve.
              </p>
            ) : null}

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
          </div>

          <div className="flex justify-end gap-2 border-t px-6 py-4">
            <Button variant="outline" onClick={closeEdit} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading || !canSave}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
