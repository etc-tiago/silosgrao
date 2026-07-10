import { SiteHeaderCenterGroup } from "@/components/site-header/center-group"
import { SiteHeaderLogo } from "@/components/site-header/logo"
import { SiteHeaderNavMobile } from "@/components/site-header/nav-mobile"
import { SiteHeaderWhatsappLink } from "@/components/site-header/whatsapp-link"
import { SiteHeaderWrapper } from "@/components/site-header/wrapper"
import type { HeaderThemeTokens } from "@/lib/site/header-theme"
import { cn } from "@/lib/utils"

/** Largura fixa dos lados — mantém a logo no centro óptico. */
const HEADER_SIDE_WIDTH = "sm:w-24 md:w-36"

type SiteHeaderProps = {
  className?: string
  theme: HeaderThemeTokens
  whatsappUrl?: string
}

export function SiteHeader({ className, theme, whatsappUrl }: SiteHeaderProps) {
  return (
    <SiteHeaderWrapper className={className}>
      <div className="flex w-full items-center gap-2 md:gap-4">
        <SiteHeaderLogo
          mobilePreset={theme.logoPresetMobile}
          desktopPreset={theme.logoPresetDesktop}
          className="order-1 min-w-0 w-full flex-1 md:hidden"
        />
        <SiteHeaderNavMobile className="order-3 shrink-0" theme={theme} />
        <SiteHeaderCenterGroup theme={theme} className="md:order-2" />
        <div
          className={cn(
            "order-4 flex shrink-0 items-center gap-1 md:order-1 w-auto",
            HEADER_SIDE_WIDTH
          )}
        />
        <SiteHeaderWhatsappLink
          className={cn(
            "order-3 flex shrink-0 items-center justify-end ml-8 sm:mr-0",
            HEADER_SIDE_WIDTH
          )}
          href={whatsappUrl}
          theme={theme}
        />
      </div>
    </SiteHeaderWrapper>
  )
}
