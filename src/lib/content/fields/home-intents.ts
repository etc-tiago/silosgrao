import { SITE_WHATSAPP_URL } from "@/lib/site/contact"
import { z } from "zod"

export const intentLinkSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("route"),
    to: z.enum(["/", "/produtos"]),
    hash: z.string().optional(),
  }),
  z.object({
    kind: z.literal("external"),
    href: z.string().min(1),
  }),
])

export type HomeIntentLink = z.infer<typeof intentLinkSchema>

export type HomeIntent = {
  title: string
  description: string
  img: string
  link: HomeIntentLink
}

export const INTENT_INDICES = [1, 2, 3, 4] as const

export const INTENTS_HEADING_LINE1_PATH = "intents.heading.line1" as const
export const INTENTS_HEADING_LINE2_PATH = "intents.heading.line2" as const
export const INTENTS_CTA_PATH = "intents.cta" as const

export function intentItemPath(
  index: number,
  field: "title" | "description" | "image" | "link"
) {
  return `intents.items.${index}.${field}` as const
}

export const HOME_INTENT_DEFAULTS = [
  {
    title: "Quero um orçamento",
    description:
      "Solicite uma proposta personalizada para armazenagem, secagem, transporte ou beneficiamento.",
    img: "/demo/stay1.jpg",
    link: {
      kind: "external",
      href: `${SITE_WHATSAPP_URL}?text=${encodeURIComponent("Olá! Gostaria de solicitar um orçamento.")}`,
    },
  },
  {
    title: "Quero peças de reposição",
    description:
      "Encontre componentes originais para equipamentos de movimentação, secagem e armazenagem.",
    img: "/demo/stay2.jpg",
    link: { kind: "route", to: "/produtos" },
  },
  {
    title: "Quero conhecer a empresa",
    description:
      "Conheça nossa história, estrutura e atuação no sudoeste do Paraná desde 2010.",
    img: "/demo/stay3.jpg",
    link: { kind: "route", to: "/", hash: "sobre" },
  },
  {
    title: "Quero ver o catálogo de produtos",
    description:
      "Explore silos, secadores, transportadores e soluções completas para o agronegócio.",
    img: "/demo/stay4.jpg",
    link: { kind: "route", to: "/produtos" },
  },
] as const satisfies readonly HomeIntent[]

export const INTENT_IMAGE_DEFAULTS = HOME_INTENT_DEFAULTS.map(
  (intent) => intent.img
)

export function serializeIntentLinkValue(value: HomeIntentLink) {
  return JSON.stringify(value)
}

export function parseIntentLinkValue(
  raw: string | undefined,
  fallback: HomeIntentLink
): HomeIntentLink {
  if (!raw) return fallback
  try {
    const parsed = intentLinkSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : fallback
  } catch {
    return fallback
  }
}

export function intentLinkFallbackForPath(path: string): HomeIntentLink {
  const match = path.match(/^intents\.items\.(\d+)\.link$/)
  if (!match) {
    return { kind: "route", to: "/" }
  }

  const index = Number(match[1]) - 1
  return HOME_INTENT_DEFAULTS[index]?.link ?? { kind: "route", to: "/" }
}

export const intentsCtaDefault = {
  label: "Falar conosco",
  variant: "secondary" as const,
  link: {
    kind: "external" as const,
    url: SITE_WHATSAPP_URL,
    openInNewTab: true,
  },
}
