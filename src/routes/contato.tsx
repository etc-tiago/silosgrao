import { homeSectionHeadingClass } from "@/components/home/home-section"
import { WhatsApp } from "@/components/icons/whatsapp"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import {
  SITE_ADDRESS_LINES,
  SITE_EMAIL,
  SITE_MAP_EMBED_URL,
  SITE_PHONE_DISPLAY,
  SITE_WHATSAPP_DISPLAY,
  SITE_WHATSAPP_URL,
} from "@/lib/site/contact"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { Mail, MapPin, Phone } from "lucide-react"

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [{ title: "Contato · Silo Grão" }],
  }),
  component: ContatoPage,
})

function ContatoPage() {
  return (
    <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
      <div className="mx-auto max-w-7xl">
        <ProductBreadcrumb
          items={[
            { kind: "link", label: "Início", to: "/" },
            { kind: "page", label: "Contato" },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <h1 className={cn(homeSectionHeadingClass, "text-4xl md:text-6xl")}>
            Contato
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Fale com nossa equipe comercial ou visite nossa unidade em Francisco
            Beltrão.
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
          <section aria-labelledby="contact-info-heading" className="space-y-6">
            <h2
              id="contact-info-heading"
              className="font-display text-2xl text-foreground"
            >
              Como falar conosco
            </h2>

            <ul className="space-y-4 text-foreground">
              <li>
                <a
                  href={SITE_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/40"
                >
                  <WhatsApp className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>
                    <span className="block text-sm font-medium text-muted-foreground">
                      WhatsApp
                    </span>
                    <span className="block text-lg">{SITE_WHATSAPP_DISPLAY}</span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`tel:${SITE_PHONE_DISPLAY.replace(/\s/g, "")}`}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/40"
                >
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>
                    <span className="block text-sm font-medium text-muted-foreground">
                      Telefone
                    </span>
                    <span className="block text-lg">{SITE_PHONE_DISPLAY}</span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/40"
                >
                  <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>
                    <span className="block text-sm font-medium text-muted-foreground">
                      E-mail
                    </span>
                    <span className="block text-lg">{SITE_EMAIL}</span>
                  </span>
                </a>
              </li>

              <li className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <span className="block text-sm font-medium text-muted-foreground">
                    Endereço
                  </span>
                  <address className="mt-1 not-italic text-lg leading-relaxed">
                    {SITE_ADDRESS_LINES.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="contact-map-heading">
            <h2 id="contact-map-heading" className="sr-only">
              Localização no mapa
            </h2>
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <iframe
                src={SITE_MAP_EMBED_URL}
                title="Localização Silos Córdoba Brasil"
                width="100%"
                height="400"
                className="block border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
