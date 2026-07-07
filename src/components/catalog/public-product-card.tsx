import { AddToCartButton } from "@/components/cart/add-to-cart-button"
import { ProductSpecsDetails } from "@/components/catalog/product-specs-details"
import {
  homeCardClass,
  homeCardImageWrapClass,
} from "@/components/home/home-section"
import type { CatalogListItem } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

type PublicProductCardProps = {
  product: CatalogListItem
  className?: string
}

export function PublicProductCard({ product, className }: PublicProductCardProps) {
  return (
    <article className={cn(homeCardClass, "flex h-full flex-col p-3", className)}>
      <div className={cn(homeCardImageWrapClass, "h-64")}>
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          width={1200}
          height={800}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.categoryLabel ? (
          <p className="text-xs font-medium text-muted-foreground">
            {product.categoryLabel}
          </p>
        ) : null}
        <h3 className="font-display text-xl text-ink">{product.title}</h3>
        {product.capacity ? (
          <p className="mt-1 text-sm font-semibold text-primary">
            Capacidade: {product.capacity}
          </p>
        ) : null}
        {product.description ? (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        <ProductSpecsDetails specs={product.specs} className="mt-4" />

        <div className="mt-auto pt-4">
          <AddToCartButton
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              categoryLabel: product.categoryLabel,
            }}
          />
        </div>
      </div>
    </article>
  )
}
