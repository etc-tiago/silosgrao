import { useEditNavigation } from "@/components/content/editor-mode"
import {
  buildContentFieldGroups,
  getContentGroupPanelTitle,
} from "@/components/editor/content-field-groups"
import { EditFieldDrawer } from "@/components/editor/edit-field-drawer"
import { groupEditableFields } from "@/components/editor/use-edit-field-form"
import { SilosGraosSymbol } from "@/components/icons/silos-graos-symbol"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { parseButtonValue } from "@/lib/content/fields/button"
import { parseCatalogValue } from "@/lib/content/fields/catalog"
import { parseGalleryValue } from "@/lib/content/fields/gallery"
import { parseHeroStripValue } from "@/lib/content/fields/hero-strip"
import { intentsCtaDefault } from "@/lib/content/fields/home-intents"
import { parseItemListValue } from "@/lib/content/fields/item-list"
import {
  DEFAULT_LOGO_PRESET,
  LOGO_PRESET_LABELS,
  parseLogoPresetValue,
} from "@/lib/content/fields/logo-preset"
import type { ContentGroupId, EditSearch } from "@/lib/content/fields/search"
import type { EditableFields, FieldDef } from "@/lib/content/fields/types"
import { cn } from "@/lib/utils"
import { ChevronRight, ImageIcon, Layers } from "lucide-react"

type ContentBrowserDrawerProps = {
  content: Record<string, string>
  fields: EditableFields
  search: EditSearch
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FieldListItem({
  path,
  label,
  thumbnail,
  subtitle,
  onSelect,
  selected,
}: {
  path: string
  label: string
  thumbnail?: React.ReactNode
  subtitle?: React.ReactNode
  onSelect: () => void
  selected: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-background p-3 text-left transition-colors hover:bg-muted/50",
        selected && "border-primary bg-primary/5"
      )}
      aria-label={`Editar ${label}`}
      data-edit-path={path}
    >
      {thumbnail ? <div className="shrink-0">{thumbnail}</div> : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label}</p>
        {subtitle ? <div className="mt-1">{subtitle}</div> : null}
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </button>
  )
}

function TextPreview({ value }: { value: string }) {
  const trimmed = value.trim()
  return (
    <p
      className={cn(
        "line-clamp-2 text-xs text-muted-foreground",
        !trimmed && "italic opacity-60"
      )}
    >
      {trimmed || "Sem texto"}
    </p>
  )
}

function sectionPreview(
  path: string,
  editTipo: FieldDef["editTipo"],
  content: Record<string, string>
) {
  if (editTipo === "gallery") {
    const gallery = parseGalleryValue(content[path], content)
    return `${gallery.slides.length} slide${gallery.slides.length === 1 ? "" : "s"}`
  }
  if (editTipo === "item-list") {
    const list = parseItemListValue(content[path], content)
    return `${list.items.length} item${list.items.length === 1 ? "" : "s"}`
  }
  if (editTipo === "hero-strip") {
    const hero = parseHeroStripValue(content[path], content)
    return `${hero.tiles.length} coluna${hero.tiles.length === 1 ? "" : "s"}`
  }
  if (editTipo === "catalog") {
    const catalog = parseCatalogValue(content[path], content)
    const count = catalog.categories.reduce(
      (total, category) => total + category.products.length,
      0
    )
    return `${count} produto${count === 1 ? "" : "s"}`
  }
  return ""
}

function sectionThumbnail(
  path: string,
  editTipo: FieldDef["editTipo"],
  content: Record<string, string>
) {
  if (editTipo === "gallery") {
    const slide = parseGalleryValue(content[path], content).slides[0]
    if (!slide?.url) {
      return (
        <div className="flex size-12 items-center justify-center rounded-lg border bg-muted/30">
          <ImageIcon className="size-5 text-muted-foreground" />
        </div>
      )
    }
    return (
      <img
        src={slide.url}
        alt=""
        className="size-12 rounded-lg border object-cover"
      />
    )
  }

  if (editTipo === "item-list") {
    const item = parseItemListValue(content[path], content).items[0]
    if (!item?.image) {
      return (
        <div className="flex size-12 items-center justify-center rounded-lg border bg-muted/30">
          <Layers className="size-5 text-muted-foreground" />
        </div>
      )
    }
    return (
      <img
        src={item.image}
        alt=""
        className="size-12 rounded-lg border object-cover"
      />
    )
  }

  if (editTipo === "hero-strip") {
    const tile = parseHeroStripValue(content[path], content).tiles[0]
    if (!tile?.image) {
      return (
        <div className="flex size-12 items-center justify-center rounded-lg border bg-muted/30">
          <ImageIcon className="size-5 text-muted-foreground" />
        </div>
      )
    }
    return (
      <img
        src={tile.image}
        alt=""
        className="size-12 rounded-lg border object-cover"
      />
    )
  }

  return (
    <div className="flex size-12 items-center justify-center rounded-lg border bg-muted/30">
      <Layers className="size-5 text-muted-foreground" />
    </div>
  )
}

