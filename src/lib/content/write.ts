import { and, desc, eq, isNotNull, isNull, max, sql } from "drizzle-orm"
import type { Db } from "@/db/client"
import { changeLog, contentEntries } from "@/db/schema"
import type { ContentType } from "@/db/schema"
import { getEditorOverlayValue, getPageBySlug } from "@/lib/content/read"

async function nextSequence(db: Db, editorId: number) {
  const [row] = await db
    .select({ value: max(changeLog.sequence) })
    .from(changeLog)
    .where(eq(changeLog.editorId, editorId))

  return (row?.value ?? 0) + 1
}

async function clearRedoStack(db: Db, editorId: number) {
  await db
    .delete(changeLog)
    .where(and(eq(changeLog.editorId, editorId), isNotNull(changeLog.undoneAt)))
}

export async function setField(
  db: Db,
  editorId: number,
  pageSlug: string,
  path: string,
  type: ContentType,
  value: string
) {
  const page = await getPageBySlug(db, pageSlug)
  if (!page) throw new Error(`Page not found: ${pageSlug}`)

  const beforeValue = await getEditorOverlayValue(db, page.id, path)
  await clearRedoStack(db, editorId)

  await db
    .insert(contentEntries)
    .values({
      pageId: page.id,
      path,
      type,
      value,
      environment: "dev",
      updatedBy: editorId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        contentEntries.pageId,
        contentEntries.path,
        contentEntries.environment,
      ],
      set: {
        value,
        type,
        updatedBy: editorId,
        updatedAt: new Date(),
      },
    })

  await db.insert(changeLog).values({
    editorId,
    sequence: await nextSequence(db, editorId),
    pageId: page.id,
    path,
    operation: "set",
    beforeValue,
    afterValue: value,
  })
}

export async function undoChange(db: Db, editorId: number) {
  const entry = await db.query.changeLog.findFirst({
    where: and(eq(changeLog.editorId, editorId), isNull(changeLog.undoneAt)),
    orderBy: desc(changeLog.sequence),
  })

  if (!entry) return false

  if (entry.operation === "set") {
    if (entry.beforeValue === null) {
      await db
        .delete(contentEntries)
        .where(
          and(
            eq(contentEntries.pageId, entry.pageId),
            eq(contentEntries.path, entry.path),
            eq(contentEntries.environment, "dev")
          )
        )
    } else {
      await db
        .insert(contentEntries)
        .values({
          pageId: entry.pageId,
          path: entry.path,
          type: "text",
          value: entry.beforeValue,
          environment: "dev",
          updatedBy: editorId,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [
            contentEntries.pageId,
            contentEntries.path,
            contentEntries.environment,
          ],
          set: {
            value: entry.beforeValue,
            updatedBy: editorId,
            updatedAt: new Date(),
          },
        })
    }
  }

  await db
    .update(changeLog)
    .set({ undoneAt: new Date() })
    .where(eq(changeLog.id, entry.id))

  return true
}

export async function redoChange(db: Db, editorId: number) {
  const entry = await db.query.changeLog.findFirst({
    where: and(eq(changeLog.editorId, editorId), isNotNull(changeLog.undoneAt)),
    orderBy: desc(changeLog.sequence),
  })

  if (!entry) return false

  if (entry.operation === "set" && entry.afterValue !== null) {
    await db
      .insert(contentEntries)
      .values({
        pageId: entry.pageId,
        path: entry.path,
        type: "text",
        value: entry.afterValue,
        environment: "dev",
        updatedBy: editorId,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          contentEntries.pageId,
          contentEntries.path,
          contentEntries.environment,
        ],
        set: {
          value: entry.afterValue,
          updatedBy: editorId,
          updatedAt: new Date(),
        },
      })
  }

  await db
    .update(changeLog)
    .set({ undoneAt: null })
    .where(eq(changeLog.id, entry.id))

  return true
}

export async function getEditorState(db: Db, editorId: number) {
  const [canUndoRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(changeLog)
    .where(and(eq(changeLog.editorId, editorId), isNull(changeLog.undoneAt)))

  const [canRedoRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(changeLog)
    .where(and(eq(changeLog.editorId, editorId), isNotNull(changeLog.undoneAt)))

  const [devRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(contentEntries)
    .where(eq(contentEntries.environment, "dev"))

  return {
    canUndo: (canUndoRow?.count ?? 0) > 0,
    canRedo: (canRedoRow?.count ?? 0) > 0,
    hasDevChanges: (devRow?.count ?? 0) > 0,
  }
}
