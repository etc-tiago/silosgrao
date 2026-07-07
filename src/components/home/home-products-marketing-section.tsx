import { EditorSafeRouteLink } from "@/components/content/content-link"
import { P } from "@/components/content"
import { homeSectionClass } from "@/components/home/home-section"

type HomeProductsMarketingSectionProps = {
  content: Record<string, string>
  framed?: boolean
  className?: string
}

export function HomeProductsMarketingSection({
  content,
  framed = false,
  className,
}: HomeProductsMarketingSectionProps) {
  return (
    <section
      id="products-marketing"
      className={homeSectionClass({ framed, className })}
    >
      <div className="mx-auto max-w-3xl text-center">
        <P
          path="products.marketingLead"
          editTipo="text"
          value={
            content["products.marketingLead"]?.trim() ||
            "Soluções completas em silos, secadores, transportadores e infraestrutura metálica para armazenamento de grãos."
          }
          className="text-base leading-relaxed text-muted-foreground md:text-lg"
        />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <EditorSafeRouteLink
            to="/produtos"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Conheça nossas soluções
          </EditorSafeRouteLink>
          <EditorSafeRouteLink
            to="/contato"
            className="inline-flex h-10 items-center justify-center rounded-full border px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Fale conosco
          </EditorSafeRouteLink>
        </div>
      </div>
    </section>
  )
}
