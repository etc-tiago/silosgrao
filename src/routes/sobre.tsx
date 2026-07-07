import { homeSectionHeadingClass } from "@/components/home/home-section"
import { ProductBreadcrumb } from "@/components/products/product-breadcrumb"
import { cn } from "@/lib/utils"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [{ title: "Sobre · Silos Grãos" }],
  }),
  component: SobrePage,
})

const PRINCIPIOS = [
  "Melhorar continuamente nossos produtos e serviços.",
  "Promover o desenvolvimento dos nossos colaboradores.",
  "Garantir a satisfação dos nossos clientes.",
  "Liderar nosso mercado de atuação.",
  "Parcerias como estratégia de negócios.",
  "Diferenciar soluções de engenharia.",
  "Caracterizar nosso desempenho.",
  "Buscar a fidelização dos nossos clientes.",
] as const

function SobrePage() {
  return (
    <main className="min-h-svh bg-background px-6 pb-16 pt-32 md:px-14">
      <div className="mx-auto max-w-3xl">
        <ProductBreadcrumb
          items={[
            { kind: "link", label: "Início", to: "/" },
            { kind: "page", label: "Sobre" },
          ]}
          className="mb-8"
        />

        <header className="mb-10">
          <h1 className={cn(homeSectionHeadingClass, "text-4xl md:text-5xl")}>
            Sobre Nós
          </h1>
        </header>

        <article className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-relaxed text-muted-foreground">
            A empresa Silo Grão Equipamentos para armazenagem surgiu para
            atender especificamente a reposição de peças de equipamentos.
            Inicialmente com um vendedor interno, posteriormente foi criado o
            departamento comercial agregando outros produtos para
            comercialização, principalmente correias planas, agrícolas e
            industriais e vários outros itens para a área agrícola. Foi criada
            então uma equipe de vendedores externos para atuarem diretamente
            junto aos clientes fazendo levantamentos nos equipamentos já
            instalados visando a reposição de peças e a venda de outros
            produtos.
          </p>

          <p className="mt-4 leading-relaxed text-muted-foreground">
            A atuação é desenvolvida pela equipe de vendas interna (Call
            Center) e externa, enquanto os pedidos são atendidos pela Central de
            distribuição de Peças de Francisco Beltrão, com sistema de
            logística.
          </p>

          <section className="mt-10">
            <h2 className="font-display text-2xl text-foreground">
              Nossa Missão
            </h2>
            <blockquote className="mt-4 border-l-4 border-primary/40 pl-4 text-lg leading-relaxed text-foreground italic">
              Oferecer soluções que agregam valor ao nosso produto, assegurando
              a satisfação dos nossos clientes.
            </blockquote>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl text-foreground">Princípios</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              {PRINCIPIOS.map((principio) => (
                <li key={principio}>{principio}</li>
              ))}
            </ul>
          </section>
        </article>

        <nav
          aria-label="Documentos institucionais"
          className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/60 pt-8 text-sm text-muted-foreground/70"
        >
          <Link
            to="/codigo-etica"
            className="transition-colors hover:text-muted-foreground"
          >
            Código de Conduta
          </Link>
          <a
            href="/privacidade.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-muted-foreground"
          >
            Política de Privacidade
          </a>
        </nav>
      </div>
    </main>
  )
}
