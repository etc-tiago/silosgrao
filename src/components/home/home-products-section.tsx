import { EditableCategoryIcon } from "@/components/content/editable-category-icon"
import { H2, H3, Span } from "@/components/content"
import {
  homeCardClass,
  homeCardImageWrapClass,
  homeSectionClass,
  homeSectionHeadingClass,
  homeSectionSubheadingClass,
} from "@/components/home/home-section"
import {
  DEFAULT_CATEGORY_ICONS,
  parseCategoryIconValue,
} from "@/lib/content/fields/category-icon"
import type { ProductCategoryId } from "@/lib/content/fields/home-products"
import {
  HOME_PRODUCTS,
  PRODUCT_CATEGORIES,
  productCategoryIconPath,
  productCategoryPath,
  PRODUCTS_SECTION_TITLE_PATH,
  whatsappProductUrl,
} from "@/lib/content/fields/home-products"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

type HomeProductsSectionProps = {
  content: Record<string, string>
  activeCategory?: ProductCategoryId
  onCategoryChange?: (category: ProductCategoryId) => void
  framed?: boolean
  className?: string
}

export function HomeProductsSection({
  content,
  activeCategory: activeCategoryProp,
  onCategoryChange,
  framed = false,
  className,
}: HomeProductsSectionProps) {
  const [internalCategory, setInternalCategory] =
    useState<ProductCategoryId>("silos")
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null)

  const activeCategory = activeCategoryProp ?? internalCategory
  const categoryProducts = HOME_PRODUCTS[activeCategory] ?? []
  const activeCategoryPath = productCategoryPath(activeCategory)

  function setActiveCategory(category: ProductCategoryId) {
    onCategoryChange?.(category)
    if (activeCategoryProp === undefined) {
      setInternalCategory(category)
    }
    setExpandedProduct(null)
  }

  return (
    <section
      id="products"
      className={homeSectionClass({ framed, className })}
    >
      <H2
        path={PRODUCTS_SECTION_TITLE_PATH}
        editTipo="text"
        className={cn(
          homeSectionHeadingClass,
          "mb-8 text-center text-3xl md:text-4xl"
        )}
        value={content[PRODUCTS_SECTION_TITLE_PATH]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PRODUCT_CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id
          const path = productCategoryPath(category.id)
          const iconPath = productCategoryIconPath(category.id)
          const icon = parseCategoryIconValue(
            content[iconPath],
            DEFAULT_CATEGORY_ICONS[category.id]
          )

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex items-center justify-center gap-3 rounded-2xl p-4 text-center text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "border border-border bg-card text-ink hover:border-primary hover:bg-primary/10"
              )}
            >
              <EditableCategoryIcon path={iconPath} icon={icon} />
              <Span path={path} editTipo="text" value={content[path]} />
            </button>
          )
        })}
      </div>

      <H3
        path={activeCategoryPath}
        editTipo="text"
        className={cn(homeSectionSubheadingClass, "mb-12 mt-14 font-bold")}
        value={content[activeCategoryPath]}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {categoryProducts.map((product) => {
          const isExpanded = expandedProduct === product.id

          return (
            <article key={product.id} className={cn(homeCardClass, "p-3")}>
              <div className={cn(homeCardImageWrapClass, "h-64")}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  width={1200}
                  height={800}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h4 className="font-display text-xl text-ink">{product.name}</h4>
                <p className="mt-1 text-sm font-semibold text-primary">
                  Capacidade: {product.capacity}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedProduct(isExpanded ? null : product.id)
                  }
                  className="mt-4 flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-muted"
                >
                  <span>Especificações Técnicas</span>
                  <ChevronDown
                    className={cn(
                      "size-5 transition-transform duration-300",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {isExpanded ? (
                  <div className="mt-4 rounded-2xl border border-border bg-muted/50 p-4">
                    <ul className="space-y-2">
                      {product.specs.map((spec) => (
                        <li
                          key={spec}
                          className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                        >
                          <span className="mt-0.5 font-bold text-primary">
                            •
                          </span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <a
                  href={whatsappProductUrl(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Solicitar Orçamento
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
