import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/produtos")({
  component: ProdutosPage,
})

function ProdutosPage() {
  return (
    <main className="container mx-auto min-h-svh px-6 pt-32 pb-16">
      <h1 className="text-3xl font-semibold tracking-tight">Produtos</h1>
      <p className="mt-4 text-muted-foreground">
        Página em construção. Em breve você encontrará aqui nosso catálogo de
        silos, secadores, transportadores e infraestrutura metálica.
      </p>
    </main>
  )
}
