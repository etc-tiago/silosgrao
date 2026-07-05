import { P, Span } from "@/components/content"
import { useEditNavigation, useEditorMode } from "@/components/content/editor-mode"
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox"
import {
  homeCardImageWrapClass,
  homeSectionClass,
  homeSectionHeadingClass,
  homeSectionLeadClass,
} from "@/components/home/home-section"
import {
  GALLERY_HEADING_LINE1_PATH,
  GALLERY_HEADING_LINE2_PATH,
  GALLERY_LEAD_PATH,
  GALLERY_SLIDES_PATH,
  galleryHeadingLine1,
  galleryHeadingLine2,
  galleryLead,
  parseGalleryValue,
} from "@/lib/content/fields/gallery"
import { cn } from "@/lib/utils"
import { useState } from "react"

type HomeProductGalleryProps = {
  content: Record<string, string>
  framed?: boolean
  className?: string
}

export function HomeProductGallery({
  content,
  framed = false,
  className,
}: HomeProductGalleryProps) {
  const { isEditor } = useEditorMode()
  const { openEdit } = useEditNavigation()
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const gallery = parseGalleryValue(content[GALLERY_SLIDES_PATH], content)
  const slides = gallery.slides.filter((slide) => slide.url.trim())

  function handleSlideClick(index: number) {
    if (isEditor) {
      openEdit(GALLERY_SLIDES_PATH, "gallery")
      return
    }
    setViewerIndex(index)
  }

  return (
    <>
      <section className={homeSectionClass({ framed, className })}>
        <div className="flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:text-left">
          <h2 className={cn(homeSectionHeadingClass, "lg:shrink-0")}>
            <Span
              path={GALLERY_HEADING_LINE1_PATH}
              editTipo="text"
              value={galleryHeadingLine1(content[GALLERY_HEADING_LINE1_PATH])}
            />{" "}
            <Span
              path={GALLERY_HEADING_LINE2_PATH}
              editTipo="text"
              className="font-bold"
              value={galleryHeadingLine2(content[GALLERY_HEADING_LINE2_PATH])}
            />
          </h2>
          <P
            path={GALLERY_LEAD_PATH}
            editTipo="text"
            value={galleryLead(content[GALLERY_LEAD_PATH])}
            className={cn(
              homeSectionLeadClass,
              "mx-auto mt-4 max-w-2xl lg:mx-0 lg:mt-0 lg:max-w-md"
            )}
          />
        </div>

        <div
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          {...(isEditor ? { "data-edit-path": GALLERY_SLIDES_PATH } : {})}
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className="group cursor-pointer overflow-hidden rounded-3xl bg-card p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              onClick={() => handleSlideClick(index)}
            >
              <div className={cn(homeCardImageWrapClass, "relative h-64")}>
                <img
                  src={slide.url}
                  alt={slide.caption}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="px-2 py-3">
                <p
                  className={cn(
                    "font-display text-sm text-ink",
                    isEditor && !slide.caption.trim() && "italic opacity-60"
                  )}
                >
                  {isEditor && !slide.caption.trim()
                    ? "Sem texto"
                    : slide.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {viewerIndex !== null ? (
        <GalleryLightbox
          slides={slides}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      ) : null}
    </>
  )
}
