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
    <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
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

        <article className="prose prose-neutral max-w-none dark:prose-invert">
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

          <p className="mt-4 text-sm text-muted-foreground">
            <strong className="font-medium text-foreground">Elaborado por:</strong>{" "}
            Geison Loose{" "}
            <span className="mx-2 text-border">|</span>
            <strong className="font-medium text-foreground">
              Aprovado pela:
            </strong>{" "}
            Diretoria Executiva
          </p>

          <section className="mt-10">
            <h2 className="font-display text-xl text-foreground">Objetivo</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Estabelecer regras claras de conduta ética e íntegra, prevenir
              irregularidades (como corrupção e assédio), promover um ambiente
              de trabalho seguro e saudável, e garantir o cumprimento das leis
              e dos valores da empresa.
            </p>
          </section>

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

          <section className="mt-10">
            <h2 className="font-display text-2xl text-foreground">
              Principais Regras de Conduta
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-medium text-foreground">
                  Combate à Corrupção
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Proibido oferecer, prometer ou aceitar vantagem indevida a
                  agentes públicos ou particulares. Vedadas fraudes em
                  licitações e práticas que prejudiquem a livre concorrência
                  (Lei Anticorrupção 12.846/2013).
                </p>
              </div>

              <div>
                <h3 className="font-medium text-foreground">
                  Ambiente de Trabalho
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Exige respeito mútuo, sem discriminação, assédio, fofocas ou
                  uso de álcool/drogas. Registro de ponto deve ser pessoal e
                  intransferível. Proibidas relações que gerem conflito de
                  interesse. Meritocracia nas promoções.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-foreground">
                  Uso de Recursos, Internet e Dados
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Uso responsável e exclusivo para fins profissionais. Proibido
                  uso de aparelhos pessoais e redes sociais no expediente (salvo
                  autorização). Conformidade com a LGPD. Informações
                  confidenciais e criações intelectuais pertencem à empresa.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-foreground">
                  Relacionamentos e Conflitos de Interesse
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Clientes, fornecedores e concorrentes tratados com respeito,
                  transparência e critérios objetivos. Todo colaborador deve
                  identificar e comunicar situações que possam comprometer sua
                  imparcialidade.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-foreground">
                  Denúncias e Meio Ambiente
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Canais confidenciais (inclusive anônimos) para denúncias, com
                  proteção ao denunciante. Práticas sustentáveis e cumprimento
                  da legislação ambiental. Comunicação com imprensa e órgãos
                  públicos é responsabilidade exclusiva da Diretoria.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl text-foreground">
              Penalidades
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Descumprimento pode resultar em{" "}
              <strong className="font-medium text-foreground">
                advertência, suspensão, desligamento ou medidas legais
              </strong>
              , conforme a gravidade. A omissão na comunicação de
              irregularidades também é infração.
            </p>
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
