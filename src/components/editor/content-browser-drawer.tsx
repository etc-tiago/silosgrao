import { useEditNavigation } from "@/components/content/editor-mode"
import { EditFieldDrawer } from "@/components/editor/edit-field-drawer"
import { groupEditableFields } from "@/components/editor/use-edit-field-form"
import { CategoryIcon } from "@/components/icons/category-icon"
import { SilosGraosSymbol } from "@/components/icons/silos-graos-symbol"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseButtonValue } from "@/lib/content/fields/button"
import {
  intentLinkFallbackForPath,
  intentsCtaDefault,
  parseIntentLinkValue,
} from "@/lib/content/fields/home-intents"
import {
  CATEGORY_ICON_LABELS,
  categoryIconFallbackForPath,
  parseCategoryIconValue,
} from "@/lib/content/fields/category-icon"
import {
  DEFAULT_LOGO_PRESET,
  LOGO_PRESET_LABELS,
  parseLogoPresetValue,
} from "@/lib/content/fields/logo-preset"
import {
  galleryItemCover,
  parseGalleryValue,
} from "@/lib/content/fields/home-gallery"
import type { EditSearch } from "@/lib/content/fields/search"
import type { EditableFields } from "@/lib/content/fields/types"
import { cn } from "@/lib/utils"
import { ChevronRight, ImageIcon, Images, Palette, Shapes, Type } from "lucide-react"

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

export function ContentBrowserDrawer({
  content,
  fields,
  search,
  open,
  onOpenChange,
}: ContentBrowserDrawerProps) {
  const { editPath, openEdit } = useEditNavigation()
  const { textFields, imageFields, logoFields, iconFields, galleryFields } =
    groupEditableFields(fields)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="h-full max-h-none data-[swipe-axis=x]:w-full data-[swipe-axis=x]:sm:max-w-md">
        <DrawerHeader className="flex-row items-center justify-between border-b pb-4">
          <DrawerTitle>Conteúdo da página</DrawerTitle>
          <DrawerClose render={<Button variant="ghost" size="sm" />}>
            Fechar
          </DrawerClose>
        </DrawerHeader>

        <Tabs defaultValue="textos" className="flex min-h-0 flex-1 flex-col">
          <TabsList className="w-full bg-muted px-4 rounded-none">
            <TabsTrigger value="textos" className="flex-1 gap-1.5">
              <Type className="size-4" />
              <span>Textos</span>
            </TabsTrigger>
            <TabsTrigger value="imagens" className="flex-1 gap-1.5">
              <ImageIcon className="size-4" />
              <span>Imagens</span>
            </TabsTrigger>
            <TabsTrigger value="icones" className="flex-1 gap-1.5">
              <Shapes className="size-4" />
              <span>Ícones</span>
            </TabsTrigger>
            <TabsTrigger value="logo" className="flex-1 gap-1.5">
              <Palette className="size-4" />
              <span>Logo</span>
            </TabsTrigger>
            {galleryFields.length > 0 ? (
              <TabsTrigger value="galeria" className="flex-1 gap-1.5">
                <Images className="size-4" />
                <span>Galeria</span>
              </TabsTrigger>
            ) : null}
          </TabsList>

          <TabsContent value="textos" className="flex-1 overflow-y-auto pb-4 px-4">
            <div className="space-y-2 pt-2">
              {textFields.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum campo de texto nesta página.
                </p>
              ) : (
                textFields.map(([path, field]) => {
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
                    ) : field.editTipo === "intent-link" ? (
                      <TextPreview
                        value={(() => {
                          const link = parseIntentLinkValue(
                            raw,
                            intentLinkFallbackForPath(path)
                          )
                          return link.kind === "route"
                            ? `${link.to}${link.hash ? `#${link.hash}` : ""}`
                            : link.href
                        })()}
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
                      onSelect={() => openEdit(path, field.editTipo)}
                    />
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="imagens" className="flex-1 overflow-y-auto pb-4 px-4">
            <div className="space-y-2 pt-2">
              {imageFields.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma imagem editável nesta página.
                </p>
              ) : (
                imageFields.map(([path, field]) => {
                  const src = content[path]
                  return (
                    <FieldListItem
                      key={path}
                      path={path}
                      label={field.label}
                      selected={editPath === path}
                      onSelect={() => openEdit(path, field.editTipo)}
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
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="icones" className="flex-1 overflow-y-auto pb-4 px-4">
            <div className="space-y-2 pt-2">
              {iconFields.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum ícone editável nesta página.
                </p>
              ) : (
                iconFields.map(([path, field]) => {
                  const icon = parseCategoryIconValue(
                    content[path],
                    categoryIconFallbackForPath(path)
                  )
                  return (
                    <FieldListItem
                      key={path}
                      path={path}
                      label={field.label}
                      selected={editPath === path}
                      onSelect={() => openEdit(path, field.editTipo)}
                      thumbnail={
                        <div className="flex size-12 items-center justify-center rounded-lg border bg-muted/30">
                          <CategoryIcon icon={icon} className="size-6" />
                        </div>
                      }
                      subtitle={
                        <p className="text-xs text-muted-foreground">
                          {CATEGORY_ICON_LABELS[icon]}
                        </p>
                      }
                    />
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="logo" className="flex-1 overflow-y-auto pb-4 px-4">
            <div className="space-y-2 pt-2">
              {logoFields.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhuma configuração de logo nesta página.
                </p>
              ) : (
                logoFields.map(([path, field]) => {
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
                      onSelect={() => openEdit(path, field.editTipo)}
                      thumbnail={
                        <SilosGraosSymbol
                          preset={preset}
                          className="size-12"
                        />
                      }
                      subtitle={
                        <p className="text-xs text-muted-foreground">
                          {LOGO_PRESET_LABELS[preset]}
                        </p>
                      }
                    />
                  )
                })
              )}
            </div>
          </TabsContent>

          {galleryFields.length > 0 ? (
            <TabsContent
              value="galeria"
              className="flex-1 overflow-y-auto pb-4 px-4"
            >
              <div className="space-y-2 pt-2">
                {galleryFields.map(([path, field]) => {
                  const gallery = parseGalleryValue(content[path])
                  const visibleItems = gallery.items.filter(
                    (item) => item.photos.length > 0
                  )
                  const previewItems = visibleItems.slice(0, 3)

                  return (
                    <FieldListItem
                      key={path}
                      path={path}
                      label={field.label}
                      selected={editPath === path}
                      onSelect={() => openEdit(path, field.editTipo)}
                      thumbnail={
                        previewItems.length > 0 ? (
                          <div className="flex size-12 overflow-hidden rounded-lg border">
                            {previewItems.map((item, index) => (
                              <img
                                key={item.id}
                                src={galleryItemCover(item)}
                                alt=""
                                className={cn(
                                  "size-full object-cover",
                                  previewItems.length > 1 && "w-1/3"
                                )}
                                style={
                                  previewItems.length > 1
                                    ? { marginLeft: index > 0 ? -8 : 0 }
                                    : undefined
                                }
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex size-12 items-center justify-center rounded-lg border bg-muted/30">
                            <Images className="size-5 text-muted-foreground" />
                          </div>
                        )
                      }
                      subtitle={
                        <p className="text-xs text-muted-foreground">
                          {visibleItems.length}{" "}
                          {visibleItems.length === 1 ? "item" : "itens"}
                        </p>
                      }
                    />
                  )
                })}
              </div>
            </TabsContent>
          ) : null}
        </Tabs>

        <EditFieldDrawer content={content} fields={fields} search={search} />
      </DrawerContent>
    </Drawer>
  )
}