const EMPTY_MESSAGES: Record<ContentGroupId, string> = {
  textos: "Nenhum campo de texto nesta página.",
  imagens: "Nenhuma imagem editável nesta página.",
  secoes: "Nenhuma seção editável nesta página.",
  logo: "Nenhuma configuração de logo nesta página.",
}

function CategoryFieldList({
  categoria,
  content,
  editPath,
  fields,
  onSelect,
}: {
  categoria: ContentGroupId
  content: Record<string, string>
  editPath?: string
  fields: Array<[string, FieldDef]>
  onSelect: (path: string, editTipo: FieldDef["editTipo"]) => void
}) {
  if (fields.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {EMPTY_MESSAGES[categoria]}
      </p>
    )
  }

  return (
    <div className="space-y-2 pt-2">
      {fields.map(([path, field]) => {
        if (categoria === "textos") {
          const raw = content[path] ?? ""
          const preview =
            field.editTipo === "button" ? (
              <TextPreview
                value={
                  parseButtonValue(
                    raw,
                    path === "intents.cta"
                      ? intentsCtaDefault
                      : {
                          label: "",
                          variant: "primary",
                          link: { kind: "page", pageSlug: "home" },
                        }
                  ).label
                }
              />
            ) : (
              <TextPreview value={raw} />
            )

          return (
            <FieldListItem
              key={path}
              path={path}
              label={field.label}
              subtitle={preview}
              selected={editPath === path}
              onSelect={() => onSelect(path, field.editTipo)}
            />
          )
        }

        if (categoria === "imagens") {
          const src = content[path]
          return (
            <FieldListItem
              key={path}
              path={path}
              label={field.label}
              selected={editPath === path}
              onSelect={() => onSelect(path, field.editTipo)}
              thumbnail={
                src ? (
                  <img
                    src={src}
                    alt=""
                    className="size-12 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-lg border bg-muted/30">
                    <ImageIcon className="size-5 text-muted-foreground" />
                  </div>
                )
              }
            />
          )
        }

        if (categoria === "secoes") {
          return (
            <FieldListItem
              key={path}
              path={path}
              label={field.label}
              selected={editPath === path}
              onSelect={() => onSelect(path, field.editTipo)}
              thumbnail={sectionThumbnail(path, field.editTipo, content)}
              subtitle={
                <p className="text-xs text-muted-foreground">
                  {sectionPreview(path, field.editTipo, content)}
                </p>
              }
            />
          )
        }

        const preset = parseLogoPresetValue(
          content[path],
          DEFAULT_LOGO_PRESET
        )
        return (
          <FieldListItem
            key={path}
            path={path}
            label={field.label}
            selected={editPath === path}
            onSelect={() => onSelect(path, field.editTipo)}
            thumbnail={
              <SilosGraosSymbol preset={preset} className="size-12" />
            }
            subtitle={
              <p className="text-xs text-muted-foreground">
                {LOGO_PRESET_LABELS[preset]}
              </p>
            }
          />
        )
      })}
    </div>
  )
}

export function ContentBrowserDrawer({
  content,
  fields,
  search,
  open,
  onOpenChange,
}: ContentBrowserDrawerProps) {
  const { editPath, openEdit } = useEditNavigation()
  const categoria = search.categoria
  const activeGroup = categoria
    ? buildContentFieldGroups(groupEditableFields(fields)).find(
        (group) => group.id === categoria
      )
    : undefined

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="h-full max-h-none data-[swipe-axis=x]:w-full data-[swipe-axis=x]:sm:max-w-md">
        <DrawerHeader className="flex-row items-center justify-between border-b pb-4">
          <DrawerTitle>
            {categoria ? getContentGroupPanelTitle(categoria) : "Conteúdo da página"}
          </DrawerTitle>
          <DrawerClose render={<Button variant="ghost" size="sm" />}>
            Fechar
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {categoria && activeGroup ? (
            <CategoryFieldList
              categoria={categoria}
              content={content}
              editPath={editPath}
              fields={activeGroup.fields}
              onSelect={openEdit}
            />
          ) : null}
        </div>

        <EditFieldDrawer content={content} fields={fields} search={search} />
      </DrawerContent>
    </Drawer>
  )
}
