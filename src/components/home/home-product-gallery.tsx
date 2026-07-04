import {
  homeCardImageWrapClass,
  homeSectionClass,
  homeSectionHeadingClass,
  homeSectionLeadClass,
} from "@/components/home/home-section"
import {
  HOME_GALLERY_IMAGES,
  type GalleryImage,
} from "@/lib/content/fields/home-gallery"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useState } from "react"

type HomeProductGalleryProps = {
  images?: readonly GalleryImage[]
  framed?: boolean
  className?: string
}

export function HomeProductGallery({
  images = HOME_GALLERY_IMAGES,
  framed = false,
  className,
}: HomeProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  return (
    <>
      <section className={homeSectionClass({ framed, className })}>
        <h2 className={cn(homeSectionHeadingClass, "text-center")}>
          Veja em <span className="font-bold">Ação</span>
        </h2>
        <p className={cn(homeSectionLeadClass, "mx-auto mt-4 max-w-2xl")}>
          Conheça todos os detalhes dos nossos produtos através de fotos reais
          de nossas obras e instalações
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <button
              key={image.url}
              type="button"
              className="group cursor-pointer overflow-hidden rounded-3xl bg-card p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              onClick={() => setSelectedImage(image)}
            >
              <div className={cn(homeCardImageWrapClass, "h-64")}>
                <img
                  src={image.url}
                  alt={image.alt}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="px-2 py-3">
                <p className="font-display text-sm text-ink">{image.alt}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {image.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedImage ? (
        <div
          className="fixed inset-0 z-10003 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Imagem ampliada"
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white transition-colors hover:text-primary-foreground"
              aria-label="Fechar"
            >
              <X className="size-8" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
