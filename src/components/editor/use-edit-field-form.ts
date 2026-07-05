import {
  buttonValueSchema,
  heroCtaPrimaryDefault,
  heroCtaWhatsappDefault,
  parseButtonValue,
  serializeButtonValue,
  type ButtonValue,
} from "@/lib/content/fields/button"
import { HERO_COLUMN_DEFAULTS } from "@/lib/content/fields/home-hero"
import {
  heroImageValueSchema,
  parseHeroImageValue,
  serializeHeroImageValue,
  type HeroImageValue,
} from "@/lib/content/fields/hero-image"
import {
  DEFAULT_LOGO_PRESET,
  logoPresetSchema,
  parseLogoPresetValue,
} from "@/lib/content/fields/logo-preset"
import {
  categoryIconFallbackForPath,
  categoryIconSchema,
  parseCategoryIconValue,
  type CategoryIconId,
} from "@/lib/content/fields/category-icon"
import type { LogoColorPreset } from "@/components/icons/logo-presets"
import type { EditSearch } from "@/lib/content/fields/search"
import type { EditableFields, FieldDef } from "@/lib/content/fields/types"
import { refreshEditorData } from "@/lib/content/refresh-editor-data"
import { orpc } from "@/orpc/browser-client"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { fileToBase64, type PageOption } from "@/components/editor/edit-field-editors"

function buttonFallbackForPath(path: string): ButtonValue {
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
  const logoFields: Array<[string, FieldDef]> = []
  const iconFields: Array<[string, FieldDef]> = []

  for (const [path, field] of Object.entries(fields)) {
    if (field.editTipo === "text" || field.editTipo === "button") {
      textFields.push([path, field])
    } else if (field.editTipo === "img" || field.editTipo === "bg-image") {
      imageFields.push([path, field])
    } else if (field.editTipo === "logo-preset") {
      logoFields.push([path, field])
    } else if (field.editTipo === "category-icon") {
      iconFields.push([path, field])
    }
  }

  return { textFields, imageFields, logoFields, iconFields }
}
