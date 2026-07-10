import { Span } from "@/components/content"
import { ContentLinkWrapper } from "@/components/content/content-link"
import { useEditNavigation, useEditorMode } from "@/components/content/editor-mode"
import {
  HERO_TILES_PATH,
  parseHeroStripValue,
} from "@/lib/content/fields/hero-strip"
import { cn } from "@/lib/utils"

type HomeHeroSectionProps = {
  content: Record<string, string>
}

export function HomeHeroSection({ content }: HomeHeroSectionProps) {
  const { isEditor } = useEditorMode()
  const { openEdit } = useEditNavigation()
  const hero = parseHeroStripValue(content[HERO_TILES_PATH], content)
  const tileCount = hero.tiles.length

  return (
    <section className="relative w-full overflow-hidden lg:min-h-svh">
      <div
        className={cn(
          "grid w-full",
          tileCount <= 1 ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-6"
        )}
        {...(isEditor ? { "data-edit-path": HERO_TILES_PATH } : {})}
      >
        {hero.tiles.map((tile) => (
          <div
            key={tile.id}
            className="relative h-[50svh] lg:h-svh lg:min-h-svh"
          >
            <ContentLinkWrapper
              link={tile.link}
              className="absolute inset-0 block"
            >
              <img
                src={tile.image}
                alt={tile.caption || "Hero"}
                className="size-full object-cover"
              />
            </ContentLinkWrapper>

            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/50 via-black/10 to-black/40" />

            <div className="absolute inset-x-0 bottom-2 z-10 px-2 md:bottom-6 md:px-4 lg:px-6">
              <button
                type="button"
                className="flex w-full flex-col items-center justify-center rounded-full border border-white/30 bg-white/15 p-2 px-1 py-2 text-center text-white backdrop-blur-xl hover:bg-white/10"
                onClick={() => {
                  if (isEditor) openEdit(HERO_TILES_PATH, "hero-strip")
                }}
              >
                <span
                  className={cn(
                    "text-[10px] leading-tight font-bold md:text-sm",
                    isEditor && !tile.caption.trim() && "italic opacity-60"
                  )}
                >
                  {isEditor && !tile.caption.trim()
                    ? "Sem texto"
                    : tile.caption}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[25svh] z-10 -translate-y-1/2 px-6 text-center text-white lg:top-1/2">
        <h1 className="font-display text-5xl leading-[0.95] md:text-6xl lg:text-8xl">
          <Span
            path="hero.headline.line1"
            editTipo="text"
            className="font-bold"
            value={content["hero.headline.line1"]}
          />
          <br />
          <Span
            path="hero.headline.line2"
            editTipo="text"
            className="font-light italic"
            value={content["hero.headline.line2"]}
          />
        </h1>
      </div>
    </section>
  )
}
