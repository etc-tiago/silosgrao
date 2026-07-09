import { discardDevChanges, publishDevChanges } from "@/lib/content/publish"
import { getEditorState, redoChange, undoChange } from "@/lib/content/write"
import { authed } from "@/orpc/middleware/auth"

const undo = authed.handler(async ({ context }) => {
  const changed = await undoChange(context.db, context.editor!.id)
  const editorState = await getEditorState(context.db, context.editor!.id)
  return { changed, editorState }
})

const redo = authed.handler(async ({ context }) => {
  const changed = await redoChange(context.db, context.editor!.id)
  const editorState = await getEditorState(context.db, context.editor!.id)
  return { changed, editorState }
})

const discard = authed.handler(async ({ context }) => {
  const editorState = await getEditorState(context.db, context.editor!.id)

  if (!editorState.hasDevChanges) {
    return { ok: true as const, editorState }
  }

  await discardDevChanges(context.db)

  return {
    ok: true as const,
    editorState: {
      canUndo: false,
      canRedo: false,
      hasDevChanges: false,
    },
  }
})

const publish = authed.handler(async ({ context }) => {
  const editorState = await getEditorState(context.db, context.editor!.id)

  if (!editorState.hasDevChanges) {
    return { ok: true as const, editorState }
  }

  await publishDevChanges(context.db)

  return {
    ok: true as const,
    editorState: {
      canUndo: false,
      canRedo: false,
      hasDevChanges: false,
    },
  }
})

export const editorRouter = {
  undo,
  redo,
  discard,
  publish,
}
