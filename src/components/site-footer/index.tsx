import { SilosGraosLogomarca } from "@/components/icons/silos-graos-logomarca"
import { WhatsApp } from "@/components/icons/whatsapp"
import {
  PRODUCT_CATEGORIES,
} from "@/lib/content/fields/home-products"
import {
  SITE_FOOTER_ABOUT,
  SITE_LOCATION,
  SITE_PHONE_DISPLAY,
  SITE_WHATSAPP_DISPLAY,
  SITE_WHATSAPP_URL,
} from "@/lib/site/contact"
import { Link } from "@tanstack/react-router"
import { MapPin, Phone } from "lucide-react"

const footerCategories = PRODUCT_CATEGORIES

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary px-6 py-12 text-primary-foreground md:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          <div>
            <Link
              to="/"
              className="inline-block transition-opacity hover:opacity-85"
            >
              <SilosGraosLogomarca
                preset="white"
                className="h-20 w-auto"
              />
              <span className="sr-only">Silos Grãos</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
              {SITE_FOOTER_ABOUT}
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl text-primary-foreground">
              Entre em Contato
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
                <span>{SITE_PHONE_DISPLAY}</span>
              </div>
              <div className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin className="mt-1 size-4 shrink-0" />
                <span>{SITE_LOCATION}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl text-primary-foreground">
              Categorias
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link
                  to="/produtos"
                  className="transition-colors hover:text-primary-foreground"
                >
                  Catálogo completo
                </Link>
              </li>
              {footerCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    to="/produtos/$categoria"
                    params={{ categoria: category.id }}
                    className="transition-colors hover:text-primary-foreground"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="text-center text-sm text-primary-foreground/70">
            © {year} Silos Grãos. Todos os direitos reservados. | Desenvolvido
            com precisão para sua confiança.
          </p>
        </div>
      </div>
    </footer>
  )
}
