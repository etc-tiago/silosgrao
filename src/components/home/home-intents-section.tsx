import { EditableButton, Span } from "@/components/content"
import {
  ContentActionButton,
  ContentLinkWrapper,
} from "@/components/content/content-link"
import { useEditNavigation, useEditorMode } from "@/components/content/editor-mode"
import {
  homeCardClass,
  homeCardImageWrapClass,
  homeSectionClass,
  homeSectionHeadingClass,
} from "@/components/home/home-section"
import { WhatsApp } from "@/components/icons/whatsapp"
import { parseButtonValue } from "@/lib/content/fields/button"
import {
  INTENTS_CTA_PATH,
  INTENTS_HEADING_LINE1_PATH,
  INTENTS_HEADING_LINE2_PATH,
  INTENTS_ITEMS_PATH,
  intentsCtaDefault,
  parseItemListValue,
} from "@/lib/content/fields/home-intents"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

type HomeIntentsSectionProps = {
  content: Record<string, string>
  framed?: boolean
  className?: string
}

type IntentCardProps = {
  item: ReturnType<typeof parseItemListValue>["items"][number]
}

function IntentCard({ item }: IntentCardProps) {
  const cardLink = item.primaryAction?.link

  return (
    <ContentLinkWrapper
      link={cardLink}
      className={cn(homeCardClass, "group block p-3 transition-colors")}
    >
      <div className={homeCardImageWrapClass}>
        <img
          src={item.image}
          alt={item.title}
          className="size-full object-cover"
        />
      </div>
      <div className="flex items-end justify-between gap-4 p-4">
        <div>
          <h3 className="font-display text-xl text-ink">{item.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {item.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.primaryAction ? (
              <ContentActionButton
                label={item.primaryAction.label}
                link={item.primaryAction.link}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium"
              />
            ) : null}
            {item.secondaryAction ? (
              <ContentActionButton
                label={item.secondaryAction.label}
                link={item.secondaryAction.link}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium"
              />
            ) : null}
          </div>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition group-hover:bg-ink group-hover:text-white">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </ContentLinkWrapper>
  )
}

export function HomeIntentsSection({
  content,
  framed = false,
  className,
}: HomeIntentsSectionProps) {
  const { isEditor } = useEditorMode()
  const { openEdit } = useEditNavigation()
  const items = parseItemListValue(content[INTENTS_ITEMS_PATH], content).items

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
        <EditableButton
          path={INTENTS_CTA_PATH}
          value={parseButtonValue(content[INTENTS_CTA_PATH], intentsCtaDefault)}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium"
        >
          <WhatsApp className="size-4" />
        </EditableButton>
      </div>

      <div
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        {...(isEditor ? { "data-edit-path": INTENTS_ITEMS_PATH } : {})}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (isEditor) openEdit(INTENTS_ITEMS_PATH, "item-list")
            }}
          >
            <IntentCard item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
