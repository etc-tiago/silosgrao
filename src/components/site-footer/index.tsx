import { SilosGraosLogomarca } from "@/components/icons/silos-graos-logomarca"
import { WhatsApp } from "@/components/icons/whatsapp"
import {
  SITE_ADDRESS_LINES,
  SITE_EMAIL,
  SITE_PHONE_DISPLAY,
  SITE_WHATSAPP_DISPLAY,
  SITE_WHATSAPP_URL,
} from "@/lib/site/contact"
import {
  SITE_FOOTER_ABOUT,
  SITE_FOOTER_CONTACT_TITLE,
} from "@/lib/site/site-chrome"
import { Link } from "@tanstack/react-router"
import { Mail, MapPin, Phone } from "lucide-react"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary px-6 py-12 text-primary-foreground md:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <div>
            <Link
              to="/"
              className="inline-block transition-opacity hover:opacity-85"
            >
              <SilosGraosLogomarca preset="white" className="h-20 w-auto" />
              <span className="sr-only">Silo Grão</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
              {SITE_FOOTER_ABOUT}
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl text-primary-foreground">
              {SITE_FOOTER_CONTACT_TITLE}
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <a
                href={SITE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <WhatsApp className="size-4" />
                <span>WhatsApp: {SITE_WHATSAPP_DISPLAY}</span>
              </a>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="size-4" />
                <a
                  href={`tel:${SITE_PHONE_DISPLAY.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-primary-foreground"
                >
                  {SITE_PHONE_DISPLAY}
                </a>
              </div>
              <a
                href={`mailto:${SITE_EMAIL}`}
                className="flex items-center gap-2 text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <Mail className="size-4" />
                <span>{SITE_EMAIL}</span>
              </a>
              <div className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="mt-1 size-4 shrink-0" />
                <address className="not-italic">
                  {SITE_ADDRESS_LINES.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-sm text-primary-foreground/70">
            © {year} Silo Grão. Todos os direitos reservados. | Desenvolvido
            com precisão para sua confiança.
          </p>
        </div>
      </div>
    </footer>
  )
}
