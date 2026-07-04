import { WhatsApp } from "@/components/icons/whatsapp"
import {
  HOME_INTENT_DEFAULTS,
  type HomeIntent,
} from "@/lib/content/fields/home-intents"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

type HomeIntentsSectionProps = {
  intents?: readonly HomeIntent[]
  framed?: boolean
  className?: string
}

export function HomeIntentsSection({
  intents = HOME_INTENT_DEFAULTS,
  framed = false,
  className,
}: HomeIntentsSectionProps) {
  return (
    <section
      className={cn(
        "bg-surface px-6 py-14 md:px-14 md:py-20",
        framed ? "mx-3 mt-10 rounded-[2rem] md:mx-6" : "mt-10",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="font-display text-5xl text-ink md:text-7xl">
            O que você <span className="font-bold">Busca</span>?
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium"
          >
            <span>Falar conosco</span>
            <WhatsApp className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {intents.map((intent) => (
          <article
            key={intent.title}
            className="group cursor-pointer rounded-3xl bg-card p-3 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={intent.img}
                alt={intent.title}
                loading="lazy"
                width={900}
                height={900}
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex items-end justify-between gap-4 p-4">
              <div>
                <h3 className="font-display text-xl text-ink">{intent.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {intent.description}
                </p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition group-hover:bg-ink group-hover:text-white">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
