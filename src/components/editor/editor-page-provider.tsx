import {
  EditNavigationProvider,
  EditorModeProvider,
} from "@/components/content"
import { ContentBrowserDrawer } from "@/components/editor/content-browser-drawer"
import { registerEditorPageChrome } from "@/components/editor/editor-page-chrome"
import type { EditSearch } from "@/lib/content/fields/search"
import type { EditTipo } from "@/lib/content/fields/types"
import type { EditableFields } from "@/lib/content/fields/types"
import type { ContentReadMode } from "@/lib/content/read"
import { useRouter } from "@tanstack/react-router"
import {
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"

type EditorPageProviderProps = {
  mode: ContentReadMode
  content: Record<string, string>
  fields: EditableFields
  search: EditSearch
  children: ReactNode
}

export function EditorPageProvider({
  mode,
  content,
  fields,
  search,
  children,
}: EditorPageProviderProps) {
  const router = useRouter()

  const isContentBrowserOpen = search.painel === "conteudo"

  const setSearch = useCallback(
    (next: EditSearch | ((prev: EditSearch) => EditSearch), replace = false) => {
      const current = router.state.location.search as EditSearch
      const nextSearch = typeof next === "function" ? next(current) : next

      void router.navigate({
        to: router.state.location.pathname,
        search: nextSearch,
        replace,
      })
    },
    [router]
  )

  const openContentBrowser = useCallback(() => {
    setSearch((prev) => ({ ...prev, painel: "conteudo" }))
  }, [setSearch])

  const closeContentBrowser = useCallback(() => {
    setSearch({})
  }, [setSearch])

  const openEdit = useCallback(
    (path: string, editTipo: EditTipo) => {
      setSearch((prev) => ({
        ...prev,
        painel: "conteudo",
        editar: path,
        tipo: editTipo,
      }))
    },
    [setSearch]
  )

  const closeEdit = useCallback(() => {
    setSearch((prev) => ({
      painel: prev.painel,
    }))
  }, [setSearch])

  useEffect(() => {
    if (!search.editar && !search.tipo) return

    const field = search.editar ? fields[search.editar] : undefined
    if (!field || field.editTipo !== search.tipo) {
      closeEdit()
    }
  }, [search.editar, search.tipo, fields, closeEdit])

  useEffect(() => {
    if (!search.editar || !search.tipo || search.painel === "conteudo") return

    setSearch(
      (prev) => ({
        ...prev,
        painel: "conteudo",
      }),
      true
    )
  }, [search.editar, search.tipo, search.painel, setSearch])

  const chromeValue = useMemo(
    () => ({ openContentBrowser, isContentBrowserOpen }),
    [openContentBrowser, isContentBrowserOpen]
  )

  useEffect(() => {
    registerEditorPageChrome(chromeValue)
    return () => registerEditorPageChrome(null)
  }, [chromeValue])

  return (
    <EditorModeProvider mode={mode}>
      <EditNavigationProvider
        editPath={search.editar}
        openEdit={openEdit}
        closeEdit={closeEdit}
      >
        {children}
        <ContentBrowserDrawer
          content={content}
          fields={fields}
          search={search}
          open={isContentBrowserOpen}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) closeContentBrowser()
          }}
        />
      </EditNavigationProvider>
    </EditorModeProvider>
  )
}
