import type { HeaderThemeTokens } from "@/lib/site/header-theme"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

export type NavItem = {
  to: "/" | "/contato" | "/sobre" | "/catalogo"
  label: string
  hash?: string
}

export const navItems: NavItem[] = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
]

export const navItemsLeft = navItems.slice(0, 2)
export const navItemsRight = navItems.slice(2)

export function isNavItemActive(pathname: string, hash: string, item: NavItem) {
  if (item.to !== "/") {
    return pathname === item.to
  }
  if (pathname !== "/") return false
  if (!item.hash) return hash === ""
  return hash === item.hash
}

const navLinkBaseClassName =
  "group relative isolate overflow-hidden rounded-sm px-3 py-2 text-[0.6875rem] font-semibold tracking-[0.24em] uppercase outline-1 outline-transparent transition-[background-color] duration-300 ease-out"

export function navLinkClassName(
  active: boolean,
  tokens?: HeaderThemeTokens
) {
  return cn(
    navLinkBaseClassName,
    tokens?.nav ?? "text-white",
    active ? tokens?.navActive ?? "bg-white/10 outline-white/15" : ""
  )
}

export function drawerNavLinkClassName(active: boolean) {
  return cn(
    navLinkBaseClassName,
    "text-foreground",
    active ? "bg-foreground/10 outline-foreground/15" : ""
  )
}

type NavLinkProps = {
  item: NavItem
  active: boolean
  tokens?: HeaderThemeTokens
  onNavigate?: () => void
}

export function NavLink({ item, active, tokens, onNavigate }: NavLinkProps) {
  return (
    <Link
      to={item.to}
      hash={item.hash}
      className={navLinkClassName(active, tokens)}
      onClick={onNavigate}
    >
      <span className="relative z-10">{item.label}</span>
    </Link>
  )
}

function NavSeparator({ tokens }: { tokens?: HeaderThemeTokens }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mx-3 h-8 w-px",
        tokens?.separator ??
        "bg-linear-to-b from-white/15 via-white/8 to-transparent"
      )}
    />
  )
}

type NavListProps = {
  items: NavItem[]
  pathname: string
  hash: string
  tokens?: HeaderThemeTokens
  showSeparators?: boolean
  onNavigate?: () => void
}

export function NavList({
  items,
  pathname,
  hash,
  tokens,
  showSeparators = true,
  onNavigate,
}: NavListProps) {
  return (
    <ul className="flex items-center">
      {items.map((item, index) => {
        const active = isNavItemActive(pathname, hash, item)

        return (
          <li key={item.label} className="flex items-center">
            {showSeparators && index > 0 ? (
              <NavSeparator tokens={tokens} />
            ) : null}
            <NavLink
              item={item}
              active={active}
              tokens={tokens}
              onNavigate={onNavigate}
            />
          </li>
        )
      })}
    </ul>
  )
}
