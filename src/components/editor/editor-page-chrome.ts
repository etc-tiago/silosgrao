import type { ContentFieldGroup } from "@/components/editor/content-field-groups"
import type { ContentGroupId } from "@/lib/content/fields/search"
import type { EditTipo } from "@/lib/content/fields/types"
import { useEffect, useState } from "react"

export type EditorPageChromeValue = {
  openContentCategory: (categoria: ContentGroupId) => void
  isContentBrowserOpen: boolean
  activeCategory?: ContentGroupId
  openEdit: (path: string, editTipo: EditTipo) => void
  editPath?: string
  fieldGroups: ContentFieldGroup[]
}

let activeChrome: EditorPageChromeValue | null = null
const listeners = new Set<() => void>()

export function registerEditorPageChrome(value: EditorPageChromeValue | null) {
  activeChrome = value
  for (const listener of listeners) {
    listener()
  }
}

export function useEditorPageChrome() {
  const [, tick] = useState(0)

  useEffect(() => {
    const listener = () => tick((n) => n + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return activeChrome
}
