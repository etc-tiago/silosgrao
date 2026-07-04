import { EditorPageProvider } from "@/components/editor/editor-page-provider"
import { HomeHeroIntro } from "@/components/home/home-hero-intro"
import { HomeHeroSection } from "@/components/home/home-hero-section"
import { WhatsApp } from "@/components/icons/whatsapp"
import { homeEditableFields } from "@/lib/content/fields/home"
import { editSearchSchema } from "@/lib/content/fields/search"
import { loadHomeContent } from "@/lib/content/home.fn"
import { createFileRoute } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"

export const Route = createFileRoute("/demo")({
  validateSearch: editSearchSchema,
  loader: () => loadHomeContent(),
  component: DemoPage,
  head: () => ({
    meta: [{ title: "Demo · STAY·SPOT" }],
  }),
})

const intents = [
  {
    title: "Quero um orçamento",
    description:
      "Solicite uma proposta personalizada para armazenagem, secagem, transporte ou beneficiamento.",
    img: "/demo/stay1.jpg",
  },
  {
    title: "Quero peças de reposição",
    description:
      "Encontre componentes originais para equipamentos de movimentação, secagem e armazenagem.",
    img: "/demo/stay2.jpg",
  },
  {
    title: "Quero conhecer a empresa",
    description:
      "Conheça nossa história, estrutura e atuação no sudoeste do Paraná desde 2010.",
    img: "/demo/stay3.jpg",
  },
  {
    title: "Quero ver o catálogo de produtos",
    description:
      "Explore silos, secadores, transportadores e soluções completas para o agronegócio.",
    img: "/demo/stay4.jpg",
  },
]

function DemoPage() {
  const { content, mode } = Route.useLoaderData()
  const search = Route.useSearch()

  return (
    <EditorPageProvider
      mode={mode}
      content={content}
      fields={homeEditableFields}
      search={search}
    >
      <main className="min-h-screen bg-background">
        <HomeHeroSection content={content} framed embeddedHeader />
        <HomeHeroIntro content={content} framed />

        <section className="mx-3 mt-10 rounded-[2rem] bg-surface px-6 py-14 md:mx-6 md:px-14 md:py-20">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h2 className="font-display text-5xl text-ink md:text-7xl">
                O que você <span className="font-bold">Busca</span>?
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium"
              >
                <span>Falar conosco</span>
                <WhatsApp className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {intents.map((intent) => (
              <article
                key={intent.title}
                className="group cursor-pointer rounded-3xl bg-card p-3 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={intent.img}
                    alt={intent.title}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 p-4">
                  <div>
                    <h3 className="font-display text-xl text-ink">
                      {intent.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {intent.description}
                    </p>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition group-hover:bg-ink group-hover:text-white">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </EditorPageProvider>
  )
}
