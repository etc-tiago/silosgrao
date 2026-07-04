import { cn } from "@/lib/utils"

type HomeSectionOptions = {
  framed?: boolean
  compact?: boolean
  stacked?: boolean
  className?: string
}

export function homeSectionClass({
  framed = false,
  compact = false,
  stacked = false,
  className,
}: HomeSectionOptions = {}) {
  const framedSpacing = stacked ? "mt-3" : "mt-10"

  return cn(
    "bg-surface",
    compact ? "px-6 py-10 md:px-14 md:py-12" : "px-6 py-14 md:px-14 md:py-20",
    framed ? cn("mx-3 rounded-[2rem] md:mx-6", framedSpacing) : "mt-10",
    className
  )
}

export const homeSectionHeadingClass =
  "font-display text-5xl text-ink md:text-7xl"

export const homeSectionSubheadingClass =
  "font-display text-4xl text-ink md:text-5xl"

export const homeSectionLeadClass =
  "text-center text-lg leading-relaxed text-foreground/80 md:text-xl text-balance"

export const homeCardClass =
  "rounded-3xl bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"

export const homeCardImageWrapClass = "relative overflow-hidden rounded-2xl"
