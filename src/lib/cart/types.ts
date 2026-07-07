import { z } from "zod"

export const cartItemSchema = z.object({
  id: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  categoryLabel: z.string().nullable(),
  quantity: z.number().int().positive(),
})

export const cartSchema = z.array(cartItemSchema)

export type CartItem = z.infer<typeof cartItemSchema>

export type CartProductInput = Pick<
  CartItem,
  "id" | "slug" | "title" | "categoryLabel"
>
