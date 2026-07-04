import type { ButtonValue } from "@/lib/content/fields/button"
import {
  heroImageObjectFitOptions,
  heroImageObjectPositionOptions,
  type HeroImageValue,
} from "@/lib/content/fields/hero-image"
import { cn } from "@/lib/utils"
import type { ChangeEvent, RefObject } from "react"

export type PageOption = { slug: string; title: string }

export function fileToBase64(file: File): Promise<string> {
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

export function HeroImageFieldEditor({
  draft,
  previewSrc,
  loading,
  fileInputRef,
  onChange,
  onImageChange,
  imageFile,
}: {
  draft: HeroImageValue
  previewSrc: string
  loading: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  onChange: (value: HeroImageValue) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  imageFile: File | null
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Pré-visualização</p>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/30">
          <img
            src={previewSrc}
            alt="Pré-visualização da imagem de fundo"
            className="size-full"
            style={{
              objectFit: draft.objectFit,
              objectPosition: draft.objectPosition,
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Enviar nova imagem</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onImageChange}
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

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Como a imagem preenche a tela</legend>
        <div className="flex flex-col gap-3">
          {heroImageObjectFitOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer gap-3 rounded-xl border bg-input/20 p-3",
                draft.objectFit === option.value && "border-primary bg-primary/5"
              )}
            >
              <input
                type="radio"
                name="hero-object-fit"
                className="mt-1"
                checked={draft.objectFit === option.value}
                onChange={() =>
                  onChange({ ...draft, objectFit: option.value })
                }
                disabled={loading}
              />
              <span className="space-y-1">
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Ponto de foco da imagem</span>
        <span className="block text-xs text-muted-foreground">
          Define qual parte da imagem fica visível quando houver corte nas bordas.
        </span>
        <select
          className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          value={draft.objectPosition}
          onChange={(event) =>
            onChange({
              ...draft,
              objectPosition: event.target
                .value as HeroImageValue["objectPosition"],
            })
          }
          disabled={loading}
        >
          {heroImageObjectPositionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export function ButtonFieldEditor({
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

type EditFieldFormProps = {
  fieldLabel: string
  tipo: string
  draft: string
  setDraft: (value: string) => void
  currentValue: string
  buttonDraft: ButtonValue
  setButtonDraft: (value: ButtonValue) => void
  bgImageDraft: HeroImageValue
  setBgImageDraft: (value: HeroImageValue) => void
  pages: PageOption[]
  loading: boolean
  error: string | null
  fileInputRef: RefObject<HTMLInputElement | null>
  imageFile: File | null
  imagePreview: string | null
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function EditFieldForm({
  fieldLabel,
  tipo,
  draft,
  setDraft,
  currentValue,
  buttonDraft,
  setButtonDraft,
  bgImageDraft,
  setBgImageDraft,
  pages,
  loading,
  error,
  fileInputRef,
  imageFile,
  imagePreview,
  onImageChange,
}: EditFieldFormProps) {
  return (
    <>
      {tipo === "text" ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium">{fieldLabel}</span>
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
                alt={fieldLabel}
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
              onChange={onImageChange}
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

      {tipo === "bg-image" ? (
        <HeroImageFieldEditor
          draft={bgImageDraft}
          previewSrc={imagePreview ?? bgImageDraft.url}
          loading={loading}
          fileInputRef={fileInputRef}
          onChange={setBgImageDraft}
          onImageChange={onImageChange}
          imageFile={imageFile}
        />
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
        <p className="text-sm text-muted-foreground">Editor de vídeo em breve.</p>
      ) : null}

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
    </>
  )
}
