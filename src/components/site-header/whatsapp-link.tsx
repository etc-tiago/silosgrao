import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { WHATSAPP_LINK } from "@/components/site-header/config"

type SiteHeaderWhatsappLinkProps = {
  className?: string
}

export function SiteHeaderWhatsappLink({ className }: SiteHeaderWhatsappLinkProps) {
  return (
    <a
      href={WHATSAPP_LINK.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm p-2 text-white transition-opacity duration-300 hover:opacity-85 md:w-36 md:justify-end",
        className
      )}
    >
      <MessageCircle className="size-6" aria-hidden />
      <span className="sr-only">{WHATSAPP_LINK.label}</span>
    </a>
  )
}
