import {
  SOBRE_INTRO_P1_PATH,
  SOBRE_INTRO_P2_PATH,
  SOBRE_MISSION_QUOTE_PATH,
  SOBRE_PRINCIPLES_PATH,
} from "@/lib/content/fields/sobre"
import type { EditableFields } from "@/lib/content/fields/types"

export const sobreEditableFields = {
  [SOBRE_INTRO_P1_PATH]: {
    label: "Sobre — introdução (parágrafo 1)",
    editTipo: "text",
    contentType: "text",
    pageSlug: "sobre",
  },
  [SOBRE_INTRO_P2_PATH]: {
    label: "Sobre — introdução (parágrafo 2)",
    editTipo: "text",
    contentType: "text",
    pageSlug: "sobre",
  },
  [SOBRE_MISSION_QUOTE_PATH]: {
    label: "Sobre — citação da missão",
    editTipo: "text",
    contentType: "text",
    pageSlug: "sobre",
  },
  [SOBRE_PRINCIPLES_PATH]: {
    label: "Sobre — princípios (um por linha)",
    editTipo: "text",
    contentType: "text",
    pageSlug: "sobre",
  },
} satisfies EditableFields

export const sobreContentPaths = Object.keys(sobreEditableFields)
