import type { CatalogListItem } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"

type CatalogProductCardProps = {
  product: CatalogListItem
  onClick: () => void
  className?: string
}

export function CatalogProductCard({
  product,
  onClick,
  className,
}: CatalogProductCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition-colors hover:border-primary/40 hover:bg-muted/30",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="size-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        {product.categoryLabel ? (
          <span className="text-xs font-medium text-muted-foreground">
            {product.categoryLabel}
          </span>
        ) : null}
        <h3 className="line-clamp-2 font-medium text-foreground">
          {product.title}
        </h3>
        {product.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.description}
          </p>
        ) : null}
      </div>
    </button>
  )
}
