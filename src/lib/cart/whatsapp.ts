import type { CartItem } from "@/lib/cart/types"
import { siteWhatsappUrlWithText } from "@/lib/site/contact"

export function formatCartWhatsAppMessage(items: CartItem[]) {
  const lines = items.map((item) => {
    const category = item.categoryLabel ? ` (${item.categoryLabel})` : ""
    return `• ${item.title}${category} — qtd: ${item.quantity}`
  })

  return [
    "Olá! Gostaria de solicitar orçamento para os seguintes itens:",
    "",
    ...lines,
    "",
    "Aguardo retorno. Obrigado!",
  ].join("\n")
}

export function buildCartWhatsAppUrl(items: CartItem[]) {
  return siteWhatsappUrlWithText(formatCartWhatsAppMessage(items))
}
