import { Span } from "@/components/content"
import { EditableColumnImage } from "@/components/content/editable-column-image"
import { SiteHeader } from "@/components/site-header"
import {
  HERO_CATEGORY_DEFAULTS,
  HERO_CATEGORY_PATHS,
  HERO_COLUMN_DEFAULTS,
  HERO_COLUMN_PATHS,
  HERO_HEADLINE_DEFAULTS,
} from "@/lib/content/fields/home-hero"
import { cn } from "@/lib/utils"

type HomeHeroSectionProps = {
  content: Record<string, string>
  framed?: boolean
  embeddedHeader?: boolean
}

export function HomeHeroSection({
  content,
  framed = false,
  embeddedHeader = false,
}: HomeHeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        framed ? "mx-3 mt-3 rounded-[2rem] md:mx-6 md:mt-6" : "min-h-svh w-full"
      )}
    >
      <div
        className={cn(
          "grid w-full grid-cols-5",
          framed ? "h-[92vh]" : "min-h-svh"
        )}
      >
        {HERO_COLUMN_PATHS.map((path, i) => (
          <EditableColumnImage
            key={path}
            path={path}
            src={content[path] || HERO_COLUMN_DEFAULTS[i]}
            alt={`Imagem coluna ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/10 to-black/40" />

      {embeddedHeader ? (
        <SiteHeader
          position="embedded"
          hideOnScroll={false}
          className="px-5 py-5 md:px-8 md:py-8"
        />
      ) : null}

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-white">
        <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
          <Span
            path="hero.headline.line1"
            editTipo="text"
            className="font-bold"
            value={content["hero.headline.line1"]}
            fallback={HERO_HEADLINE_DEFAULTS.line1}
          />
          <br />
          <Span
            path="hero.headline.line2"
            editTipo="text"
            className="font-light italic"
            value={content["hero.headline.line2"]}
            fallback={HERO_HEADLINE_DEFAULTS.line2}
          />
        </h1>
      </div>

      <div className="absolute inset-x-0 bottom-2 w-full grid grid-cols-5 md:bottom-6 [&>div]:px-6 [&>div>button]:flex [&>div>button]:w-full [&>div>button]:flex-col [&>div>button]:items-center [&>div>button]:justify-center [&>div>button]:rounded-full [&>div>button]:border [&>div>button]:border-white/30 [&>div>button]:bg-white/15 [&>div>button]:p-2 [&>div>button]:px-1 [&>div>button]:py-2 [&>div>button]:text-center [&>div>button]:text-white [&>div>button]:backdrop-blur-xl [&>div>button]:hover:bg-white/10">
        {HERO_CATEGORY_PATHS.map((path, i) => (
          <div key={path} className="px-6">
            <button type="button">
              <Span
                path={path}
                editTipo="text"
                className="text-[10px] leading-tight font-bold md:text-sm"
                value={content[path]}
                fallback={HERO_CATEGORY_DEFAULTS[i]}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
