import { useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { RotateCcw, RotateCw, Trash2, Upload, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/editor/confirm-dialog"
import { orpc } from "@/orpc/browser-client"
import { refreshEditorData } from "@/lib/content/refresh-editor-data"

interface FloatBarProps {
  canUndo: boolean
  canRedo: boolean
  hasDevChanges: boolean
}

export function FloatBar({ canUndo, canRedo, hasDevChanges }: FloatBarProps) {
  const router = useRouter()
  const [confirmAction, setConfirmAction] = useState<
    "discard" | "publish" | null
  >(null)
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
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/90 px-2 py-2 shadow-xl backdrop-blur-md">
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
        description="Todas as alterações em modo dev serão removidas. Esta ação não pode ser desfeita."
        confirmLabel="Descartar"
        onConfirm={handleDiscard}
        onCancel={() => setConfirmAction(null)}
        loading={loading}
      />

      <ConfirmDialog
        open={confirmAction === "publish"}
        title="Publicar alterações?"
        description="Todas as alterações em modo dev serão aplicadas à produção."
        confirmLabel="Publicar"
        onConfirm={handlePublish}
        onCancel={() => setConfirmAction(null)}
        loading={loading}
      />
    </>
  )
}
