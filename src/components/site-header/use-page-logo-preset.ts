import {
  DEFAULT_LOGO_COLOR_PRESET,
  type LogoColorPreset,
} from "@/components/icons/logo-presets"
import {
  DEFAULT_LOGO_PRESET,
  parseLogoPresetValue,
} from "@/lib/content/fields/logo-preset"
import { useMatches } from "@tanstack/react-router"

type PageLoaderData = {
  content?: Record<string, string>
}

export function usePageLogoPreset(): LogoColorPreset {
  const matches = useMatches()

  for (let i = matches.length - 1; i >= 0; i--) {
    const data = matches[i]?.loaderData as PageLoaderData | undefined
    if (!data?.content) continue

    return parseLogoPresetValue(
      data.content["header.logoPreset"],
      DEFAULT_LOGO_PRESET
    )
  }

  return DEFAULT_LOGO_COLOR_PRESET
}
