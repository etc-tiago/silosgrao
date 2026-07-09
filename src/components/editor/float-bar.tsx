import { ConfirmDialog } from "@/components/editor/confirm-dialog"
import { FloatBarContentMenu } from "@/components/editor/float-bar-content-menu"
import { UsersDrawer } from "@/components/editor/users-drawer"
import { useEditorPageChrome } from "@/components/editor/editor-page-chrome"
import { Button } from "@/components/ui/button"
import type { EditorTipo } from "@/db/schema"
import { refreshEditorData } from "@/lib/content/refresh-editor-data"
import { orpc } from "@/orpc/browser-client"
import { Link, useRouter } from "@tanstack/react-router"
import { LogOut, Package, RotateCcw, RotateCw, Trash2, Upload, Users } from "lucide-react"
import { useState } from "react"

interface FloatBarEditor {
  id: number
  email: string
  tipo: EditorTipo
}

interface FloatBarProps {
  editor: FloatBarEditor
  canUndo: boolean
  canRedo: boolean
  hasDevChanges: boolean
}

export function FloatBar({ editor, canUndo, canRedo, hasDevChanges }: FloatBarProps) {
  const router = useRouter()
  const editorPage = useEditorPageChrome()
  const [confirmAction, setConfirmAction] = useState<
    "discard" | "publish" | null
  >(null)
  const [usersOpen, setUsersOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function refreshSession() {
    await refreshEditorData(router)
  }

  async function handleUndo() {
    setLoading(true)
    try {
      await orpc.editor.undo()
      await refreshSession()
    } finally {
      setLoading(false)
    }
  }

  async function handleRedo() {
    setLoading(true)
    try {
      await orpc.editor.redo()
      await refreshSession()
    } finally {
      setLoading(false)
    }
  }

  async function handleDiscard() {
    setLoading(true)
    try {
      await orpc.editor.discard()
      setConfirmAction(null)
      await refreshSession()
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish() {
    setLoading(true)
    try {
      await orpc.editor.publish()
      setConfirmAction(null)
      await refreshSession()
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await orpc.auth.logout()
    await refreshSession()
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-10001 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/90 px-2 py-2 shadow-xl backdrop-blur-md">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full"
          disabled={!canUndo || loading}
          onClick={handleUndo}
          title="Desfazer"
        >
          <RotateCcw className="size-4" />
          <span className="sr-only">Desfazer</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="rounded-full"
          disabled={!canRedo || loading}
          onClick={handleRedo}
          title="Refazer"
        >
          <RotateCw className="size-4" />
          <span className="sr-only">Refazer</span>
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Link to="/catalogo">
          <Button
            size="sm"
            variant="ghost"
            className="rounded-full"
            disabled={loading}
            title="Catálogo"
          >
            <Package className="size-4" />
            <span className="hidden sm:inline">Catálogo</span>
          </Button>
        </Link>

        {editor.tipo === "admin" ? (
          <Button
            size="sm"
            variant={usersOpen ? "secondary" : "ghost"}
            className="rounded-full"
            disabled={loading}
            onClick={() => setUsersOpen(true)}
            title="Usuários"
          >
            <Users className="size-4" />
            <span className="hidden sm:inline">Usuários</span>
          </Button>
        ) : null}

        <div className="mx-1 h-6 w-px bg-border" />

        {editorPage ? (
          <>
            <FloatBarContentMenu disabled={loading} />

            <div className="mx-1 h-6 w-px bg-border" />
          </>
        ) : null}

        <Button
          size="sm"
          variant="ghost"
          className="rounded-full"
          disabled={!hasDevChanges || loading}
          onClick={() => setConfirmAction("discard")}
          title="Descartar alterações"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Descartar</span>
        </Button>

        <Button
          size="sm"
          variant="default"
          className="rounded-full"
          disabled={!hasDevChanges || loading}
          onClick={() => setConfirmAction("publish")}
          title="Publicar alterações"
        >
          <Upload className="size-4" />
          <span className="hidden sm:inline">Publicar</span>
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button
          size="sm"
          variant="ghost"
          className="rounded-full"
          disabled={loading}
          onClick={handleLogout}
          title="Sair"
        >
          <LogOut className="size-4" />
          <span className="sr-only">Sair</span>
        </Button>
      </div>

      <ConfirmDialog
        open={confirmAction === "discard"}
        title="Descartar alterações?"
        description="Todas as alteraçõe serão removidas. Esta ação não pode ser desfeita."
        confirmLabel="Descartar"
        onConfirm={handleDiscard}
        onCancel={() => setConfirmAction(null)}
        loading={loading}
      />

      <ConfirmDialog
        open={confirmAction === "publish"}
        title="Publicar alterações?"
        description="Todas as alteraçõe serão aplicadas à no site."
        confirmLabel="Publicar"
        onConfirm={handlePublish}
        onCancel={() => setConfirmAction(null)}
        loading={loading}
      />

      {editor.tipo === "admin" ? (
        <UsersDrawer
          open={usersOpen}
          onOpenChange={setUsersOpen}
          currentEditorId={editor.id}
        />
      ) : null}
    </>
  )
}
