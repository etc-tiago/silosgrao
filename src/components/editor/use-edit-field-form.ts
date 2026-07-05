import {
  buttonValueSchema,
  heroCtaPrimaryDefault,
  heroCtaWhatsappDefault,
  parseButtonValue,
  serializeButtonValue,
  type ButtonValue,
} from "@/lib/content/fields/button"
import {
  catalogValueSchema,
  DEFAULT_CATALOG_VALUE,
  parseCatalogValue,
  serializeCatalogValue,
  type CatalogValue,
} from "@/lib/content/fields/catalog"
import {
  categoryIconFallbackForPath,
  categoryIconSchema,
  parseCategoryIconValue,
  type CategoryIconId,
} from "@/lib/content/fields/category-icon"
import {
  DEFAULT_GALLERY_VALUE,
  galleryValueSchema,
  parseGalleryValue,
  serializeGalleryValue,
  type GalleryValue,
} from "@/lib/content/fields/gallery"
import {
  heroImageValueSchema,
  parseHeroImageValue,
  serializeHeroImageValue,
  type HeroImageValue,
} from "@/lib/content/fields/hero-image"
import {
  DEFAULT_HERO_STRIP_VALUE,
  heroStripValueSchema,
  parseHeroStripValue,
  serializeHeroStripValue,
  type HeroStripValue,
} from "@/lib/content/fields/hero-strip"
import { HERO_COLUMN_DEFAULTS } from "@/lib/content/fields/home-hero"
import { intentsCtaDefault } from "@/lib/content/fields/home-intents"
import {
  DEFAULT_ITEM_LIST_VALUE,
  itemListValueSchema,
  parseItemListValue,
  serializeItemListValue,
  type ItemListValue,
} from "@/lib/content/fields/item-list"
import {
  DEFAULT_LOGO_PRESET,
  logoPresetSchema,
  parseLogoPresetValue,
} from "@/lib/content/fields/logo-preset"
import type { LogoColorPreset } from "@/components/icons/logo-presets"
import type { EditSearch } from "@/lib/content/fields/search"
import type { EditableFields, FieldDef } from "@/lib/content/fields/types"
import { refreshEditorData } from "@/lib/content/refresh-editor-data"
import { orpc } from "@/orpc/browser-client"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { fileToBase64, type PageOption } from "@/components/editor/edit-field-editors"

function buttonFallbackForPath(path: string): ButtonValue {
  if (path === "intents.cta") return intentsCtaDefault
  return path === "hero.cta.whatsapp"
    ? heroCtaWhatsappDefault
    : heroCtaPrimaryDefault
}

type UseEditFieldFormOptions = {
  content: Record<string, string>
  fields: EditableFields
  search: EditSearch
  onSaved: () => void
}

function validGalleryDraft(draft: GalleryValue) {
  return draft.slides.filter((slide) => slide.url.trim())
}

function validItemListDraft(draft: ItemListValue) {
  return draft.items.filter((item) => item.image.trim())
}

function validHeroStripDraft(draft: HeroStripValue) {
  return draft.tiles.filter((tile) => tile.image.trim())
}

