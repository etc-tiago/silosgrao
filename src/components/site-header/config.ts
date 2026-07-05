import { SITE_WHATSAPP_URL } from "@/lib/site/contact"

export const HEADER_SIDE_WIDTH = "w-36"

export const PRODUTOS_LINK = {
  to: "/produtos" as const,
  label: "Produtos",
}

export const WHATSAPP_LINK = {
  href: SITE_WHATSAPP_URL,
  label: "WhatsApp",
}
