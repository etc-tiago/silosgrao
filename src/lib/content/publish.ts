import { eq } from "drizzle-orm"
import type { Db } from "@/db/client"
import { changeLog, contentEntries } from "@/db/schema"

export async function discardDevChanges(db: Db) {
  await db.delete(contentEntries).where(eq(contentEntries.environment, "dev"))

  await db.delete(changeLog)
}

export async function publishDevChanges(db: Db) {
  const devEntries = await db.query.contentEntries.findMany({
    where: eq(contentEntries.environment, "dev"),
  })

  for (const entry of devEntries) {
    await db
      .insert(contentEntries)
      .values({
        pageId: entry.pageId,
        path: entry.path,
        type: entry.type,
        value: entry.value,
        environment: "prod",
        updatedBy: entry.updatedBy,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          contentEntries.pageId,
          contentEntries.path,
          contentEntries.environment,
        ],
        set: {
          value: entry.value,
          type: entry.type,
          updatedBy: entry.updatedBy,
          updatedAt: new Date(),
        },
      })
  }

  await discardDevChanges(db)
}
