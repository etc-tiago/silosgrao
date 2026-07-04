import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  useEditNavigation,
  useEditorMode,
} from "@/components/content/editor-mode"
import type { EditTipo } from "@/lib/content/fields/types"
import type {
  HeroImageObjectFit,
  HeroImageObjectPosition,
} from "@/lib/content/fields/hero-image"
import { cn } from "@/lib/utils"

type EditableImageProps = {
  path: string
  src: string
  alt: string
  editTipo?: EditTipo
  objectFit?: HeroImageObjectFit
  objectPosition?: HeroImageObjectPosition
  className?: string
}

export function EditableImage({
  path,
  src,
  alt,
  editTipo = "img",
  objectFit,
  objectPosition,
  className,
}: EditableImageProps) {
  const { isEditor } = useEditorMode()
  const { editPath, openEdit } = useEditNavigation()
  const selected = editPath === path

  const imgStyle =
    objectFit || objectPosition
      ? {
          objectFit: objectFit ?? "cover",
          objectPosition: objectPosition ?? "center",
        }
      : undefined

  const imgClassName = cn(
    "size-full",
    !objectFit && "object-cover",
    className
  )

  return (
    <>
      <div className="absolute inset-0 z-0">
        <img src={src} alt={alt} className={imgClassName} style={imgStyle} />
      </div>
      {isEditor ? (
        <div
          className={cn(
            "group pointer-events-auto absolute inset-0 z-[2]",
            selected && "ring-2 ring-inset ring-primary/60"
          )}
        >
          <Button
            type="button"
            variant="secondary"
            size="icon-xs"
            className={cn(
              "absolute top-28 right-3 z-[10000] transition-opacity",
              selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            aria-label={`Editar ${path}`}
            onClick={() => openEdit(path, editTipo)}
          >
            <Pencil className="size-3" />
          </Button>
        </div>
      ) : null}
    </>
  )
}
