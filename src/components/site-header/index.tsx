import { SiteHeaderCenterGroup } from "@/components/site-header/center-group"
import { SiteHeaderLogo } from "@/components/site-header/logo"
import { SiteHeaderNavMobile } from "@/components/site-header/nav-mobile"
import { SiteHeaderWhatsappLink } from "@/components/site-header/whatsapp-link"
import { SiteHeaderWrapper } from "@/components/site-header/wrapper"
import type { HeaderThemeTokens } from "@/lib/site/header-theme"

type SiteHeaderProps = {
  className?: string
  theme: HeaderThemeTokens
  whatsappUrl?: string
}

export function SiteHeader({
  className,
  theme,
  whatsappUrl,
}: SiteHeaderProps) {
  return (
    <SiteHeaderWrapper className={className}>
      <div className="flex w-full items-center gap-2 md:gap-4">
        <SiteHeaderLogo
          mobilePreset={theme.logoPresetMobile}
          desktopPreset={theme.logoPresetDesktop}
          className="order-1 min-w-0 flex-1 md:hidden"
        />
        <SiteHeaderNavMobile className="order-3 shrink-0" theme={theme} />
        <SiteHeaderCenterGroup theme={theme} className="md:order-2" />
        <div className="order-4 flex shrink-0 items-center gap-1 md:order-1" />
        <SiteHeaderWhatsappLink
          className="order-2 md:order-3"
          href={whatsappUrl}
          theme={theme}
        />
      </div>
    </SiteHeaderWrapper>
  )
}
