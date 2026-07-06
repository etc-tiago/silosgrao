import { editTipoEnum } from "@/lib/content/fields/types"
import { z } from "zod"

export const contentGroupIdEnum = [
  "textos",
  "secoes",
  "logo",
] as const

export type ContentGroupId = (typeof contentGroupIdEnum)[number]

export const editSearchSchema = z
  .object({
    editar: z.string().optional(),
    tipo: z.enum(editTipoEnum).optional(),
    painel: z.enum(["conteudo"]).optional(),
    categoria: z.enum(contentGroupIdEnum).optional(),
  })
  .refine(
    (search) =>
      (!search.editar && !search.tipo) || (Boolean(search.editar) && Boolean(search.tipo)),
    { message: "editar e tipo devem vir juntos" }
  )
  .refine(
    (search) => !search.painel || Boolean(search.categoria),
    { message: "categoria é obrigatória com painel aberto" }
  )

export type EditSearch = z.infer<typeof editSearchSchema>
