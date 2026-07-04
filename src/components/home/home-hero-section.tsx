import { Span } from "@/components/content"
import { EditableColumnImage } from "@/components/content/editable-column-image"
import {
  HERO_CATEGORY_PATHS,
  HERO_COLUMN_DEFAULTS,
  HERO_COLUMN_PATHS,
} from "@/lib/content/fields/home-hero"

type HomeHeroSectionProps = {
  content: Record<string, string>
}

export function HomeHeroSection({ content }: HomeHeroSectionProps) {
  return (
    <section className="relative min-h-svh w-full overflow-hidden">
      <div className="grid min-h-svh w-full grid-cols-5">
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

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-white">
        <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
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

      <div className="absolute inset-x-0 bottom-2 grid w-full grid-cols-5 md:bottom-6 [&>div]:px-6 [&>div>button]:flex [&>div>button]:w-full [&>div>button]:flex-col [&>div>button]:items-center [&>div>button]:justify-center [&>div>button]:rounded-full [&>div>button]:border [&>div>button]:border-white/30 [&>div>button]:bg-white/15 [&>div>button]:p-2 [&>div>button]:px-1 [&>div>button]:py-2 [&>div>button]:text-center [&>div>button]:text-white [&>div>button]:backdrop-blur-xl [&>div>button]:hover:bg-white/10">
        {HERO_CATEGORY_PATHS.map((path) => (
          <div key={path} className="px-6">
            <button type="button">
              <Span
                path={path}
                editTipo="text"
                className="text-[10px] leading-tight font-bold md:text-sm"
                value={content[path]}
              />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
