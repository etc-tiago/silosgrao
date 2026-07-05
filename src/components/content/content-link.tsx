import { useEditorMode } from "@/components/content/editor-mode"
import { pageSlugToPath, type ContentLink } from "@/lib/content/fields/link"
import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

type ContentLinkWrapperProps = {
  link?: ContentLink
  className?: string
  children: ReactNode
}

export function ContentLinkWrapper({
  link,
  className,
  children,
}: ContentLinkWrapperProps) {
  const { isEditor } = useEditorMode()

  if (!link || isEditor) {
    return <div className={className}>{children}</div>
  }

  if (link.kind === "external") {
    return (
      <a
        href={link.url}
        className={className}
        {...(link.openInNewTab !== false
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      to={pageSlugToPath(link.pageSlug)}
      hash={link.hash}
      className={className}
    >
      {children}
    </Link>
  )
}

type ContentActionButtonProps = {
  label: string
  link: ContentLink
  className?: string
}

export function ContentActionButton({
  label,
  link,
  className,
}: ContentActionButtonProps) {
  const { isEditor } = useEditorMode()

  if (isEditor) {
    return <span className={className}>{label}</span>
  }

  if (link.kind === "external") {
    return (
      <a
        href={link.url}
        className={className}
        {...(link.openInNewTab !== false
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {label}
      </a>
    )
  }

  return (
    <Link to={pageSlugToPath(link.pageSlug)} hash={link.hash} className={className}>
      {label}
    </Link>
  )
}
