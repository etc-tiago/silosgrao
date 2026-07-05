import { SITE_WHATSAPP_URL } from "@/lib/site/contact"
import type { ButtonValue } from "@/lib/content/fields/button"
import { DEFAULT_ITEM_LIST_VALUE } from "@/lib/content/fields/item-list"

export {
  INTENTS_CTA_PATH,
  INTENTS_HEADING_LINE1_PATH,
  INTENTS_HEADING_LINE2_PATH,
  INTENTS_ITEMS_PATH,
  DEFAULT_ITEM_LIST_VALUE,
  parseItemListValue,
  type ItemListItem,
  type ItemListValue,
} from "@/lib/content/fields/item-list"

export const intentsCtaDefault: ButtonValue = {
  label: "Falar conosco",
  variant: "secondary",
  link: {
    kind: "external",
    url: SITE_WHATSAPP_URL,
    openInNewTab: true,
  },
}

/** @deprecated use DEFAULT_ITEM_LIST_VALUE */
export const HOME_INTENT_DEFAULTS = DEFAULT_ITEM_LIST_VALUE.items.map(
  (item) => ({
    title: item.title,
    description: item.description,
    img: item.image,
    link: item.primaryAction?.link ?? {
      kind: "page" as const,
      pageSlug: "home",
    },
  })
)

/** @deprecated use parseItemListValue */
export const INTENT_IMAGE_DEFAULTS = DEFAULT_ITEM_LIST_VALUE.items.map(
  (item) => item.image
)
