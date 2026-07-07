export function formatPriceCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

export function parsePriceToCents(value: string) {
  const digits = value.replace(/\D/g, "")
  if (!digits) return 0
  return Number.parseInt(digits, 10)
}

export function formatPriceInput(cents: number) {
  return formatPriceCents(cents)
}
