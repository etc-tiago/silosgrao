import { H3 } from "@/components/content"
import { EditableCategoryIcon } from "@/components/content/editable-category-icon"
import { ProductCard } from "@/components/products/product-card"
import {
  homeSectionClass,
  homeSectionSubheadingClass,
} from "@/components/home/home-section"
import {
  DEFAULT_CATEGORY_ICONS,
  parseCategoryIconValue,
} from "@/lib/content/fields/category-icon"
import {
  HOME_PRODUCTS,
  PRODUCT_CATEGORIES,
  productCategoryIconPath,
  productCategoryPath,
  productCategorySectionId,
} from "@/lib/content/fields/home-products"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

type HomeProductsSectionProps = {
  content: Record<string, string>
  framed?: boolean
  className?: string
}

export function HomeProductsSection({
  content,
  framed = false,
  className,
}: HomeProductsSectionProps) {
  return (
    <section
      id="products"
      className={homeSectionClass({ framed, className })}
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Explore nosso catálogo por categoria
        </p>
        <Link
          to="/produtos"
          className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Ver catálogo completo →
        </Link>
      </div>

      <div className="space-y-16">
        {PRODUCT_CATEGORIES.map((category) => {
          const categoryPath = productCategoryPath(category.id)
          const iconPath = productCategoryIconPath(category.id)
          const icon = parseCategoryIconValue(
            content[iconPath],
            DEFAULT_CATEGORY_ICONS[category.id]
          )
          const products = HOME_PRODUCTS[category.id] ?? []

          return (
            <section
              key={category.id}
              id={productCategorySectionId(category.id)}
              className="scroll-mt-36"
            >
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <EditableCategoryIcon path={iconPath} icon={icon} />
                  <H3
                    path={categoryPath}
                    editTipo="text"
                    className={cn(homeSectionSubheadingClass, "font-bold")}
                    value={content[categoryPath]}
                  />
                </div>
                <Link
                  to="/produtos/$categoria"
                  params={{ categoria: category.id }}
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Ver categoria →
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={`${category.id}-${product.id}`}
                    product={product}
                    categoryId={category.id}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </section>
  )
}
