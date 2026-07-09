import { createFileRoute } from "@tanstack/react-router"
import { LoginDialog } from "@/components/editor/login-dialog"

export const Route = createFileRoute("/editar")({
  component: EditarPage,
})

function EditarPage() {
  return <LoginDialog />
}
