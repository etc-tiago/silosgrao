import { H1, P } from "@/components/content"
import { EditableButton } from "@/components/content/editable-button"
import { EditableImage } from "@/components/content/editable-image"
import {
  heroCtaPrimaryDefault,
  heroCtaWhatsappDefault,
  parseButtonValue,
} from "@/lib/content/fields/button"
import { HERO_IMAGE_DEFAULT } from "@/lib/content/fields/home"
import { parseHeroImageValue } from "@/lib/content/fields/hero-image"

type HeroSectionProps = {
  content: Record<string, string>
}

export function HeroSection({ content }: HeroSectionProps) {
  const heroImage = parseHeroImageValue(content["hero.image"], HERO_IMAGE_DEFAULT)
  const ctaPrimary = parseButtonValue(
    content["hero.cta.primary"],
    heroCtaPrimaryDefault
  )
  const ctaWhatsapp = parseButtonValue(
    content["hero.cta.whatsapp"],
    heroCtaWhatsappDefault
  )

  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
      <EditableImage
        path="hero.image"
        editTipo="bg-image"
        src={heroImage.url}
        objectFit={heroImage.objectFit}
        objectPosition={heroImage.objectPosition}
        alt="Silos Grãos - Silo de armazenamento industrial"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-black/55"
        aria-hidden
      />

      <div className="relative z-10 max-w-3xl px-4 text-center text-white">
        <div className="mb-6">
          <H1
            path="hero.title"
            editTipo="text"
            className="mb-4 text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-6xl"
          >
            {content["hero.title"] ??
              "O armazenamento que sua produção precisa!"}
          </H1>
          <P
            path="hero.subtitle"
            editTipo="text"
            className="mb-8 text-lg text-balance text-white/90 md:text-xl"
          >
            {content["hero.subtitle"] ??
              "Silos, secadores, transportadores e infraestrutura metálica de qualidade. Soluções completas para armazenamento de grãos em diversas escalas."}
          </P>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <EditableButton path="hero.cta.primary" value={ctaPrimary} />
          <EditableButton path="hero.cta.whatsapp" value={ctaWhatsapp} />
        </div>
      </div>
    </section>
  )
}
