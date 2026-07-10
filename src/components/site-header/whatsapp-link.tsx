import { WhatsApp } from "@/components/icons/whatsapp"
import { WHATSAPP_LINK } from "@/components/site-header/config"
import type { HeaderThemeTokens } from "@/lib/site/header-theme"
import { cn } from "@/lib/utils"

type SiteHeaderWhatsappLinkProps = {
  className?: string
  href?: string
  theme: HeaderThemeTokens
}

export function SiteHeaderWhatsappLink({
  className,
  href = WHATSAPP_LINK.href,
  theme,
}: SiteHeaderWhatsappLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm p-2 transition-opacity duration-300 hover:opacity-85",
        theme.icon,
        className
      )}
    >
      <WhatsApp className="size-6" aria-hidden />
      <span className="sr-only">{WHATSAPP_LINK.label}</span>
    </a>
  )
}
