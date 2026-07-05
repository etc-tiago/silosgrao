import type { EditableFields } from "@/lib/content/fields/types"
import {
  GALLERY_HEADING_LINE1_PATH,
  GALLERY_HEADING_LINE2_PATH,
  GALLERY_LEAD_PATH,
  GALLERY_SLIDES_PATH,
} from "@/lib/content/fields/gallery"
import {
  HERO_TILES_PATH,
} from "@/lib/content/fields/hero-strip"
import {
  INTENTS_CTA_PATH,
  INTENTS_HEADING_LINE1_PATH,
  INTENTS_HEADING_LINE2_PATH,
  INTENTS_ITEMS_PATH,
} from "@/lib/content/fields/item-list"
import { PRODUCTS_SECTION_TITLE_PATH } from "@/lib/content/fields/home-products"

export const homeEditableFields = {
  "hero.headline.line1": {
    label: "Título — linha 1",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "hero.headline.line2": {
    label: "Título — linha 2",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  "hero.intro": {
    label: "Apresentação",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  [HERO_TILES_PATH]: {
    label: "Hero — colunas",
    editTipo: "hero-strip",
    contentType: "text",
    pageSlug: "home",
  },
  [PRODUCTS_SECTION_TITLE_PATH]: {
    label: "Produtos — título da seção",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  [INTENTS_HEADING_LINE1_PATH]: {
    label: "Intenções — título linha 1",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  [INTENTS_HEADING_LINE2_PATH]: {
    label: "Intenções — título linha 2",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  [INTENTS_CTA_PATH]: {
    label: "Intenções — botão Falar conosco",
    editTipo: "button",
    contentType: "text",
    pageSlug: "home",
  },
  [INTENTS_ITEMS_PATH]: {
    label: "Intenções — cards",
    editTipo: "item-list",
    contentType: "text",
    pageSlug: "home",
  },
  [GALLERY_HEADING_LINE1_PATH]: {
    label: "Galeria — título linha 1",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  [GALLERY_HEADING_LINE2_PATH]: {
    label: "Galeria — título linha 2",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  [GALLERY_LEAD_PATH]: {
    label: "Galeria — texto de apoio",
    editTipo: "text",
    contentType: "text",
    pageSlug: "home",
  },
  [GALLERY_SLIDES_PATH]: {
    label: "Galeria — fotos",
    editTipo: "gallery",
    contentType: "text",
    pageSlug: "home",
  },
} satisfies EditableFields

export const homeContentPaths = Object.keys(homeEditableFields)
