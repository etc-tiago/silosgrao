import {
  EditNavigationProvider,
  EditorModeProvider,
} from "@/components/content"
import { EditSheet } from "@/components/editor/edit-sheet"
import { HeroSection } from "@/components/home/hero-section"
import { homeEditableFields, type HomeFieldPath } from "@/lib/content/fields/home"
import { editSearchSchema } from "@/lib/content/fields/search"
import type { EditTipo } from "@/lib/content/fields/types"
import { loadHomeContent } from "@/lib/content/home.fn"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback, useEffect } from "react"

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
        <main>
          <HeroSection content={content} />
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
