import { WhatsApp } from "@/components/icons/whatsapp"
import { WHATSAPP_LINK } from "@/components/site-header/config"
import { cn } from "@/lib/utils"

type SiteHeaderWhatsappLinkProps = {
  className?: string
  href?: string
}

export function SiteHeaderWhatsappLink({
  className,
  href = WHATSAPP_LINK.href,
}: SiteHeaderWhatsappLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm p-2 text-white transition-opacity duration-300 hover:opacity-85 md:w-36 md:justify-end",
        className
      )}
    >
      <WhatsApp className="size-6" aria-hidden />
      <span className="sr-only">{WHATSAPP_LINK.label}</span>
    </a>
  )
}
