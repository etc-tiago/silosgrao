import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

export type ProductBreadcrumbItem =
  | {
      kind: "link"
      label: string
      to: "/" | "/produtos" | "/produtos/$categoria"
      params?: { categoria: string }
      hash?: string
    }
  | {
      kind: "page"
      label: string
    }

type ProductBreadcrumbProps = {
  items: ProductBreadcrumbItem[]
  className?: string
}

export function ProductBreadcrumb({ items, className }: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("text-sm text-muted-foreground", className)}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {item.kind === "link" ? (
                <Link
                  to={item.to}
                  params={item.params}
                  hash={item.hash}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && "text-foreground")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
