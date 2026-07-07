import { H3 } from "@/components/content"
import { EditorSafeRouteLink } from "@/components/content/content-link"
import { HomeFeaturedProductCard } from "@/components/home/home-featured-product-card"
import {
  homeSectionClass,
  homeSectionSubheadingClass,
} from "@/components/home/home-section"
import {
  PRODUCTS_SECTION_TITLE_DEFAULT,
  PRODUCTS_SECTION_TITLE_PATH,
} from "@/lib/content/fields/home-products"
import type { HomepageCatalogCategory } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

type HomeProductsSectionProps = {
  content: Record<string, string>
  catalog: HomepageCatalogCategory[]
  framed?: boolean
  className?: string
}

export function HomeProductsSection({
  content,
  catalog,
  framed = false,
  className,
}: HomeProductsSectionProps) {
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
        <EditorSafeRouteLink
          to="/produtos"
          className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Ver catálogo completo →
        </EditorSafeRouteLink>
      </div>

      {catalog.length > 0 ? (
        <div className="space-y-16">
          {catalog.map(({ category, products }) => (
            <section
              key={category.id}
              id={`products-${category.slug}`}
              className="scroll-mt-36"
            >
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h3 className={cn(homeSectionSubheadingClass, "font-bold")}>
                  {category.label}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <HomeFeaturedProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </section>
  )
}
