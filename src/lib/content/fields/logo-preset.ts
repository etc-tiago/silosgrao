import {
  DEFAULT_HEADER_COLOR_PRESET,
  type HeaderColorPreset,
} from "@/lib/site/header-theme"
import { z } from "zod"

export const logoPresetSchema = z.enum(["green", "white", "black", "yellow"])

export const DEFAULT_LOGO_PRESET = DEFAULT_HEADER_COLOR_PRESET

export const LOGO_PRESET_LABELS: Record<HeaderColorPreset, string> = {
  green: "Verde",
  white: "Branco",
  black: "Preto",
  yellow: "Amarelo",
}

export function parseLogoPresetValue(
  raw: string | undefined,
  fallback: HeaderColorPreset = DEFAULT_LOGO_PRESET
): HeaderColorPreset {
  const parsed = logoPresetSchema.safeParse(raw)
  return parsed.success ? parsed.data : fallback
}
