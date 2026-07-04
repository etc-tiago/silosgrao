import { Link } from "@tanstack/react-router"
import { useEditorMode } from "@/components/content/editor-mode"
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
  const classes = cn(baseClasses, variantClasses[value.variant])

  const isEmpty = !value.label.trim()
  const content = isEmpty && isEditor ? "Sem texto" : value.label

  if (isEditor) {
    return (
      <span
        className={cn(classes, isEmpty && "italic opacity-60")}
        data-edit-path={path}
      >
        {content}
      </span>
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
