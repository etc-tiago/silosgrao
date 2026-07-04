import { useEditNavigation } from "@/components/content/editor-mode"
import { Button } from "@/components/ui/button"
import {
  buttonValueSchema,
  heroCtaPrimaryDefault,
  heroCtaWhatsappDefault,
  parseButtonValue,
  serializeButtonValue,
  type ButtonValue,
} from "@/lib/content/fields/button"
import type { EditSearch } from "@/lib/content/fields/search"
import type { EditableFields } from "@/lib/content/fields/types"
import { refreshEditorData } from "@/lib/content/refresh-editor-data"
import { cn } from "@/lib/utils"
import { orpc } from "@/orpc/browser-client"
import { Dialog } from "@base-ui/react/dialog"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useRef, useState, type ChangeEvent } from "react"

type EditSheetProps = {
  content: Record<string, string>
  fields: EditableFields
  search: EditSearch
}

type PageOption = { slug: string; title: string }

function buttonFallbackForPath(path: string): ButtonValue {
  return path === "hero.cta.whatsapp"
    ? heroCtaWhatsappDefault
    : heroCtaPrimaryDefault
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

function ButtonFieldEditor({
  draft,
  pages,
  loading,
  onChange,
}: {
  draft: ButtonValue
  pages: PageOption[]
  loading: boolean
  onChange: (value: ButtonValue) => void
}) {
  return (
    <div className="space-y-6">
      <label className="block space-y-2">
        <span className="text-sm font-medium">Texto do botão</span>
        <input
          type="text"
          className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          value={draft.label}
          onChange={(event) =>
            onChange({ ...draft, label: event.target.value })
          }
          disabled={loading}
        />
      </label>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Destino</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="link-kind"
              checked={draft.link.kind === "page"}
              onChange={() =>
                onChange({
                  ...draft,
                  link: {
                    kind: "page",
                    pageSlug: pages[0]?.slug ?? "home",
                    hash: "",
                  },
                })
              }
              disabled={loading}
            />
            Página
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="link-kind"
              checked={draft.link.kind === "external"}
              onChange={() =>
                onChange({
                  ...draft,
                  link: {
                    kind: "external",
                    url: "https://",
                    openInNewTab: true,
                  },
                })
              }
              disabled={loading}
            />
            Link externo
          </label>
        </div>

        {draft.link.kind === "page" ? (
          <div className="space-y-3">
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">Página</span>
              <select
                className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={draft.link.pageSlug}
                onChange={(event) => {
                  if (draft.link.kind !== "page") return
                  onChange({
                    ...draft,
                    link: { ...draft.link, pageSlug: event.target.value },
                  })
                }}
                disabled={loading}
              >
                {pages.map((page) => (
                  <option key={page.slug} value={page.slug}>
                    {page.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">
                Âncora (opcional)
              </span>
              <input
                type="text"
                placeholder="ex: solucoes"
                className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={draft.link.hash ?? ""}
                onChange={(event) => {
                  if (draft.link.kind !== "page") return
                  onChange({
                    ...draft,
                    link: {
                      ...draft.link,
                      hash: event.target.value || undefined,
                    },
                  })
                }}
                disabled={loading}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block space-y-2">
              <span className="text-sm text-muted-foreground">URL</span>
              <input
                type="url"
                className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={draft.link.url}
                onChange={(event) => {
                  if (draft.link.kind !== "external") return
                  onChange({
                    ...draft,
                    link: { ...draft.link, url: event.target.value },
                  })
                }}
                disabled={loading}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.link.openInNewTab}
                onChange={(event) => {
                  if (draft.link.kind !== "external") return
                  onChange({
                    ...draft,
                    link: {
                      ...draft.link,
                      openInNewTab: event.target.checked,
                    },
                  })
                }}
                disabled={loading}
              />
              Abrir em nova aba
            </label>
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Estilo</legend>
        <div className="flex flex-col gap-2">
          {(
            [
              ["primary", "Cor primária"],
              ["secondary", "Cor secundária"],
              ["link", "Link"],
            ] as const
          ).map(([variant, label]) => (
            <label key={variant} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="button-variant"
                checked={draft.variant === variant}
                onChange={() => onChange({ ...draft, variant })}
                disabled={loading}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

export function EditSheet({ content, fields, search }: EditSheetProps) {
  const router = useRouter()
  const { closeEdit } = useEditNavigation()
  const open = Boolean(search.editar && search.tipo)
  const field = search.editar ? fields[search.editar] : undefined
  const tipo = search.tipo
  const currentValue = search.editar ? (content[search.editar] ?? "") : ""
  const buttonFallback = search.editar
    ? buttonFallbackForPath(search.editar)
    : heroCtaPrimaryDefault

  const [draft, setDraft] = useState(currentValue)
  const [buttonDraft, setButtonDraft] = useState<ButtonValue>(buttonFallback)
  const [pages, setPages] = useState<PageOption[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    setDraft(currentValue)
    setButtonDraft(parseButtonValue(currentValue, buttonFallback))
    setImageFile(null)
    setImagePreview(null)
    setError(null)
  }, [open, currentValue, search.editar, buttonFallback])

  useEffect(() => {
    if (!open || tipo !== "button") return

    let cancelled = false

    orpc.content
      .listPages()
      .then((result) => {
        if (!cancelled) setPages(result)
      })
      .catch(() => {
        if (!cancelled) setPages([{ slug: "home", title: "Início" }])
      })

    return () => {
      cancelled = true
    }
  }, [open, tipo])

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
      } else if (tipo === "button") {
        const parsed = buttonValueSchema.safeParse(buttonDraft)
        if (!parsed.success) {
          setError("Dados do botão inválidos.")
          return
        }
        value = serializeButtonValue(parsed.data)
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

  const currentButtonSerialized = serializeButtonValue(
    parseButtonValue(currentValue, buttonFallback)
  )
  const draftButtonSerialized = serializeButtonValue(buttonDraft)

  const canSave =
    tipo === "text"
      ? draft !== currentValue
      : tipo === "img"
        ? imageFile !== null
        : tipo === "button"
          ? draftButtonSerialized !== currentButtonSerialized &&
          buttonValueSchema.safeParse(buttonDraft).success
          : false

  if (!open || !field || !tipo) {
    return null
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-99 bg-black/40 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 z-10000 flex w-full max-w-md flex-col border-l bg-background shadow-2xl",
            "transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full"
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

            {tipo === "button" ? (
              <ButtonFieldEditor
                draft={buttonDraft}
                pages={pages}
                loading={loading}
                onChange={setButtonDraft}
              />
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
