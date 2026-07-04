import { createContext, useContext, useMemo, type ReactNode } from "react"
import type { ContentReadMode } from "@/lib/content/read"
import type { EditTipo } from "@/lib/content/fields/types"

type EditorModeContextValue = {
  mode: ContentReadMode
  isEditor: boolean
}

const EditorModeContext = createContext<EditorModeContextValue>({
  mode: "public",
  isEditor: false,
})

export function EditorModeProvider({
  mode,
  children,
}: {
  mode: ContentReadMode
  children: ReactNode
}) {
  const value = useMemo(
    () => ({ mode, isEditor: mode === "editor" }),
    [mode]
  )

  return (
    <EditorModeContext.Provider value={value}>
      {children}
    </EditorModeContext.Provider>
  )
}

export function useEditorMode() {
  return useContext(EditorModeContext)
}

type EditNavigationContextValue = {
  editPath?: string
  openEdit: (path: string, editTipo: EditTipo) => void
  closeEdit: () => void
}

const EditNavigationContext = createContext<EditNavigationContextValue | null>(
  null
)

export function EditNavigationProvider({
  editPath,
  openEdit,
  closeEdit,
  children,
}: EditNavigationContextValue & { children: ReactNode }) {
  const value = useMemo(
    () => ({ editPath, openEdit, closeEdit }),
    [editPath, openEdit, closeEdit]
  )

  return (
    <EditNavigationContext.Provider value={value}>
      {children}
    </EditNavigationContext.Provider>
  )
}

export function useEditNavigation() {
  const context = useContext(EditNavigationContext)
  if (!context) {
    throw new Error("useEditNavigation must be used within EditNavigationProvider")
  }
  return context
}
