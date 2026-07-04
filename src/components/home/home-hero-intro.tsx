import { P } from "@/components/content"
import { HERO_INTRO_DEFAULT } from "@/lib/content/fields/home-hero"
import { cn } from "@/lib/utils"

type HomeHeroIntroProps = {
  content: Record<string, string>
  framed?: boolean
}

export function HomeHeroIntro({ content, framed = false }: HomeHeroIntroProps) {
  return (
    <div
      className={cn(
        "bg-surface px-6 py-8 md:px-14 md:py-10",
        framed
          ? "mx-3 mt-3 rounded-[2rem] md:mx-6"
          : "border-t border-border"
      )}
    >
      <P
        path="hero.intro"
        editTipo="text"
        className="text-center text-lg leading-relaxed text-foreground/80 md:text-2xl text-balance font-medium italic"
        value={content["hero.intro"]}
        fallback={HERO_INTRO_DEFAULT}
      />
    </div>
  )
}
