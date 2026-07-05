export const SITE_WHATSAPP_PHONE = "5546991036261"
export const SITE_WHATSAPP_DISPLAY = "46 99103-6261"
export const SITE_PHONE_DISPLAY = "46 2601-1021"
export const SITE_EMAIL = "vendas@silograo.com.br"

export const SITE_ADDRESS_LINES = [
  "Rodovia PR-483, Marrecas, Anexo à linha Olaria",
  "Francisco Beltrão - PR",
] as const

export const SITE_LOCATION = SITE_ADDRESS_LINES.join(", ")

export const SITE_WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${SITE_WHATSAPP_PHONE}`

export const SITE_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6027.6151033034685!2d-53.14262106710795!3d-26.06490390015086!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xdb428ccc25ac7c29!2sSilos%20C%C3%B3rdoba%20Brasil!5e0!3m2!1spt-BR!2sbr!4v1658940547001!5m2!1spt-BR!2sbr"

export function siteWhatsappUrlWithText(text: string) {
  return `${SITE_WHATSAPP_URL}&text=${encodeURIComponent(text)}`
}
