import { createFileRoute } from "@tanstack/react-router"
import { LoginDialog } from "@/components/editor/login-dialog"

export const Route = createFileRoute("/editar")({
  component: EditarPage,
  loader: () => ({
    turnstileSiteKey:
      import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA",
  }),
})

function EditarPage() {
  const { turnstileSiteKey } = Route.useLoaderData()

  return <LoginDialog turnstileSiteKey={turnstileSiteKey} />
}
