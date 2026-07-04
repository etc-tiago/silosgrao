import { SilosGraosLogomarca } from "@/components/icons/silos-graos-logomarca"
import {
  DEFAULT_LOGO_COLOR_PRESET,
  type LogoColorPreset,
} from "@/components/icons/logo-presets"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

export type SiteHeaderLogoProps = {
  className?: string
  preset?: LogoColorPreset
}

export function SiteHeaderLogo({
  className,
  preset = DEFAULT_LOGO_COLOR_PRESET,
}: SiteHeaderLogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        "shrink-0 transition-opacity duration-300 hover:opacity-85",
        className
      )}
    >
      <SilosGraosLogomarca
        preset={preset}
        aria-hidden
        className="h-14 w-auto md:h-20"
      />
      <span className="sr-only">Silos Grãos</span>
    </Link>
  )
}
