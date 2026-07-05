import { useEditNavigation } from "@/components/content/editor-mode"
import { EditFieldForm } from "@/components/editor/edit-field-editors"
import { useEditFieldForm } from "@/components/editor/use-edit-field-form"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { EditSearch } from "@/lib/content/fields/search"
import type { EditableFields } from "@/lib/content/fields/types"
import { cn } from "@/lib/utils"

const WIDE_EDITOR_TIPOS = new Set([
  "gallery",
  "item-list",
  "hero-strip",
  "catalog",
])

type EditFieldDrawerProps = {
  content: Record<string, string>
  fields: EditableFields
  search: EditSearch
}

export function EditFieldDrawer({
  content,
  fields,
  search,
}: EditFieldDrawerProps) {
  const { closeEdit } = useEditNavigation()

  const form = useEditFieldForm({
    content,
    fields,
    search,
    onSaved: closeEdit,
  })

  if (!form.open || !form.field || !form.tipo) {
    return null
  }

  const isWide = WIDE_EDITOR_TIPOS.has(form.tipo)

  return (
    <Drawer
      open={form.open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) closeEdit()
      }}
      swipeDirection="right"
    >
      <DrawerContent
        className={cn(
          "h-full max-h-none data-[swipe-axis=x]:w-full",
          isWide
            ? "data-[swipe-axis=x]:sm:max-w-2xl"
            : "data-[swipe-axis=x]:sm:max-w-md"
        )}
      >
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle>Editar {form.field.label}</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <EditFieldForm
            fieldLabel={form.field.label}
            tipo={form.tipo}
            draft={form.draft}
            setDraft={form.setDraft}
            currentValue={form.currentValue}
            buttonDraft={form.buttonDraft}
            setButtonDraft={form.setButtonDraft}
            bgImageDraft={form.bgImageDraft}
            setBgImageDraft={form.setBgImageDraft}
            logoPresetDraft={form.logoPresetDraft}
            setLogoPresetDraft={form.setLogoPresetDraft}
            categoryIconDraft={form.categoryIconDraft}
            setCategoryIconDraft={form.setCategoryIconDraft}
            galleryDraft={form.galleryDraft}
            setGalleryDraft={form.setGalleryDraft}
            itemListDraft={form.itemListDraft}
            setItemListDraft={form.setItemListDraft}
            heroStripDraft={form.heroStripDraft}
            setHeroStripDraft={form.setHeroStripDraft}
            catalogDraft={form.catalogDraft}
            setCatalogDraft={form.setCatalogDraft}
            compositePageSlug={form.field.pageSlug}
            compositeFieldPath={search.editar ?? ""}
            pages={form.pages}
            loading={form.loading}
            error={form.error}
            fileInputRef={form.fileInputRef}
            imageFile={form.imageFile}
            imagePreview={form.imagePreview}
            onImageChange={form.handleImageChange}
          />
        </div>

        <DrawerFooter className="flex-row justify-end gap-2 border-t pt-4">
          <DrawerClose render={<Button variant="outline" disabled={form.loading} />}>
            Cancelar
          </DrawerClose>
          <Button
            onClick={form.handleSave}
            disabled={form.loading || !form.canSave}
          >
            {form.loading ? "Salvando..." : "Salvar"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
