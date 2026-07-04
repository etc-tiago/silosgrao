import { useEditNavigation } from "@/components/content/editor-mode"
import { EditFieldDrawer } from "@/components/editor/edit-field-drawer"
import { groupEditableFields } from "@/components/editor/use-edit-field-form"
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
import type { EditSearch } from "@/lib/content/fields/search"
import type { EditableFields } from "@/lib/content/fields/types"
import { cn } from "@/lib/utils"
import { ChevronRight, ImageIcon, Type } from "lucide-react"

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
  const { textFields, imageFields } = groupEditableFields(fields)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
      <DrawerContent className="h-full max-h-none data-[swipe-axis=x]:w-full data-[swipe-axis=x]:sm:max-w-md">
        <DrawerHeader className="flex-row items-center justify-between border-b pb-4">
          <DrawerTitle>Conteúdo da página</DrawerTitle>
          <DrawerClose render={<Button variant="ghost" size="sm" />}>
            Fechar
          </DrawerClose>
        </DrawerHeader>

        <Tabs defaultValue="textos" className="flex min-h-0 flex-1 flex-col px-4">
          <TabsList className="w-full">
            <TabsTrigger value="textos" className="flex-1 gap-1.5">
              <Type className="size-4" />
              Textos
              <span className="text-xs text-muted-foreground">
                ({textFields.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="imagens" className="flex-1 gap-1.5">
              <ImageIcon className="size-4" />
              Imagens
              <span className="text-xs text-muted-foreground">
                ({imageFields.length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="textos" className="flex-1 overflow-y-auto pb-4">
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
                        value={parseButtonValue(raw, {
                          label: "",
                          variant: "primary",
                          link: { kind: "page", pageSlug: "home" },
                        }).label}
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

          <TabsContent value="imagens" className="flex-1 overflow-y-auto pb-4">
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
        </Tabs>

        <EditFieldDrawer content={content} fields={fields} search={search} />
      </DrawerContent>
    </Drawer>
  )
}
