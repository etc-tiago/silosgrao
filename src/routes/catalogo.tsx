import { CatalogPanel } from "@/components/catalog/catalog-panel"
import { getSessionEditor } from "@/lib/auth/session.server"
import { getServerDb } from "@/lib/server/env"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const ensureCatalogAccess = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getServerDb()
    const editor = await getSessionEditor(db)

    if (!editor) {
      throw redirect({ to: "/editar" })
    }

    return { editor }
  }
)

export const Route = createFileRoute("/catalogo")({
  loader: () => ensureCatalogAccess(),
  head: () => ({
    meta: [{ title: "Catálogo · Silos Grãos" }],
  }),
  component: CatalogoPage,
})

function CatalogoPage() {
  return (
    <main className="min-h-svh bg-background">
      <CatalogPanel />
    </main>
  )
}
