import { H3 } from "@/components/content"
import { CategoryIcon } from "@/components/icons/category-icon"
import { ProductCard } from "@/components/products/product-card"
import {
  homeSectionClass,
  homeSectionSubheadingClass,
} from "@/components/home/home-section"
import {
  PRODUTOS_CATALOG_PATH,
  parseCatalogValue,
} from "@/lib/content/fields/catalog"
import {
  PRODUCTS_SECTION_TITLE_DEFAULT,
  PRODUCTS_SECTION_TITLE_PATH,
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
  const catalog = parseCatalogValue(content[PRODUTOS_CATALOG_PATH], content)

  return (
    <section
      id="products"
      className={homeSectionClass({ framed, className })}
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <H3
          path={PRODUCTS_SECTION_TITLE_PATH}
          editTipo="text"
          className={cn(homeSectionSubheadingClass, "font-bold")}
          value={
            content[PRODUCTS_SECTION_TITLE_PATH]?.trim() ||
            PRODUCTS_SECTION_TITLE_DEFAULT
          }
        />
        <Link
          to="/produtos"
          className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Ver catálogo completo →
        </Link>
      </div>

      <div className="space-y-16">
        {catalog.categories.map((category) => (
          <section
            key={category.id}
            id={productCategorySectionId(category.id)}
            className="scroll-mt-36"
          >
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CategoryIcon icon={category.icon} className="size-6" />
                <h3 className={cn(homeSectionSubheadingClass, "font-bold")}>
                  {category.label}
                </h3>
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
              {category.products.map((product) => (
                <ProductCard
                  key={`${category.id}-${product.id}`}
                  product={product}
                  categoryId={category.id}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
