import type { HeaderColorPreset } from "@/lib/site/header-theme"

/** Default header theme when a route has no explicit entry. */
export const DEFAULT_ROUTE_HEADER_PRESET: HeaderColorPreset = "green"

/**
 * Per-route header theme (logo + nav links on desktop).
 * Edit here — header is not CMS-editable.
 */
export const ROUTE_HEADER_PRESETS = {
  "/": "white",
  "/produtos": "green",
  "/sobre": "black",
  "/contato": "black",
  "/codigo-etica": "black",
  "/catalogo": "green",
} as const satisfies Record<string, HeaderColorPreset>

export const SITE_FOOTER_ABOUT =
  "O armazenamento que sua produção precisa! Soluções completas em silos, secadores, transportadores e infraestrutura metálica para armazenamento de grãos."

export const SITE_FOOTER_CONTACT_TITLE = "Entre em Contato"
