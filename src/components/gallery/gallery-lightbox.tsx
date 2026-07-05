import type { GalleryItem } from "@/lib/content/fields/home-gallery"
import { galleryPhotoAlt } from "@/lib/content/fields/home-gallery"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type GalleryLightboxProps = {
  item: GalleryItem
  onClose: () => void
}

export function GalleryLightbox({ item, onClose }: GalleryLightboxProps) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const photos = item.photos
  const hasMultiple = photos.length > 1
  const currentPhoto = photos[photoIndex]

  const goPrev = useCallback(() => {
    setPhotoIndex((index) => (index === 0 ? photos.length - 1 : index - 1))
  }, [photos.length])

  const goNext = useCallback(() => {
    setPhotoIndex((index) => (index === photos.length - 1 ? 0 : index + 1))
  }, [photos.length])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft") goPrev()
      if (event.key === "ArrowRight") goNext()
    }

    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [goNext, goPrev, onClose])

  if (!currentPhoto) return null

  return (
    <div
      className="fixed inset-0 z-10003 flex items-end justify-center bg-black/85 p-0 sm:items-center sm:p-4 md:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "relative flex w-full max-h-[92dvh] flex-col overflow-hidden bg-card",
          "rounded-t-[2rem] sm:max-w-2xl sm:rounded-[2rem] md:max-w-4xl lg:max-w-5xl"
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.title || "Galeria de fotos"}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 md:px-6">
          <div className="min-w-0 pr-4">
            <p className="truncate font-display text-base text-ink md:text-lg">
              {item.title || "Galeria"}
            </p>
            {item.category ? (
              <p className="truncate text-xs text-muted-foreground md:text-sm">
                {item.category}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative min-h-0 flex-1 bg-muted/20">
          <img
            src={currentPhoto.url}
            alt={galleryPhotoAlt(currentPhoto, item)}
            width={1200}
            height={800}
            className="mx-auto max-h-[55dvh] w-full object-contain sm:max-h-[60dvh] md:max-h-[65dvh]"
          />

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute top-1/2 left-2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/95 shadow-md transition-colors hover:bg-card md:left-4 md:size-11"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/95 shadow-md transition-colors hover:bg-card md:right-4 md:size-11"
                aria-label="Próxima foto"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
        </div>

        {hasMultiple ? (
          <div className="border-t border-border px-4 py-3 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-muted-foreground">
                {photoIndex + 1} / {photos.length}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.map((photo, index) => (
                  <button
                    key={`${photo.url}-${index}`}
                    type="button"
                    onClick={() => setPhotoIndex(index)}
                    className={cn(
                      "size-14 shrink-0 overflow-hidden rounded-xl border-2 transition-colors md:size-16",
                      index === photoIndex
                        ? "border-primary"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                    aria-label={`Ver foto ${index + 1}`}
                    aria-current={index === photoIndex}
                  >
                    <img
                      src={photo.url}
                      alt=""
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
