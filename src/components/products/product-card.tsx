import {
  homeCardClass,
  homeCardImageWrapClass,
} from "@/components/home/home-section"
import type { Product, ProductCategoryId } from "@/lib/content/fields/home-products"
import { whatsappProductUrl } from "@/lib/content/fields/home-products"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

type ProductCardProps = {
  product: Product
  categoryId: ProductCategoryId
  className?: string
}

export function ProductCard({
  product,
  categoryId,
  className,
}: ProductCardProps) {
  return (
    <article className={cn(homeCardClass, "p-3", className)}>
      <Link
        to="/produtos/$categoria/$id"
        params={{ categoria: categoryId, id: String(product.id) }}
        className="block"
      >
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
      </Link>

      <div className="p-4">
        <Link
          to="/produtos/$categoria/$id"
          params={{ categoria: categoryId, id: String(product.id) }}
          className="block transition-opacity hover:opacity-80"
        >
          <h3 className="font-display text-xl text-ink">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm font-semibold text-primary">
          Capacidade: {product.capacity}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <details className="group mt-4 rounded-2xl border border-border bg-card open:bg-muted/30">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <span>Especificações Técnicas</span>
            <span
              aria-hidden
              className="text-muted-foreground transition-transform duration-300 group-open:rotate-180"
            >
              ▾
            </span>
          </summary>
          <div className="border-t border-border px-4 py-4">
            <ul className="space-y-2">
              {product.specs.map((spec) => (
                <li
                  key={spec}
                  className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
                >
                  <span className="mt-0.5 font-bold text-primary">•</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            to="/produtos/$categoria/$id"
            params={{ categoria: categoryId, id: String(product.id) }}
            className="flex flex-1 items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Ver mais
          </Link>
          <a
            href={whatsappProductUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Solicitar Orçamento
          </a>
        </div>
      </div>
    </article>
  )
}
