import { H3, P, Span } from "@/components/content"
import { EditableColumnImage } from "@/components/content/editable-column-image"
import { useEditorMode } from "@/components/content/editor-mode"
import {
  homeCardClass,
  homeCardImageWrapClass,
  homeSectionClass,
  homeSectionHeadingClass,
} from "@/components/home/home-section"
import { WhatsApp } from "@/components/icons/whatsapp"
import { parseButtonValue } from "@/lib/content/fields/button"
import {
  INTENT_IMAGE_DEFAULTS,
  INTENT_INDICES,
  INTENTS_CTA_PATH,
  INTENTS_HEADING_LINE1_PATH,
  INTENTS_HEADING_LINE2_PATH,
  intentItemPath,
  intentLinkFallbackForPath,
  intentsCtaDefault,
  parseIntentLinkValue,
  type HomeIntentLink,
} from "@/lib/content/fields/home-intents"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import { Link } from "@tanstack/react-router"

type HomeIntentsSectionProps = {
  content: Record<string, string>
  framed?: boolean
  className?: string
}

function EditableIntentCta({
  content,
}: {
  content: Record<string, string>
}) {
  const { isEditor } = useEditorMode()
  const value = parseButtonValue(content[INTENTS_CTA_PATH], intentsCtaDefault)
  const isEmpty = !value.label.trim()
  const label = isEmpty && isEditor ? "Sem texto" : value.label
  const className =
    "flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium"

  if (isEditor) {
    return (
      <span
        data-edit-path={INTENTS_CTA_PATH}
        className={cn(className, isEmpty && "italic opacity-60")}
      >
        <span>{label}</span>
        <WhatsApp className="size-4" />
      </span>
    )
  }

  if (value.link.kind === "page") {
    const to =
      value.link.pageSlug === "home"
        ? "/"
        : value.link.pageSlug === "produtos"
          ? "/produtos"
          : "/"

    return (
      <Link to={to} hash={value.link.hash} className={className}>
        <span>{label}</span>
        <WhatsApp className="size-4" />
      </Link>
    )
  }

  return (
    <a
      href={value.link.url}
      className={className}
      {...(value.link.openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span>{label}</span>
      <WhatsApp className="size-4" />
    </a>
  )
}

function IntentCardLink({
  link,
  className,
  children,
}: {
  link: HomeIntentLink
  className: string
  children: React.ReactNode
}) {
  const { isEditor } = useEditorMode()

  if (isEditor) {
    return <div className={className}>{children}</div>
  }

  if (link.kind === "external") {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to={link.to} hash={link.hash} className={className}>
      {children}
    </Link>
  )
}

type IntentCardProps = {
  index: number
  content: Record<string, string>
}

function IntentCard({ index, content }: IntentCardProps) {
  const titlePath = intentItemPath(index, "title")
  const descriptionPath = intentItemPath(index, "description")
  const imagePath = intentItemPath(index, "image")
  const linkPath = intentItemPath(index, "link")
  const link = parseIntentLinkValue(
    content[linkPath],
    intentLinkFallbackForPath(linkPath)
  )
  const imageSrc =
    content[imagePath] || INTENT_IMAGE_DEFAULTS[index - 1] || ""

  return (
    <IntentCardLink
      link={link}
      className={cn(homeCardClass, "group block p-3 transition-colors")}
    >
      <div className={homeCardImageWrapClass}>
        <EditableColumnImage
          path={imagePath}
          src={imageSrc}
          alt={content[titlePath]?.trim() || `Intenção ${index}`}
        />
      </div>
      <div className="flex items-end justify-between gap-4 p-4">
        <div>
          <H3
            path={titlePath}
            editTipo="text"
            className="font-display text-xl text-ink"
            value={content[titlePath]}
          />
          <P
            path={descriptionPath}
            editTipo="text"
            className="mt-1 text-xs leading-relaxed text-muted-foreground"
            value={content[descriptionPath]}
          />
        </div>
        <span
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition group-hover:bg-ink group-hover:text-white"
          data-edit-path={linkPath}
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </IntentCardLink>
  )
}

export function HomeIntentsSection({
  content,
  framed = false,
  className,
}: HomeIntentsSectionProps) {
  return (
    <section className={homeSectionClass({ framed, className })}>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <h2 className={homeSectionHeadingClass}>
          <Span
            path={INTENTS_HEADING_LINE1_PATH}
            editTipo="text"
            value={content[INTENTS_HEADING_LINE1_PATH]}
          />{" "}
          <Span
            path={INTENTS_HEADING_LINE2_PATH}
            editTipo="text"
            className="font-bold"
            value={content[INTENTS_HEADING_LINE2_PATH]}
          />
          ?
        </h2>
        <EditableIntentCta content={content} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {INTENT_INDICES.map((index) => (
          <IntentCard key={index} index={index} content={content} />
        ))}
      </div>
    </section>
  )
}
