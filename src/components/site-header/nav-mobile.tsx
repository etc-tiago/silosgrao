import { Dialog } from "@base-ui/react/dialog"
import { Link, useRouterState } from "@tanstack/react-router"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PRODUTOS_LINK } from "@/components/site-header/config"
import {
  drawerNavLinkClassName,
  isNavItemActive,
  navItems,
} from "@/components/site-header/nav"
import type { HeaderThemeTokens } from "@/lib/site/header-theme"
import { cn } from "@/lib/utils"

type SiteHeaderNavMobileProps = {
  className?: string
  theme: HeaderThemeTokens
}

export function SiteHeaderNavMobile({
  className,
  theme,
}: SiteHeaderNavMobileProps) {
  const [open, setOpen] = useState(false)
  const { location } = useRouterState()
  const hash = location.hash.replace(/^#/, "")

  function closeMenu() {
    setOpen(false)
  }

  const produtosActive = location.pathname.startsWith(PRODUTOS_LINK.to)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "shrink-0 hover:bg-white/10 md:hidden",
              theme.icon,
              className
            )}
            aria-label="Abrir menu"
          >
            <Menu className="size-6" />
          </Button>
        }
      />

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[90] bg-black/40 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 md:hidden" />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 right-0 z-[100] flex w-full max-w-xs flex-col border-l bg-background shadow-2xl md:hidden",
            "transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b px-4 py-4">
            <Dialog.Title className="text-sm font-semibold tracking-[0.24em] uppercase">
              Menu
            </Dialog.Title>
            <Dialog.Close
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Fechar menu">
                  <X className="size-5" />
                </Button>
              }
            />
          </div>

          <nav aria-label="Principal" className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = isNavItemActive(location.pathname, hash, item)

                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      hash={item.hash}
                      className={cn(
                        drawerNavLinkClassName(active),
                        "block w-full"
                      )}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link
                  to={PRODUTOS_LINK.to}
                  className={cn(
                    drawerNavLinkClassName(produtosActive),
                    "block w-full"
                  )}
                  onClick={closeMenu}
                >
                  {PRODUTOS_LINK.label}
                </Link>
              </li>
            </ul>
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
