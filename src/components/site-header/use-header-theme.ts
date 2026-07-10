import { useRouterState } from "@tanstack/react-router"
import {
  MOBILE_HEADER_PRESET,
  type HeaderColorPreset,
  type HeaderThemeTokens,
  getHeaderThemeTokens,
} from "@/lib/site/header-theme"
import { resolveDesktopHeaderPreset } from "@/lib/site/resolve-header-theme"

export type ResolvedHeaderTheme = {
  desktopPreset: HeaderColorPreset
  /** Preset do sheet mobile (fundo claro); o header usa `desktopTokens`. */
  mobilePreset: HeaderColorPreset
  desktopTokens: HeaderThemeTokens
  mobileTokens: HeaderThemeTokens
}

export function resolveHeaderTheme(pathname: string): ResolvedHeaderTheme {
  const desktopPreset = resolveDesktopHeaderPreset(pathname)
  const mobilePreset = MOBILE_HEADER_PRESET

  return {
    desktopPreset,
    mobilePreset,
    desktopTokens: getHeaderThemeTokens(desktopPreset),
    mobileTokens: getHeaderThemeTokens(mobilePreset),
  }
}

export function useHeaderTheme(): ResolvedHeaderTheme {
  const { location } = useRouterState()
  return resolveHeaderTheme(location.pathname)
}
