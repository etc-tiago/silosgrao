import { z } from "zod"
import { contentLinkSchema } from "@/lib/content/fields/link"
import { SITE_WHATSAPP_URL } from "@/lib/site/contact"

export const buttonVariantEnum = ["primary", "secondary", "link"] as const
export type ButtonVariant = (typeof buttonVariantEnum)[number]

export const buttonLinkSchema = contentLinkSchema
export type ButtonLink = z.infer<typeof buttonLinkSchema>

export const buttonValueSchema = z.object({
  label: z.string().min(1),
  variant: z.enum(buttonVariantEnum),
  link: buttonLinkSchema,
})

export type ButtonValue = z.infer<typeof buttonValueSchema>

export { pageSlugToPath } from "@/lib/content/fields/link"

export function serializeButtonValue(value: ButtonValue) {
  return JSON.stringify(value)
}

export function parseButtonValue(
  raw: string | undefined,
  fallback: ButtonValue
): ButtonValue {
  if (!raw) return fallback
  try {
    const parsed = buttonValueSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : fallback
  } catch {
    return fallback
  }
}

export const heroCtaPrimaryDefault: ButtonValue = {
  label: "Conheça Nossas Soluções",
  variant: "primary",
  link: { kind: "page", pageSlug: "home", hash: "solucoes" },
}

export const heroCtaWhatsappDefault: ButtonValue = {
  label: "Fale conosco por WhatsApp",
  variant: "secondary",
  link: {
    kind: "external",
    url: SITE_WHATSAPP_URL,
    openInNewTab: true,
  },
}
