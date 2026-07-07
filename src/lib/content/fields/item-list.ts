import { createId, moveArrayItem } from "@/lib/content/fields/array-utils"
import {
  contentLinkSchema,
  migrateIntentLink,
  type ContentLink,
} from "@/lib/content/fields/link"
import { siteWhatsappUrlWithText } from "@/lib/site/contact"
import { z } from "zod"

export const itemListActionSchema = z.object({
  label: z.string().min(1),
  link: contentLinkSchema,
})

export const itemListItemSchema = z.object({
  id: z.string().min(1),
  image: z.string().min(1),
  title: z.string(),
  description: z.string(),
  primaryAction: itemListActionSchema.optional(),
  secondaryAction: itemListActionSchema.optional(),
})

export const itemListValueSchema = z.object({
  items: z.array(itemListItemSchema),
})

export type ItemListAction = z.infer<typeof itemListActionSchema>
export type ItemListItem = z.infer<typeof itemListItemSchema>
export type ItemListValue = z.infer<typeof itemListValueSchema>

export const INTENTS_ITEMS_PATH = "intents.items" as const
export const INTENTS_HEADING_LINE1_PATH = "intents.heading.line1" as const
export const INTENTS_HEADING_LINE2_PATH = "intents.heading.line2" as const
export const INTENTS_CTA_PATH = "intents.cta" as const

const DEFAULT_INTENT_ITEMS: ItemListItem[] = [
  {
    id: "intent-1",
    title: "Quero um orçamento",
    description:
      "Solicite uma proposta personalizada para armazenagem, secagem, transporte ou beneficiamento.",
    image: "/demo/stay1.jpg",
    primaryAction: {
      label: "Solicitar orçamento",
      link: {
        kind: "external",
        url: siteWhatsappUrlWithText("Olá! Gostaria de solicitar um orçamento."),
        openInNewTab: true,
      },
    },
  },
  {
    id: "intent-2",
    title: "Quero peças de reposição",
    description:
      "Encontre componentes originais para equipamentos de movimentação, secagem e armazenagem.",
    image: "/demo/stay2.jpg",
    primaryAction: {
      label: "Ver produtos",
      link: { kind: "page", pageSlug: "produtos" },
    },
  },
  {
    id: "intent-3",
    title: "Quero conhecer a empresa",
    description:
      "Conheça nossa história, estrutura e atuação no sudoeste do Paraná desde 2010.",
    image: "/demo/stay3.jpg",
    primaryAction: {
      label: "Sobre nós",
      link: { kind: "page", pageSlug: "sobre" },
    },
  },
  {
    id: "intent-4",
    title: "Quero ver o catálogo de produtos",
    description:
      "Explore silos, secadores, transportadores e soluções completas para o agronegócio.",
    image: "/demo/stay4.jpg",
    primaryAction: {
      label: "Ver catálogo",
      link: { kind: "page", pageSlug: "produtos" },
    },
  },
]

export const DEFAULT_ITEM_LIST_VALUE: ItemListValue = {
  items: DEFAULT_INTENT_ITEMS,
}

export function serializeItemListValue(value: ItemListValue) {
  return JSON.stringify(value)
}

function intentLinkToAction(
  link: ContentLink | undefined,
  label: string
): ItemListAction | undefined {
  if (!link) return undefined
  return { label, link }
}

function migrateLegacyIntents(
  legacyContent: Record<string, string>
): ItemListValue | undefined {
  const items: ItemListItem[] = []

  for (let index = 1; index <= 4; index += 1) {
    const title = legacyContent[`intents.items.${index}.title`]
    const description = legacyContent[`intents.items.${index}.description`]
    const image = legacyContent[`intents.items.${index}.image`]
    const linkRaw = legacyContent[`intents.items.${index}.link`]
    const fallback = DEFAULT_INTENT_ITEMS[index - 1]

    if (!title && !description && !image && !linkRaw && !fallback) continue

    const link = migrateIntentLink(linkRaw)
    items.push({
      id: fallback?.id ?? createId("intent"),
      title: title ?? fallback?.title ?? "",
      description: description ?? fallback?.description ?? "",
      image: image ?? fallback?.image ?? "",
      primaryAction:
        intentLinkToAction(
          link,
          (title ?? fallback?.title ?? "Saiba mais").trim() || "Saiba mais"
        ) ?? fallback?.primaryAction,
    })
  }

  return items.length > 0 ? { items } : undefined
}

export function parseItemListValue(
  raw: string | undefined,
  legacyContent?: Record<string, string>
): ItemListValue {
  if (raw) {
    try {
      const parsed = itemListValueSchema.safeParse(JSON.parse(raw))
      if (parsed.success) return parsed.data
    } catch {
      // fall through
    }
  }

  if (legacyContent) {
    const migrated = migrateLegacyIntents(legacyContent)
    if (migrated) return migrated
  }

  return DEFAULT_ITEM_LIST_VALUE
}

export function createItemListItem(): ItemListItem {
  return {
    id: createId("item"),
    image: "",
    title: "",
    description: "",
  }
}

export { moveArrayItem }
