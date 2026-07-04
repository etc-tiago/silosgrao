import { SiteHeaderLogo } from "@/components/site-header/logo"
import {
  navItemsLeft,
  navItemsRight,
  NavList,
} from "@/components/site-header/nav"
import { cn } from "@/lib/utils"
import { useRouterState } from "@tanstack/react-router"

type SiteHeaderCenterGroupProps = {
  className?: string
}

export function SiteHeaderCenterGroup({ className }: SiteHeaderCenterGroupProps) {
  const { location } = useRouterState()
  const hash = location.hash.replace(/^#/, "")

  return (
    <div
      className={cn(
        "hidden min-w-0 flex-1 gap-4 items-center md:flex",
        className
      )}
    >
      <nav
        aria-label="Principal — esquerda"
        className="flex flex-1 items-center justify-end"
      >
        <NavList
          items={navItemsLeft}
          pathname={location.pathname}
          hash={hash}
        />
      </nav>

      <SiteHeaderLogo className="shrink-0 px-6" />

      <nav
        aria-label="Principal — direita"
        className="flex flex-1 items-center justify-start"
      >
        <NavList
          items={navItemsRight}
          pathname={location.pathname}
          hash={hash}
        />
      </nav>
    </div>
  )
}
