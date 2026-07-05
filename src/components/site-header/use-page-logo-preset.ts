import {
  DEFAULT_LOGO_COLOR_PRESET,
  type LogoColorPreset,
} from "@/components/icons/logo-presets"
import {
  DEFAULT_LOGO_PRESET,
  parseLogoPresetValue,
} from "@/lib/content/fields/logo-preset"

export function usePageLogoPreset(
  content?: Record<string, string>
): LogoColorPreset {
  const raw =
    content?.["header.logoPreset"] ?? content?.["site.header.logoPreset"]

  if (raw) {
    return parseLogoPresetValue(raw, DEFAULT_LOGO_PRESET)
  }

  return DEFAULT_LOGO_COLOR_PRESET
}
