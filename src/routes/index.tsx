import { createFileRoute } from "@tanstack/react-router"
import { loadHomeContent } from "@/lib/content/home.fn"

export const Route = createFileRoute("/")({
  loader: () => loadHomeContent(),
  component: HomePage,
})

function HomePage() {
  const { content } = Route.useLoaderData()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="max-w-2xl space-y-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          {content["hero.title"] ?? "Silos Grãos"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {content["hero.subtitle"] ?? "Soluções em armazenagem de grãos"}
        </p>
      </div>
    </main>
  )
}
