import {
  DEFAULT_ROUTE_HEADER_PRESET,
  ROUTE_HEADER_PRESETS,
} from "@/lib/site/site-chrome"
import type { HeaderColorPreset } from "@/lib/site/header-theme"

export function resolveDesktopHeaderPreset(
  pathname: string
): HeaderColorPreset {
  const preset =
    ROUTE_HEADER_PRESETS[pathname as keyof typeof ROUTE_HEADER_PRESETS]
  return preset ?? DEFAULT_ROUTE_HEADER_PRESET
}
