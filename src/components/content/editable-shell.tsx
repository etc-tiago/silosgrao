import { Pencil } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  useEditNavigation,
  useEditorMode,
} from "@/components/content/editor-mode"
import type { EditTipo } from "@/lib/content/fields/types"
import { cn } from "@/lib/utils"

type EditableShellProps = {
  as: "h1" | "h2" | "h3" | "p" | "div"
  path: string
  editTipo: EditTipo
  className?: string
  children: ReactNode
}

export function EditableShell({
  as: Tag,
  path,
  editTipo,
  className,
  children,
}: EditableShellProps) {
  const { isEditor } = useEditorMode()
  const { editPath, openEdit } = useEditNavigation()
  const selected = editPath === path

  return (
    <div
      className={cn(
        "group relative",
        isEditor && "cursor-default",
        selected && "rounded-md bg-primary/5 ring-2 ring-primary/60"
      )}
    >
      <Tag className={className}>{children}</Tag>
      {isEditor ? (
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          className={cn(
            "absolute top-1 right-1 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          aria-label={`Editar ${path}`}
          onClick={() => openEdit(path, editTipo)}
        >
          <Pencil className="size-3" />
        </Button>
      ) : null}
    </div>
  )
}
