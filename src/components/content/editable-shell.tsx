import type { ReactNode } from "react"
import {
  useEditNavigation,
  useEditorMode,
} from "@/components/content/editor-mode"
import type { EditTipo } from "@/lib/content/fields/types"
import { cn } from "@/lib/utils"

const EDITOR_EMPTY_LABEL = "Sem texto"

type EditableShellProps = {
  as: "h1" | "h2" | "h3" | "p" | "div" | "span"
  path: string
  editTipo: EditTipo
  className?: string
  value?: string
  fallback?: string
  children?: ReactNode
}

function isEmptyText(value: string | undefined): boolean {
  return !value?.trim()
}

export function EditableShell({
  as: Tag,
  path,
  className,
  value,
  fallback,
  children,
}: EditableShellProps) {
  const { isEditor } = useEditorMode()
  const { editPath } = useEditNavigation()
  const selected = editPath === path

  const cmsValue =
    value ?? (typeof children === "string" ? children : undefined)
  const isEmpty = isEmptyText(cmsValue)

  const displayContent =
    isEditor && isEmpty ? (
      <span className="italic opacity-60">{EDITOR_EMPTY_LABEL}</span>
    ) : isEmpty && fallback != null ? (
      fallback
    ) : (
      (cmsValue ?? children)
    )

  return (
    <Tag
      className={cn(
        className,
        isEditor && selected && "outline outline-2 outline-offset-2 outline-primary/60"
      )}
      data-edit-path={path}
    >
      {displayContent}
    </Tag>
  )
}
