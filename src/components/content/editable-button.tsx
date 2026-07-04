import { Link } from "@tanstack/react-router"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useEditNavigation,
  useEditorMode,
} from "@/components/content/editor-mode"
import type { ButtonValue } from "@/lib/content/fields/button"
import { pageSlugToPath } from "@/lib/content/fields/button"
import { cn } from "@/lib/utils"

type EditableButtonProps = {
  path: string
  value: ButtonValue
}

const baseClasses =
  "inline-block rounded-lg px-8 py-4 text-lg font-bold transition-all duration-300"

const variantClasses: Record<ButtonValue["variant"], string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
  link: "bg-transparent px-0 py-0 text-white underline-offset-4 hover:underline",
}

export function EditableButton({ path, value }: EditableButtonProps) {
  const { isEditor } = useEditorMode()
  const { editPath, openEdit } = useEditNavigation()
  const selected = editPath === path
  const classes = cn(baseClasses, variantClasses[value.variant])

  const content = value.label

  if (isEditor) {
    return (
      <div
        className={cn(
          "group relative inline-block",
          selected && "rounded-md ring-2 ring-primary/60"
        )}
      >
        <span className={cn(classes, "pointer-events-none")}>{content}</span>
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          className={cn(
            "absolute -top-2 -right-2 transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          aria-label={`Editar ${path}`}
          onClick={() => openEdit(path, "button")}
        >
          <Pencil className="size-3" />
        </Button>
      </div>
    )
  }

  if (value.link.kind === "page") {
    return (
      <Link
        to={pageSlugToPath(value.link.pageSlug)}
        hash={value.link.hash}
        className={classes}
      >
        {content}
      </Link>
    )
  }

  return (
    <a
      href={value.link.url}
      className={classes}
      {...(value.link.openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {content}
    </a>
  )
}