export function useEditFieldForm({
  content,
  fields,
  search,
  onSaved,
}: UseEditFieldFormOptions) {
  const router = useRouter()
  const open = Boolean(search.editar && search.tipo)
  const field: FieldDef | undefined = search.editar
    ? fields[search.editar]
    : undefined
  const tipo = search.tipo
  const currentValue = search.editar ? (content[search.editar] ?? "") : ""
  const buttonFallback = search.editar
    ? buttonFallbackForPath(search.editar)
    : heroCtaPrimaryDefault

  const heroImageFallback = parseHeroImageValue("", HERO_COLUMN_DEFAULTS[0])

  const [draft, setDraft] = useState(currentValue)
  const [buttonDraft, setButtonDraft] = useState<ButtonValue>(buttonFallback)
  const [bgImageDraft, setBgImageDraft] =
    useState<HeroImageValue>(heroImageFallback)
  const [logoPresetDraft, setLogoPresetDraft] =
    useState<LogoColorPreset>(DEFAULT_LOGO_PRESET)
  const [categoryIconDraft, setCategoryIconDraft] =
    useState<CategoryIconId>("building-2")
  const [galleryDraft, setGalleryDraft] =
    useState<GalleryValue>(DEFAULT_GALLERY_VALUE)
  const [itemListDraft, setItemListDraft] =
    useState<ItemListValue>(DEFAULT_ITEM_LIST_VALUE)
  const [heroStripDraft, setHeroStripDraft] =
    useState<HeroStripValue>(DEFAULT_HERO_STRIP_VALUE)
  const [catalogDraft, setCatalogDraft] =
    useState<CatalogValue>(DEFAULT_CATALOG_VALUE)
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
    setBgImageDraft(parseHeroImageValue(currentValue, HERO_COLUMN_DEFAULTS[0]))
    setLogoPresetDraft(parseLogoPresetValue(currentValue, DEFAULT_LOGO_PRESET))
    setCategoryIconDraft(
      parseCategoryIconValue(
        currentValue,
        search.editar
          ? categoryIconFallbackForPath(search.editar)
          : "building-2"
      )
    )
    setGalleryDraft(parseGalleryValue(currentValue, content))
    setItemListDraft(parseItemListValue(currentValue, content))
    setHeroStripDraft(parseHeroStripValue(currentValue, content))
    setCatalogDraft(parseCatalogValue(currentValue, content))
    setImageFile(null)
    setImagePreview(null)
    setError(null)
  }, [open, currentValue, search.editar, buttonFallback, content])

  useEffect(() => {
    if (!open) return

    let cancelled = false

    orpc.content
      .listPages()
      .then((result) => {
        if (!cancelled) setPages(result)
      })
      .catch(() => {
        if (!cancelled) {
          setPages([
            { slug: "home", title: "Início" },
            { slug: "produtos", title: "Produtos" },
            { slug: "site", title: "Site global" },
          ])
        }
      })

    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null)
      return
    }

    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

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
      } else if (tipo === "bg-image") {
        let url = bgImageDraft.url

        if (imageFile) {
          const upload = await orpc.content.uploadImage({
            pageSlug: field.pageSlug,
            path: search.editar,
            mimeType: imageFile.type,
            dataBase64: await fileToBase64(imageFile),
          })
          url = upload.url
        }

        const parsed = heroImageValueSchema.safeParse({ ...bgImageDraft, url })
        if (!parsed.success) {
          setError("Configuração da imagem de fundo inválida.")
          return
        }

        value = serializeHeroImageValue(parsed.data)
      } else if (tipo === "button") {
        const parsed = buttonValueSchema.safeParse(buttonDraft)
        if (!parsed.success) {
          setError("Dados do botão inválidos.")
          return
        }
        value = serializeButtonValue(parsed.data)
      } else if (tipo === "logo-preset") {
        const parsed = logoPresetSchema.safeParse(logoPresetDraft)
        if (!parsed.success) {
          setError("Cor da logo inválida.")
          return
        }
        value = parsed.data
      } else if (tipo === "category-icon") {
        const parsed = categoryIconSchema.safeParse(categoryIconDraft)
        if (!parsed.success) {
          setError("Ícone inválido.")
          return
        }
        value = parsed.data
      } else if (tipo === "gallery") {
        const slides = validGalleryDraft(galleryDraft)
        if (slides.length === 0) {
          setError("Adicione ao menos um slide com foto.")
          return
        }
        const parsed = galleryValueSchema.safeParse({ slides })
        if (!parsed.success) {
          setError("Dados da galeria inválidos.")
          return
        }
        value = serializeGalleryValue(parsed.data)
      } else if (tipo === "item-list") {
        const items = validItemListDraft(itemListDraft)
        if (items.length === 0) {
          setError("Adicione ao menos um item com imagem.")
          return
        }
        const parsed = itemListValueSchema.safeParse({ items })
        if (!parsed.success) {
          setError("Dados da lista inválidos.")
          return
        }
        value = serializeItemListValue(parsed.data)
      } else if (tipo === "hero-strip") {
        const tiles = validHeroStripDraft(heroStripDraft)
        if (tiles.length === 0) {
          setError("Adicione ao menos uma coluna com imagem.")
          return
        }
        const parsed = heroStripValueSchema.safeParse({ tiles })
        if (!parsed.success) {
          setError("Dados do hero inválidos.")
          return
        }
        value = serializeHeroStripValue(parsed.data)
      } else if (tipo === "catalog") {
        const parsed = catalogValueSchema.safeParse(catalogDraft)
        if (!parsed.success) {
          setError("Dados do catálogo inválidos.")
          return
        }
        value = serializeCatalogValue(parsed.data)
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

      await refreshEditorData(router)
      onSaved()
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

  const currentBgImageSerialized = serializeHeroImageValue(
    parseHeroImageValue(currentValue, HERO_COLUMN_DEFAULTS[0])
  )
  const draftBgImageSerialized = serializeHeroImageValue(bgImageDraft)

  const currentLogoPreset = parseLogoPresetValue(currentValue, DEFAULT_LOGO_PRESET)
  const iconFallback = search.editar
    ? categoryIconFallbackForPath(search.editar)
    : "building-2"
  const currentCategoryIcon = parseCategoryIconValue(currentValue, iconFallback)

  const currentGallerySerialized = serializeGalleryValue(
    parseGalleryValue(currentValue, content)
  )
  const draftGallerySerialized = serializeGalleryValue({
    slides: validGalleryDraft(galleryDraft),
  })

  const currentItemListSerialized = serializeItemListValue(
    parseItemListValue(currentValue, content)
  )
  const draftItemListSerialized = serializeItemListValue({
    items: validItemListDraft(itemListDraft),
  })

  const currentHeroStripSerialized = serializeHeroStripValue(
    parseHeroStripValue(currentValue, content)
  )
  const draftHeroStripSerialized = serializeHeroStripValue({
    tiles: validHeroStripDraft(heroStripDraft),
  })

  const currentCatalogSerialized = serializeCatalogValue(
    parseCatalogValue(currentValue, content)
  )
  const draftCatalogSerialized = serializeCatalogValue(catalogDraft)

  const canSave =
    tipo === "text"
      ? draft !== currentValue
      : tipo === "img"
        ? imageFile !== null
        : tipo === "bg-image"
          ? (imageFile !== null ||
              draftBgImageSerialized !== currentBgImageSerialized) &&
            heroImageValueSchema.safeParse(bgImageDraft).success
          : tipo === "button"
            ? draftButtonSerialized !== currentButtonSerialized &&
              buttonValueSchema.safeParse(buttonDraft).success
            : tipo === "logo-preset"
              ? logoPresetDraft !== currentLogoPreset &&
                logoPresetSchema.safeParse(logoPresetDraft).success
              : tipo === "category-icon"
                ? categoryIconDraft !== currentCategoryIcon &&
                  categoryIconSchema.safeParse(categoryIconDraft).success
                : tipo === "gallery"
                  ? draftGallerySerialized !== currentGallerySerialized &&
                    validGalleryDraft(galleryDraft).length > 0
                  : tipo === "item-list"
                    ? draftItemListSerialized !== currentItemListSerialized &&
                      validItemListDraft(itemListDraft).length > 0
                    : tipo === "hero-strip"
                      ? draftHeroStripSerialized !== currentHeroStripSerialized &&
                        validHeroStripDraft(heroStripDraft).length > 0
                      : tipo === "catalog"
                        ? draftCatalogSerialized !== currentCatalogSerialized &&
                          catalogValueSchema.safeParse(catalogDraft).success
                        : false

  return {
    open,
    field,
    tipo,
    currentValue,
    draft,
    setDraft,
    buttonDraft,
    setButtonDraft,
    bgImageDraft,
    setBgImageDraft,
    logoPresetDraft,
    setLogoPresetDraft,
    categoryIconDraft,
    setCategoryIconDraft,
    galleryDraft,
    setGalleryDraft,
    itemListDraft,
    setItemListDraft,
    heroStripDraft,
    setHeroStripDraft,
    catalogDraft,
    setCatalogDraft,
    pages,
    loading,
    error,
    fileInputRef,
    imageFile,
    imagePreview,
    handleImageChange,
    handleSave,
    canSave,
  }
}

export function groupEditableFields(fields: EditableFields) {
  const textFields: Array<[string, FieldDef]> = []
  const imageFields: Array<[string, FieldDef]> = []
  const sectionFields: Array<[string, FieldDef]> = []
  const logoFields: Array<[string, FieldDef]> = []
  const iconFields: Array<[string, FieldDef]> = []

  for (const [path, field] of Object.entries(fields)) {
    if (field.editTipo === "text" || field.editTipo === "button") {
      textFields.push([path, field])
    } else if (field.editTipo === "img" || field.editTipo === "bg-image") {
      imageFields.push([path, field])
    } else if (
      field.editTipo === "gallery" ||
      field.editTipo === "item-list" ||
      field.editTipo === "hero-strip" ||
      field.editTipo === "catalog" ||
      field.editTipo === "video"
    ) {
      sectionFields.push([path, field])
    } else if (field.editTipo === "logo-preset") {
      logoFields.push([path, field])
    } else if (field.editTipo === "category-icon") {
      iconFields.push([path, field])
    }
  }

  return { textFields, imageFields, sectionFields, logoFields, iconFields }
}
