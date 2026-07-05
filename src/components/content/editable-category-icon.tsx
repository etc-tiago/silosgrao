import { CategoryIcon } from "@/components/icons/category-icon"
import {
  useEditNavigation,
  useEditorMode,
} from "@/components/content/editor-mode"
import type { CategoryIconId } from "@/lib/content/fields/category-icon"
import { cn } from "@/lib/utils"

type EditableCategoryIconProps = {
  path: string
  icon: CategoryIconId
  className?: string
}

export function EditableCategoryIcon({
  path,
  icon,
  className,
}: EditableCategoryIconProps) {
  const { isEditor } = useEditorMode()
  const { editPath } = useEditNavigation()
  const selected = editPath === path

  return (
    <span
      className={cn(
        "inline-flex shrink-0",
        isEditor && selected && "rounded-md outline outline-2 outline-offset-2 outline-primary/60",
        className
      )}
      data-edit-path={path}
    >
      <CategoryIcon icon={icon} />
    </span>
  )
}
