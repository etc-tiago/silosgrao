import { PublicProductCard } from "@/components/catalog/public-product-card"
import type { HomepageCatalogCategory } from "@/lib/catalog/types"

type HomeFeaturedProductCardProps = {
  product: HomepageCatalogCategory["products"][number]
  className?: string
}

export function HomeFeaturedProductCard({
  product,
  className,
}: HomeFeaturedProductCardProps) {
  return <PublicProductCard product={product} className={className} />
}
