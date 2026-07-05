import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { HEADER_SIDE_WIDTH, PRODUTOS_LINK } from "@/components/site-header/config"
import { navLinkClassName } from "@/components/site-header/nav"

type SiteHeaderProdutosLinkProps = {
  className?: string
}

export function SiteHeaderProdutosLink({ className }: SiteHeaderProdutosLinkProps) {
  const { location } = useRouterState()
  const active = location.pathname.startsWith(PRODUTOS_LINK.to)

  return (
    <Link
      to={PRODUTOS_LINK.to}
      className={cn(
        HEADER_SIDE_WIDTH,
        "hidden shrink-0 items-center md:flex",
        navLinkClassName(active),
        className
      )}
    >
      {PRODUTOS_LINK.label}
    </Link>
  )
}
