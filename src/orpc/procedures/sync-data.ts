import { ORPCError } from "@orpc/server"
import { z } from "zod"
import { exportSiteData } from "@/lib/sync-data/export"
import { importSiteData } from "@/lib/sync-data/import"
import { siteDataBundleSchema } from "@/lib/sync-data/types"
import { adminOnly } from "@/orpc/middleware/auth"

const exportData = adminOnly.handler(async ({ context }) => {
  return exportSiteData(context.db)
})

const importData = adminOnly
  .input(
    z.object({
      bundle: z.unknown(),
      confirmReplace: z.literal(true),
    })
  )
  .handler(async ({ context, input }) => {
    const parsed = siteDataBundleSchema.safeParse(input.bundle)
    if (!parsed.success) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Arquivo de importação inválido.",
      })
    }

    try {
      return await importSiteData(context.db, context.editor!.id, parsed.data)
    } catch (error) {
      throw new ORPCError("BAD_REQUEST", {
        message:
          error instanceof Error
            ? error.message
            : "Falha ao importar dados.",
      })
    }
  })

export const syncDataRouter = {
  export: exportData,
  import: importData,
}
