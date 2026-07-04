import {
  useEditNavigation,
  useEditorMode,
} from "@/components/content/editor-mode"
import { cn } from "@/lib/utils"

type EditableColumnImageProps = {
  path: string
  src: string
  alt: string
  className?: string
}

export function EditableColumnImage({
  path,
  src,
  alt,
  className,
}: EditableColumnImageProps) {
  const { isEditor } = useEditorMode()
  const { editPath } = useEditNavigation()
  const selected = editPath === path

  return (
    <div
      className={cn(
        "relative h-full overflow-hidden",
        isEditor && selected && "ring-2 ring-inset ring-primary/60"
      )}
      data-edit-path={path}
    >
      <img
        src={src}
        alt={alt}
        width={900}
        height={1400}
        className={cn("size-full object-cover", className)}
      />
    </div>
  )
}
