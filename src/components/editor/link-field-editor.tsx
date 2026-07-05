import type { ContentLink } from "@/lib/content/fields/link"
import { cn } from "@/lib/utils"
import type { PageOption } from "@/components/editor/edit-field-editors"

type LinkFieldEditorProps = {
  link: ContentLink
  pages: PageOption[]
  loading: boolean
  onChange: (link: ContentLink) => void
}

export function LinkFieldEditor({
  link,
  pages,
  loading,
  onChange,
}: LinkFieldEditorProps) {
  return (
    <fieldset className="space-y-3 rounded-xl border bg-muted/20 p-3">
      <legend className="px-1 text-xs font-medium text-muted-foreground">
        Destino
      </legend>
      <div className="flex gap-2">
        {(["page", "external"] as const).map((kind) => (
          <label
            key={kind}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm",
              link.kind === kind && "border-primary bg-primary/5"
            )}
          >
            <input
              type="radio"
              className="sr-only"
              checked={link.kind === kind}
              onChange={() =>
                onChange(
                  kind === "page"
                    ? {
                        kind: "page",
                        pageSlug: pages[0]?.slug ?? "home",
                      }
                    : { kind: "external", url: "", openInNewTab: true }
                )
              }
              disabled={loading}
            />
            {kind === "page" ? "Página interna" : "Link externo"}
          </label>
        ))}
      </div>

      {link.kind === "page" ? (
        <div className="space-y-2">
          <label className="block space-y-1">
            <span className="text-xs text-muted-foreground">Página</span>
            <select
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={link.pageSlug}
              onChange={(event) =>
                onChange({ ...link, pageSlug: event.target.value })
              }
              disabled={loading}
            >
              {pages.map((page) => (
                <option key={page.slug} value={page.slug}>
                  {page.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-xs text-muted-foreground">
              Âncora (opcional)
            </span>
            <input
              type="text"
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={link.hash ?? ""}
              onChange={(event) =>
                onChange({
                  ...link,
                  hash: event.target.value || undefined,
                })
              }
              disabled={loading}
              placeholder="ex.: produtos"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block space-y-1">
            <span className="text-xs text-muted-foreground">URL</span>
            <input
              type="url"
              className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
              value={link.url}
              onChange={(event) =>
                onChange({ ...link, url: event.target.value })
              }
              disabled={loading}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={link.openInNewTab ?? true}
              onChange={(event) =>
                onChange({ ...link, openInNewTab: event.target.checked })
              }
              disabled={loading}
            />
            Abrir em nova aba
          </label>
        </div>
      )}
    </fieldset>
  )
}

type ActionFieldEditorProps = {
  label: string
  actionLabel: string
  link: ContentLink
  pages: PageOption[]
  loading: boolean
  onLabelChange: (label: string) => void
  onLinkChange: (link: ContentLink) => void
  onRemove: () => void
}

export function ActionFieldEditor({
  label,
  actionLabel,
  link,
  pages,
  loading,
  onLabelChange,
  onLinkChange,
  onRemove,
}: ActionFieldEditorProps) {
  return (
    <div className="space-y-3 rounded-xl border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <button
          type="button"
          className="text-xs text-destructive"
          onClick={onRemove}
          disabled={loading}
        >
          Remover
        </button>
      </div>
      <label className="block space-y-1">
        <span className="text-xs text-muted-foreground">Texto do botão</span>
        <input
          type="text"
          className="w-full rounded-xl border bg-input/30 px-3 py-2 text-sm"
          value={actionLabel}
          onChange={(event) => onLabelChange(event.target.value)}
          disabled={loading}
        />
      </label>
      <LinkFieldEditor
        link={link}
        pages={pages}
        loading={loading}
        onChange={onLinkChange}
      />
    </div>
  )
}
