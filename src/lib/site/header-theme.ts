export type HeaderColorPreset = "green" | "white" | "black" | "yellow"

export const HEADER_COLOR_PRESETS = [
  "green",
  "white",
  "black",
  "yellow",
] as const satisfies readonly HeaderColorPreset[]

export const LOGO_COLORS = {
  green: "#0F8B44",
  white: "#FFFFFF",
  black: "#000000",
  yellow: "#F5B800",
} as const satisfies Record<HeaderColorPreset, string>

export const DEFAULT_HEADER_COLOR_PRESET: HeaderColorPreset = "green"

export const MOBILE_HEADER_PRESET: HeaderColorPreset = "black"

type HeaderThemeBaseTokens = {
  logo: string
  nav: string
  navActive: string
  icon: string
  separator: string
}

export type HeaderThemeTokens = HeaderThemeBaseTokens & {
  logoPresetMobile: HeaderColorPreset
  logoPresetDesktop: HeaderColorPreset
}

const BASE_HEADER_THEME_TOKENS = {
  green: {
    logo: LOGO_COLORS.green,
    nav: "text-[#0F8B44]",
    navActive: "bg-[#0F8B44]/10 outline-[#0F8B44]/15",
    icon: "text-[#0F8B44]",
    separator:
      "bg-linear-to-b from-[#0F8B44]/15 via-[#0F8B44]/8 to-transparent",
  },
  white: {
    logo: LOGO_COLORS.white,
    nav: "text-white",
    navActive: "bg-white/10 outline-white/15",
    icon: "text-white",
    separator: "bg-linear-to-b from-white/15 via-white/8 to-transparent",
  },
  black: {
    logo: LOGO_COLORS.black,
    nav: "text-foreground",
    navActive: "bg-foreground/10 outline-foreground/15",
    icon: "text-foreground",
    separator:
      "bg-linear-to-b from-foreground/15 via-foreground/8 to-transparent",
  },
  yellow: {
    logo: LOGO_COLORS.yellow,
    nav: "text-[#F5B800]",
    navActive: "bg-[#F5B800]/10 outline-[#F5B800]/15",
    icon: "text-[#F5B800]",
    separator:
      "bg-linear-to-b from-[#F5B800]/15 via-[#F5B800]/8 to-transparent",
  },
} as const satisfies Record<HeaderColorPreset, HeaderThemeBaseTokens>

const RESPONSIVE_NAV: Record<HeaderColorPreset, string> = {
  green: "text-foreground md:text-[#0F8B44]",
  white: "text-foreground md:text-white",
  black: "text-foreground",
  yellow: "text-foreground md:text-[#F5B800]",
}

const RESPONSIVE_NAV_ACTIVE: Record<HeaderColorPreset, string> = {
  green:
    "bg-foreground/10 outline-foreground/15 md:bg-[#0F8B44]/10 md:outline-[#0F8B44]/15",
  white:
    "bg-foreground/10 outline-foreground/15 md:bg-white/10 md:outline-white/15",
  black: "bg-foreground/10 outline-foreground/15",
  yellow:
    "bg-foreground/10 outline-foreground/15 md:bg-[#F5B800]/10 md:outline-[#F5B800]/15",
}

const RESPONSIVE_ICON: Record<HeaderColorPreset, string> = {
  green: "text-foreground md:text-[#0F8B44]",
  white: "text-foreground md:text-white",
  black: "text-foreground",
  yellow: "text-foreground md:text-[#F5B800]",
}

const RESPONSIVE_SEPARATOR: Record<HeaderColorPreset, string> = {
  green:
    "bg-linear-to-b from-foreground/15 via-foreground/8 to-transparent md:from-[#0F8B44]/15 md:via-[#0F8B44]/8",
  white:
    "bg-linear-to-b from-foreground/15 via-foreground/8 to-transparent md:from-white/15 md:via-white/8",
  black:
    "bg-linear-to-b from-foreground/15 via-foreground/8 to-transparent",
  yellow:
    "bg-linear-to-b from-foreground/15 via-foreground/8 to-transparent md:from-[#F5B800]/15 md:via-[#F5B800]/8",
}

function buildResponsiveTokens(preset: HeaderColorPreset): HeaderThemeTokens {
  const base = BASE_HEADER_THEME_TOKENS[preset]
  return {
    ...base,
    nav: RESPONSIVE_NAV[preset],
    navActive: RESPONSIVE_NAV_ACTIVE[preset],
    icon: RESPONSIVE_ICON[preset],
    separator: RESPONSIVE_SEPARATOR[preset],
    logoPresetMobile: MOBILE_HEADER_PRESET,
    logoPresetDesktop: preset,
  }
}

export const HEADER_THEME_TOKENS: Record<HeaderColorPreset, HeaderThemeTokens> =
  {
    green: buildResponsiveTokens("green"),
    white: buildResponsiveTokens("white"),
    black: buildResponsiveTokens("black"),
    yellow: buildResponsiveTokens("yellow"),
  }

export function resolveLogoColor(
  preset: HeaderColorPreset = DEFAULT_HEADER_COLOR_PRESET
) {
  return LOGO_COLORS[preset]
}

export function getHeaderThemeTokens(preset: HeaderColorPreset) {
  return HEADER_THEME_TOKENS[preset]
}
