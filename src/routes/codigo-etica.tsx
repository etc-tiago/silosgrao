import { homeSectionHeadingClass } from "@/components/home/home-section"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { cn } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { FileText } from "lucide-react"

export const Route = createFileRoute("/codigo-etica")({
  head: () => ({
    meta: [{ title: "Código de Ética · Silos Grãos" }],
  }),
  component: CodigoEticaPage,
})

const CODIGO_ETICA_PDF_URL = "/codigo-etica.pdf"

function CodigoEticaPage() {
  return (
    <main className="min-h-svh bg-background px-6 pt-32 pb-16 md:px-14">
      <div className="mx-auto max-w-3xl">
        <ProductBreadcrumb
          items={[
            { kind: "link", label: "Início", to: "/" },
            { kind: "page", label: "Código de Ética" },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <h1 className={cn(homeSectionHeadingClass, "text-4xl md:text-5xl")}>
            Código de Ética
          </h1>
        </header>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="leading-relaxed text-muted-foreground">
            O{" "}
            <strong className="font-medium text-foreground">
              Código de Ética e Conduta
            </strong>{" "}
            da A G &amp; S C é o documento que define os valores, princípios e
            padrões de comportamento esperados de colaboradores, parceiros e
            fornecedores. Ele reforça a cultura de integridade, transparência e
            responsabilidade da empresa, alinhada à sua missão de entregar
            soluções sustentáveis para o agronegócio.
          </p>
          <section className="mt-10">
            <h2 className="font-display text-2xl text-foreground">
              Valores e Princípios Éticos
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <strong className="font-medium text-foreground">
                  Ética e Honestidade
                </strong>{" "}
                — Decisões legais, transparentes e alinhadas aos valores da
                empresa.
              </li>
              <li>
                <strong className="font-medium text-foreground">
                  Respeito às Pessoas
                </strong>{" "}
                — Valorização da diversidade e relações pautadas por respeito e
                cuidado.
              </li>
              <li>
                <strong className="font-medium text-foreground">
                  Responsabilidade
                </strong>{" "}
                — Zelo pela imagem, patrimônio e marca da A G &amp; S C.
              </li>
              <li>
                <strong className="font-medium text-foreground">
                  Segurança e Saúde
                </strong>{" "}
                — Prioridade ao bem-estar e à integridade física de todos.
              </li>
              <li>
                <strong className="font-medium text-foreground">
                  Sustentabilidade
                </strong>{" "}
                — Uso responsável de recursos e redução de impactos ambientais.
              </li>
              <li>
                <strong className="font-medium text-foreground">
                  Meritocracia e Integridade
                </strong>{" "}
                — Promoções por mérito; combate a conflitos de interesse e
                favorecimentos indevidos.
              </li>
            </ul>
          </section>

          <hr className="my-10 border-border" />

          <div className="not-prose">
            <a
              href={CODIGO_ETICA_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <FileText className="size-4 shrink-0 text-primary" />
              Ver o Documento Completo
            </a>
          </div>
        </article>
      </div>
    </main>
  )
}
