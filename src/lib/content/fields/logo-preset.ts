import {
  DEFAULT_LOGO_COLOR_PRESET,
  type LogoColorPreset,
} from "@/components/icons/logo-presets"
import { z } from "zod"

export const logoPresetSchema = z.enum(["green", "white", "black"])

export const DEFAULT_LOGO_PRESET = DEFAULT_LOGO_COLOR_PRESET

export const LOGO_PRESET_LABELS: Record<LogoColorPreset, string> = {
  green: "Verde",
  white: "Branco",
  black: "Preto",
}

export function parseLogoPresetValue(
  raw: string | undefined,
  fallback: LogoColorPreset = DEFAULT_LOGO_PRESET
): LogoColorPreset {
  const parsed = logoPresetSchema.safeParse(raw)
  return parsed.success ? parsed.data : fallback
}
