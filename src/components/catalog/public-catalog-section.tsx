import { PublicProductCard } from "@/components/catalog/public-product-card"
import { homeSectionSubheadingClass } from "@/components/home/home-section"
import type { HomepageCatalogCategory } from "@/lib/catalog/types"
import { cn } from "@/lib/utils"

type PublicCatalogSectionProps = {
  catalog: HomepageCatalogCategory[]
  className?: string
}

export function PublicCatalogSection({
  catalog,
  className,
}: PublicCatalogSectionProps) {
  if (catalog.length === 0) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-dashed bg-muted/20 p-8 text-center",
          className
        )}
      >
        <p className="font-medium">Catálogo em atualização</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Em breve novos produtos estarão disponíveis para orçamento.
        </p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-16", className)}>
      {catalog.map(({ category, products }) => (
        <section key={category.id} id={`catalog-${category.slug}`}>
          <h2 className={cn(homeSectionSubheadingClass, "mb-8 font-bold")}>
            {category.label}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <PublicProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
