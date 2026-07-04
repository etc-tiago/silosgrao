import { z } from "zod"

export const buttonVariantEnum = ["primary", "secondary", "link"] as const
export type ButtonVariant = (typeof buttonVariantEnum)[number]

export const buttonLinkSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("page"),
    pageSlug: z.string().min(1),
    hash: z.string().optional(),
  }),
  z.object({
    kind: z.literal("external"),
    url: z.string().min(1),
    openInNewTab: z.boolean(),
  }),
])

export const buttonValueSchema = z.object({
  label: z.string().min(1),
  variant: z.enum(buttonVariantEnum),
  link: buttonLinkSchema,
})

export type ButtonValue = z.infer<typeof buttonValueSchema>

export function pageSlugToPath(slug: string) {
  return slug === "home" ? "/" : `/${slug}`
}

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
    url: "https://wa.me/",
    openInNewTab: true,
  },
}
