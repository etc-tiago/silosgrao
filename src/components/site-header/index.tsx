import { SiteHeaderCenterGroup } from "@/components/site-header/center-group"
import { SiteHeaderLogo } from "@/components/site-header/logo"
import { SiteHeaderNavMobile } from "@/components/site-header/nav-mobile"
import { SiteHeaderProdutosLink } from "@/components/site-header/produtos-link"
import { SiteHeaderWhatsappLink } from "@/components/site-header/whatsapp-link"
import { SiteHeaderWrapper } from "@/components/site-header/wrapper"

type SiteHeaderProps = {
  className?: string
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <SiteHeaderWrapper className={className}>
      <div className="flex w-full items-center gap-2 md:gap-4">
        <SiteHeaderLogo className="order-1 min-w-0 flex-1 md:hidden" />
        <SiteHeaderNavMobile className="order-3 shrink-0 md:hidden" />
        <SiteHeaderCenterGroup className="md:order-2" />
        <SiteHeaderProdutosLink className="order-4 md:order-1" />
        <SiteHeaderWhatsappLink className="order-2 md:order-3" />
      </div>
    </SiteHeaderWrapper>
  )
}
