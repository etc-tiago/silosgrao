import { CategoryIcon } from "@/components/icons/category-icon"
import { ProductCard } from "@/components/products/product-card"
import { homeSectionSubheadingClass } from "@/components/home/home-section"
import {
  DEFAULT_CATEGORY_ICONS,
} from "@/lib/content/fields/category-icon"
import type { ProductCategoryId } from "@/lib/content/fields/home-products"
import {
  HOME_PRODUCTS,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_TITLES,
} from "@/lib/content/fields/home-products"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

type ProductsCategorySectionProps = {
  categoryId: ProductCategoryId
  showViewAll?: boolean
  className?: string
}

export function ProductsCategorySection({
  categoryId,
  showViewAll = true,
  className,
}: ProductsCategorySectionProps) {
  const products = HOME_PRODUCTS[categoryId] ?? []
  const title = PRODUCT_CATEGORY_TITLES[categoryId]
  const icon = DEFAULT_CATEGORY_ICONS[categoryId]

  return (
    <section className={cn("scroll-mt-36", className)}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CategoryIcon icon={icon} className="size-8" />
          <h2 className={cn(homeSectionSubheadingClass, "font-bold")}>{title}</h2>
        </div>
        {showViewAll ? (
          <Link
            to="/produtos/$categoria"
            params={{ categoria: categoryId }}
            className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Ver categoria →
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={`${categoryId}-${product.id}`}
            product={product}
            categoryId={categoryId}
          />
        ))}
      </div>
    </section>
  )
}

type ProductsCatalogProps = {
  categoryIds?: ProductCategoryId[]
  showCategoryLinks?: boolean
  className?: string
}

export function ProductsCatalog({
  categoryIds = PRODUCT_CATEGORIES.map((category) => category.id),
  showCategoryLinks = true,
  className,
}: ProductsCatalogProps) {
  return (
    <div className={cn("space-y-16", className)}>
      {categoryIds.map((categoryId) => (
        <ProductsCategorySection
          key={categoryId}
          categoryId={categoryId}
          showViewAll={showCategoryLinks}
        />
      ))}
    </div>
  )
}

export function ProductsCategoryNav({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Categorias de produtos"
      className={cn("flex flex-wrap gap-3", className)}
    >
      {PRODUCT_CATEGORIES.map((category) => (
        <Link
          key={category.id}
          to="/produtos/$categoria"
          params={{ categoria: category.id }}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary hover:bg-primary/10"
        >
          {category.label}
        </Link>
      ))}
    </nav>
  )
}
