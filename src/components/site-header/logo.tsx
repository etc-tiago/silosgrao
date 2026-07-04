import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

type SiteHeaderLogoProps = {
  className?: string
}

export function SiteHeaderLogo({ className }: SiteHeaderLogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        "shrink-0 transition-opacity duration-300 hover:opacity-85",
        className
      )}
    >
      <img
        src="/logo.png"
        loading="eager"
        alt="Silos Grãos"
        className="h-14 w-auto md:h-20"
      />
      <span className="sr-only">Silos Grãos</span>
    </Link>
  )
}
