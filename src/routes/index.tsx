import { loadHomeContent } from "@/lib/content/home.fn"
import { homeEditableFields, type HomeFieldPath } from "@/lib/content/fields/home"
import { editSearchSchema } from "@/lib/content/fields/search"
import { EditSheet } from "@/components/editor/edit-sheet"
import {
  EditorModeProvider,
  EditNavigationProvider,
  H1,
  P,
} from "@/components/content"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback, useEffect } from "react"
import type { EditTipo } from "@/lib/content/fields/types"

export const Route = createFileRoute("/")({
  validateSearch: editSearchSchema,
  loader: () => loadHomeContent(),
  component: HomePage,
})

function HomePage() {
  const { content, mode } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const openEdit = useCallback(
    (path: string, editTipo: EditTipo) => {
      navigate({ search: { editar: path, tipo: editTipo } })
    },
    [navigate]
  )

  const closeEdit = useCallback(() => {
    navigate({ search: {} })
  }, [navigate])

  useEffect(() => {
    if (!search.editar && !search.tipo) return

    const field =
      search.editar && search.editar in homeEditableFields
        ? homeEditableFields[search.editar as HomeFieldPath]
        : undefined
    if (!field || field.editTipo !== search.tipo) {
      closeEdit()
    }
  }, [search.editar, search.tipo, closeEdit])

  return (
    <EditorModeProvider mode={mode}>
      <EditNavigationProvider
        editPath={search.editar}
        openEdit={openEdit}
        closeEdit={closeEdit}
      >
        <main className="flex min-h-svh flex-col items-center justify-center p-6">
          <div className="max-w-2xl space-y-4 text-center">
            <H1
              path="hero.title"
              editTipo="text"
              className="text-4xl font-semibold tracking-tight"
            >
              {content["hero.title"] ?? "Silos Grãos"}
            </H1>
            <P
              path="hero.subtitle"
              editTipo="text"
              className="text-lg text-muted-foreground"
            >
              {content["hero.subtitle"] ?? "Soluções em armazenagem de grãos"}
            </P>
          </div>
        </main>
        <EditSheet
          content={content}
          fields={homeEditableFields}
          search={search}
        />
      </EditNavigationProvider>
    </EditorModeProvider>
  )
}
