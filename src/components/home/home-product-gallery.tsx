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
  GALLERY_ITEMS_PATH,
  GALLERY_LEAD_PATH,
  galleryHeadingLine1,
  galleryHeadingLine2,
  galleryLead,
  galleryItemCover,
  galleryPhotoAlt,
  parseGalleryValue,
  type GalleryItem,
} from "@/lib/content/fields/home-gallery"
import { cn } from "@/lib/utils"
import { Images } from "lucide-react"
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
  const [viewerItem, setViewerItem] = useState<GalleryItem | null>(null)
  const gallery = parseGalleryValue(content[GALLERY_ITEMS_PATH])
  const items = gallery.items.filter((item) => item.photos.length > 0)

  function handleItemClick(item: GalleryItem) {
    if (isEditor) {
      openEdit(GALLERY_ITEMS_PATH, "gallery")
      return
    }
    setViewerItem(item)
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
          {...(isEditor ? { "data-edit-path": GALLERY_ITEMS_PATH } : {})}
        >
          {items.map((item) => {
            const cover = item.photos[0]
            if (!cover) return null

            return (
              <button
                key={item.id}
                type="button"
                className="group cursor-pointer overflow-hidden rounded-3xl bg-card p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                onClick={() => handleItemClick(item)}
              >
                <div className={cn(homeCardImageWrapClass, "relative h-64")}>
                  <img
                    src={galleryItemCover(item)}
                    alt={galleryPhotoAlt(cover, item)}
                    loading="lazy"
                    width={1200}
                    height={800}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {item.photos.length > 1 ? (
                    <span className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                      <Images className="size-3.5" />
                      {item.photos.length}
                    </span>
                  ) : null}
                </div>
                <div className="px-2 py-3">
                  <p
                    className={cn(
                      "font-display text-sm text-ink",
                      isEditor && !item.title.trim() && "italic opacity-60"
                    )}
                  >
                    {isEditor && !item.title.trim() ? "Sem texto" : item.title}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs text-muted-foreground",
                      isEditor && !item.category.trim() && "italic opacity-60"
                    )}
                  >
                    {isEditor && !item.category.trim()
                      ? "Sem texto"
                      : item.category}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {viewerItem ? (
        <GalleryLightbox
          item={viewerItem}
          onClose={() => setViewerItem(null)}
        />
      ) : null}
    </>
  )
}
