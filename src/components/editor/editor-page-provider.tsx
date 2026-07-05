import {
  EditNavigationProvider,
  EditorModeProvider,
} from "@/components/content"
import { buildContentFieldGroups, getContentGroupIdForField } from "@/components/editor/content-field-groups"
import { ContentBrowserDrawer } from "@/components/editor/content-browser-drawer"
import { registerEditorPageChrome } from "@/components/editor/editor-page-chrome"
import { groupEditableFields } from "@/components/editor/use-edit-field-form"
import { contentGroupIdEnum, type ContentGroupId, type EditSearch } from "@/lib/content/fields/search"
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

  const isContentBrowserOpen =
    search.painel === "conteudo" && Boolean(search.categoria)

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

  const openContentCategory = useCallback(
    (categoria: ContentGroupId) => {
      setSearch({ painel: "conteudo", categoria })
    },
    [setSearch]
  )

  const closeContentBrowser = useCallback(() => {
    setSearch({})
  }, [setSearch])

  const openEdit = useCallback(
    (path: string, editTipo: EditTipo) => {
      const field = fields[path]
      const categoria = field ? getContentGroupIdForField(field) : undefined

      setSearch((prev) => ({
        ...prev,
        painel: "conteudo",
        categoria: categoria ?? prev.categoria,
        editar: path,
        tipo: editTipo,
      }))
    },
    [setSearch, fields]
  )

  const closeEdit = useCallback(() => {
    setSearch((prev) => ({
      painel: prev.painel,
      categoria: prev.categoria,
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

    const field = fields[search.editar]
    const categoria = field ? getContentGroupIdForField(field) : undefined

    setSearch(
      (prev) => ({
        ...prev,
        painel: "conteudo",
        categoria: categoria ?? prev.categoria,
      }),
      true
    )
  }, [search.editar, search.tipo, search.painel, fields, setSearch])

  const fieldGroups = useMemo(
    () => buildContentFieldGroups(groupEditableFields(fields)),
    [fields]
  )

  useEffect(() => {
    if (search.painel !== "conteudo" || !search.categoria) return

    if (!contentGroupIdEnum.includes(search.categoria)) {
      closeContentBrowser()
    }
  }, [search.painel, search.categoria, closeContentBrowser])

  const chromeValue = useMemo(
    () => ({
      openContentCategory,
      isContentBrowserOpen,
      activeCategory: search.categoria,
      openEdit,
      editPath: search.editar,
      fieldGroups,
    }),
    [
      openContentCategory,
      isContentBrowserOpen,
      search.categoria,
      openEdit,
      search.editar,
      fieldGroups,
    ]
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
