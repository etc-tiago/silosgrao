import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

export type NavItem = {
  to: "/" | "/contato"
  label: string
  hash?: string
}

export const navItems: NavItem[] = [
  { to: "/", label: "Início" },
  { to: "/", hash: "solucoes", label: "Soluções" },
  { to: "/", hash: "sobre", label: "Sobre" },
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

export function navLinkClassName(active: boolean) {
  return cn(
    "group relative isolate overflow-hidden rounded-sm px-3 py-2 text-[0.6875rem] font-semibold tracking-[0.24em] text-white uppercase outline-1 outline-transparent transition-[background-color] duration-300 ease-out",
    active ? "bg-white/10 outline-white/15" : ""
  )
}

type NavLinkProps = {
  item: NavItem
  active: boolean
  onNavigate?: () => void
}

export function NavLink({ item, active, onNavigate }: NavLinkProps) {
  return (
    <Link
      to={item.to}
      hash={item.hash}
      className={navLinkClassName(active)}
      onClick={onNavigate}
    >
      <span className="relative z-10">{item.label}</span>
    </Link>
  )
}

function NavSeparator() {
  return (
    <span
      aria-hidden
      className="mx-3 h-8 w-px bg-linear-to-b from-white/15 via-white/8 to-transparent"
    />
  )
}

type NavListProps = {
  items: NavItem[]
  pathname: string
  hash: string
  showSeparators?: boolean
  onNavigate?: () => void
}

export function NavList({
  items,
  pathname,
  hash,
  showSeparators = true,
  onNavigate,
}: NavListProps) {
  return (
    <ul className="flex items-center">
      {items.map((item, index) => {
        const active = isNavItemActive(pathname, hash, item)

        return (
          <li key={item.label} className="flex items-center">
            {showSeparators && index > 0 ? <NavSeparator /> : null}
            <NavLink item={item} active={active} onNavigate={onNavigate} />
          </li>
        )
      })}
    </ul>
  )
}
