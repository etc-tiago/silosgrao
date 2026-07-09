import type { Editor } from "@/db/schema"

export function isActiveEditor(editor: Editor): boolean {
  return editor.revokedAt == null
}
