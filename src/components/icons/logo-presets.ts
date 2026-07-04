export type LogoColorPreset = "green" | "white" | "black"

export const LOGO_COLOR_PRESETS = {
  green: "#0F8B44",
  white: "#FFFFFF",
  black: "#000000",
} as const satisfies Record<LogoColorPreset, string>

export const DEFAULT_LOGO_COLOR_PRESET: LogoColorPreset = "green"

export function resolveLogoColor(
  preset: LogoColorPreset = DEFAULT_LOGO_COLOR_PRESET
) {
  return LOGO_COLOR_PRESETS[preset]
}
