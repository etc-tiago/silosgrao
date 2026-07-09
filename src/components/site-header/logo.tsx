import {
  DEFAULT_LOGO_COLOR_PRESET,
  type LogoColorPreset,
} from "@/components/icons/logo-presets"
import { SilosGraosLogomarca } from "@/components/icons/silos-graos-logomarca"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

export type SiteHeaderLogoProps = {
  className?: string
  mobilePreset?: LogoColorPreset
  desktopPreset?: LogoColorPreset
  /** @deprecated Use mobilePreset and desktopPreset */
  preset?: LogoColorPreset
}

export function SiteHeaderLogo({
  className,
  mobilePreset,
  desktopPreset,
  preset = DEFAULT_LOGO_COLOR_PRESET,
}: SiteHeaderLogoProps) {
  const resolvedMobile = mobilePreset ?? preset
  const resolvedDesktop = desktopPreset ?? preset

  return (
    <Link
      to="/"
      className={cn(
        "shrink-0 transition-opacity duration-300 hover:opacity-85",
        className
      )}
    >
      <SilosGraosLogomarca
        preset={resolvedMobile}
        aria-hidden
        className="h-14 w-auto md:hidden"
      />
      <SilosGraosLogomarca
        preset={resolvedDesktop}
        aria-hidden
        className="hidden h-20 w-auto md:block"
      />
      <span className="sr-only">Silo Grão</span>
    </Link>
  )
}
