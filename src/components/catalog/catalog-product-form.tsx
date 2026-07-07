import { fileToBase64 } from "@/components/editor/edit-field-editors"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type {
  CatalogCategoryWithCount,
  CatalogProductDetail,
} from "@/lib/catalog/types"
import { specsFromText, specsToText } from "@/lib/catalog/product-fields"
import { orpc } from "@/orpc/browser-client"
import { ImagePlus, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type CatalogProductFormProps = {
  open: boolean
  productSlug: string | null
  categories: CatalogCategoryWithCount[]
  onClose: () => void
  onSaved: () => void
}

type FormState = {
  title: string
  capacity: string
  description: string
  specsText: string
  imageUrl: string
  categoryId: number | null
  gallery: string[]
  showOnHomepage: boolean
}

const emptyForm: FormState = {
  title: "",
  capacity: "",
  description: "",
  specsText: "",
  imageUrl: "",
  categoryId: null,
  gallery: [],
  showOnHomepage: false,
}

export function CatalogProductForm({
  open,
  productSlug,
  categories,
  onClose,
  onSaved,
}: CatalogProductFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [homepageStatus, setHomepageStatus] = useState<{
    count: number
    limit: number
    canEnable: boolean
  } | null>(null)
  const [editingProductId, setEditingProductId] = useState<number | undefined>()
  const mainImageRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const isEditing = productSlug !== null

  useEffect(() => {
    if (!open) return

    if (!productSlug) {
      setForm(emptyForm)
      setEditingProductId(undefined)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    orpc.catalog
      .get({ slug: productSlug })
      .then((product) => {
        if (cancelled) return
        setForm(productToForm(product))
        setEditingProductId(product.id)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Falha ao carregar produto.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, productSlug])

  useEffect(() => {
    if (!open || !form.categoryId) {
      setHomepageStatus(null)
      return
    }

    let cancelled = false

    orpc.catalog
      .homepageStatus({
        categoryId: form.categoryId,
        excludeProductId: editingProductId,
      })
      .then((status) => {
        if (cancelled) return
        setHomepageStatus(status)
      })
      .catch(() => {
        if (cancelled) return
        setHomepageStatus(null)
      })

    return () => {
      cancelled = true
    }
  }, [open, form.categoryId, editingProductId])

  const homepageCheckboxDisabled =
    !form.categoryId ||
    saving ||
    loading ||
    uploading ||
    (!form.showOnHomepage && homepageStatus !== null && !homepageStatus.canEnable)

  const homepageHelperText = !form.categoryId
    ? "Selecione uma categoria para destacar na homepage."
    : !form.showOnHomepage && homepageStatus && !homepageStatus.canEnable
      ? "Limite de 3 produtos na homepage atingido nesta categoria."
      : null

  async function uploadImage(file: File) {
    setUploading(true)
    setError(null)
    try {
      const result = await orpc.content.uploadImage({
        pageSlug: "catalogo",
        path: `products/${productSlug ?? "new"}`,
        mimeType: file.type,
        dataBase64: await fileToBase64(file),
      })
      return result.url
    } finally {
      setUploading(false)
    }
  }

  async function handleMainImage(file: File) {
    const url = await uploadImage(file)
    setForm((current) => ({ ...current, imageUrl: url }))
  }

  async function handleGalleryImages(files: FileList) {
    const urls: string[] = []
    for (const file of Array.from(files)) {
      urls.push(await uploadImage(file))
    }
    setForm((current) => ({ ...current, gallery: [...current.gallery, ...urls] }))
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.imageUrl.trim()) {
      setError("Título e imagem principal são obrigatórios.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const payload = {
        title: form.title.trim(),
        priceCents: 0,
        capacity: form.capacity.trim() || null,
        description: form.description.trim() || null,
        specs: specsFromText(form.specsText),
        imageUrl: form.imageUrl,
        categoryId: form.categoryId,
        gallery: form.gallery,
        showOnHomepage: form.showOnHomepage,
      }

      if (isEditing && productSlug) {
        await orpc.catalog.update({ slug: productSlug, data: payload })
      } else {
        await orpc.catalog.create(payload)
      }

      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar produto.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!productSlug) return
    if (!window.confirm("Excluir este produto? Esta ação não pode ser desfeita.")) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      await orpc.catalog.delete({ slug: productSlug })
      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir produto.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      swipeDirection="right"
    >
      <DrawerContent className="max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>
            {isEditing ? "Editar produto" : "Novo produto"}
          </DrawerTitle>
          <DrawerDescription>
            Preencha os dados do item do catálogo.
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <>
              <label className="block space-y-2">
                <span className="text-sm font-medium">Título</span>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">Capacidade (opcional)</span>
                <input
                  value={form.capacity}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      capacity: event.target.value,
                    }))
                  }
                  placeholder="Ex.: 50 toneladas"
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">Categoria (opcional)</span>
                <select
                  value={form.categoryId ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      categoryId: event.target.value
                        ? Number(event.target.value)
                        : null,
                      showOnHomepage: event.target.value
                        ? current.showOnHomepage
                        : false,
                    }))
                  }
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-start gap-3 rounded-xl border bg-muted/20 p-4">
                <input
                  type="checkbox"
                  checked={form.showOnHomepage}
                  disabled={homepageCheckboxDisabled}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      showOnHomepage: event.target.checked,
                    }))
                  }
                  className="mt-0.5"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-medium">
                    Mostrar na homepage
                  </span>
                  {homepageHelperText ? (
                    <span className="block text-sm text-muted-foreground">
                      {homepageHelperText}
                    </span>
                  ) : (
                    <span className="block text-sm text-muted-foreground">
                      Até 3 produtos por categoria podem ser destacados. Os
                      demais slots são preenchidos automaticamente por ordem.
                    </span>
                  )}
                </span>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">Descrição (opcional)</span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">
                  Especificações (opcional)
                </span>
                <textarea
                  value={form.specsText}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      specsText: event.target.value,
                    }))
                  }
                  rows={5}
                  placeholder={"Uma especificação por linha\nDiâmetro: 3,5m\nAltura: 8m"}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-medium">Imagem principal</span>
                <div className="flex items-start gap-3">
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="Imagem principal"
                      className="size-24 rounded-xl border object-cover"
                    />
                  ) : (
                    <div className="flex size-24 items-center justify-center rounded-xl border bg-muted text-muted-foreground">
                      <ImagePlus className="size-6" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading || saving}
                    onClick={() => mainImageRef.current?.click()}
                  >
                    Enviar imagem
                  </Button>
                  <input
                    ref={mainImageRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) void handleMainImage(file)
                      event.target.value = ""
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">Galeria (opcional)</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading || saving}
                    onClick={() => galleryRef.current?.click()}
                  >
                    Adicionar fotos
                  </Button>
                  <input
                    ref={galleryRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      const files = event.target.files
                      if (files?.length) void handleGalleryImages(files)
                      event.target.value = ""
                    }}
                  />
                </div>
                {form.gallery.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {form.gallery.map((url, index) => (
                      <div key={`${url}-${index}`} className="relative">
                        <img
                          src={url}
                          alt=""
                          className="aspect-square rounded-xl border object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 rounded-full bg-background/90 p-1 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              gallery: current.gallery.filter(
                                (_, itemIndex) => itemIndex !== index
                              ),
                            }))
                          }
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma foto na galeria.
                  </p>
                )}
              </div>
            </>
          )}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DrawerFooter className="flex-row justify-between gap-2 border-t pt-4">
          {isEditing ? (
            <Button
              type="button"
              variant="destructive"
              disabled={saving || loading}
              onClick={() => void handleDelete()}
            >
              <Trash2 className="size-4" />
              Excluir
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <DrawerClose
              render={<Button type="button" variant="outline" disabled={saving} />}
            >
              Cancelar
            </DrawerClose>
            <Button
              type="button"
              disabled={saving || loading || uploading}
              onClick={() => void handleSubmit()}
            >
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function productToForm(product: CatalogProductDetail): FormState {
  return {
    title: product.title,
    capacity: product.capacity ?? "",
    description: product.description ?? "",
    specsText: specsToText(product.specs),
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    gallery: product.gallery.map((image) => image.imageUrl),
    showOnHomepage: product.showOnHomepage,
  }
}
