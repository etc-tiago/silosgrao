import { EditableShell } from "@/components/content/editable-shell"
import type { EditTipo } from "@/lib/content/fields/types"
import type { ReactNode } from "react"

type ContentBlockProps = {
  path: string
  editTipo: EditTipo
  className?: string
  value?: string
  children?: ReactNode
}

export function H1(props: ContentBlockProps) {
  return <EditableShell as="h1" {...props} />
}

export function H2(props: ContentBlockProps) {
  return <EditableShell as="h2" {...props} />
}

export function H3(props: ContentBlockProps) {
  return <EditableShell as="h3" {...props} />
}

export function P(props: ContentBlockProps) {
  return <EditableShell as="p" {...props} />
}

export function Div(props: ContentBlockProps) {
  return <EditableShell as="div" {...props} />
}

export function Span(props: ContentBlockProps) {
  return <EditableShell as="span" {...props} />
}

export { EditableButton } from "@/components/content/editable-button"
export { EditableColumnImage } from "@/components/content/editable-column-image"
export { EditableImage } from "@/components/content/editable-image"

export {
  EditorModeProvider,
  EditNavigationProvider,
  useEditorMode,
} from "@/components/content/editor-mode"
