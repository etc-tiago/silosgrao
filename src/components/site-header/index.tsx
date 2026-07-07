import type { LogoColorPreset } from "@/components/icons/logo-presets"
import { SiteHeaderCenterGroup } from "@/components/site-header/center-group"
import { SiteHeaderLogo } from "@/components/site-header/logo"
import { SiteHeaderNavMobile } from "@/components/site-header/nav-mobile"
import { SiteHeaderProdutosLink } from "@/components/site-header/produtos-link"
import { SiteHeaderWhatsappLink } from "@/components/site-header/whatsapp-link"
import { SiteHeaderWrapper } from "@/components/site-header/wrapper"

type SiteHeaderProps = {
  className?: string
  logoPreset?: LogoColorPreset
  whatsappUrl?: string
}

export function SiteHeader({
  className,
  logoPreset,
  whatsappUrl,
}: SiteHeaderProps) {
  return (
    <SiteHeaderWrapper className={className}>
      <div className="flex w-full items-center gap-2 md:gap-4">
        <SiteHeaderLogo
          preset={logoPreset}
          className="order-1 min-w-0 flex-1 md:hidden"
        />
        <SiteHeaderNavMobile className="order-3 shrink-0 md:hidden" />
        <SiteHeaderCenterGroup logoPreset={logoPreset} className="md:order-2" />
        <div className="order-4 flex shrink-0 items-center gap-1 md:order-1">
          <SiteHeaderProdutosLink className="w-auto" />
        </div>
        <SiteHeaderWhatsappLink className="order-2 md:order-3" href={whatsappUrl} />
      </div>
    </SiteHeaderWrapper>
  )
}
