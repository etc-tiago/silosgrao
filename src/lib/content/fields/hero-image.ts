import { z } from "zod"

export const heroImageObjectFitEnum = [
  "cover",
  "contain",
  "fill",
  "none",
  "scale-down",
] as const

export type HeroImageObjectFit = (typeof heroImageObjectFitEnum)[number]

export const heroImageObjectPositionEnum = [
  "center",
  "top",
  "bottom",
  "left",
  "right",
  "top left",
  "top right",
  "bottom left",
  "bottom right",
] as const

export type HeroImageObjectPosition =
  (typeof heroImageObjectPositionEnum)[number]

export const heroImageObjectFitOptions: {
  value: HeroImageObjectFit
  label: string
  description: string
}[] = [
  {
    value: "cover",
    label: "Preencher área",
    description:
      "A imagem cobre toda a tela. Ideal para fundos; bordas podem ser cortadas.",
  },
  {
    value: "contain",
    label: "Mostrar inteira",
    description:
      "A imagem aparece completa, sem corte. Podem surgir faixas vazias nas bordas.",
  },
  {
    value: "fill",
    label: "Esticar para caber",
    description:
      "Preenche toda a área esticando a imagem, mesmo que distorça proporções.",
  },
  {
    value: "none",
    label: "Tamanho original",
    description: "Mantém o tamanho real da imagem, sem redimensionar.",
  },
  {
    value: "scale-down",
    label: "Reduzir se for grande",
    description:
      "Usa o tamanho original ou reduz para caber — nunca amplia além do original.",
  },
]

export const heroImageObjectPositionOptions: {
  value: HeroImageObjectPosition
  label: string
}[] = [
  { value: "center", label: "Centro" },
  { value: "top", label: "Parte superior" },
  { value: "bottom", label: "Parte inferior" },
  { value: "left", label: "Lateral esquerda" },
  { value: "right", label: "Lateral direita" },
  { value: "top left", label: "Superior esquerda" },
  { value: "top right", label: "Superior direita" },
  { value: "bottom left", label: "Inferior esquerda" },
  { value: "bottom right", label: "Inferior direita" },
]

export const heroImageValueSchema = z.object({
  url: z.string().min(1),
  objectFit: z.enum(heroImageObjectFitEnum),
  objectPosition: z.enum(heroImageObjectPositionEnum),
})

export type HeroImageValue = z.infer<typeof heroImageValueSchema>

export function heroImageDefault(url: string): HeroImageValue {
  return {
    url,
    objectFit: "cover",
    objectPosition: "center",
  }
}

export function serializeHeroImageValue(value: HeroImageValue) {
  return JSON.stringify(value)
}

function isLegacyImageUrl(raw: string) {
  return (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("/")
  )
}

export function parseHeroImageValue(
  raw: string | undefined,
  fallbackUrl: string
): HeroImageValue {
  const fallback = heroImageDefault(fallbackUrl)
  if (!raw) return fallback

  if (isLegacyImageUrl(raw)) {
    return { ...fallback, url: raw }
  }

  try {
    const parsed = heroImageValueSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : fallback
  } catch {
    return fallback
  }
}
