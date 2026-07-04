import { z } from "zod"
import { editTipoEnum } from "@/lib/content/fields/types"

export const editSearchSchema = z
  .object({
    editar: z.string().optional(),
    tipo: z.enum(editTipoEnum).optional(),
  })
  .refine(
    (search) =>
      (!search.editar && !search.tipo) || (Boolean(search.editar) && Boolean(search.tipo)),
    { message: "editar e tipo devem vir juntos" }
  )

export type EditSearch = z.infer<typeof editSearchSchema>
