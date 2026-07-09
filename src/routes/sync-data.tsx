import { ConfirmDialog } from "@/components/editor/confirm-dialog"
import { Button } from "@/components/ui/button"
import { getSessionEditor } from "@/lib/auth/session.server"
import { summarizeBundle } from "@/lib/sync-data/import"
import { siteDataBundleSchema } from "@/lib/sync-data/types"
import { getServerDb } from "@/lib/server/env"
import { orpc } from "@/orpc/browser-client"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Download, Upload } from "lucide-react"
import { useRef, useState } from "react"

const loadSyncDataAccess = createServerFn({ method: "GET" }).handler(async () => {
  const db = getServerDb()
  const editor = await getSessionEditor(db)

  return {
    isAdmin: editor?.tipo === "admin",
  }
})

export const Route = createFileRoute("/sync-data")({
  head: () => ({
    meta: [
      {
        name: "robots",
        content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
      },
      {
        name: "googlebot",
        content: "noindex, nofollow, noarchive, nosnippet, noimageindex",
      },
      {
        title: "Sincronização de dados",
      },
    ],
  }),
  loader: () => loadSyncDataAccess(),
  component: SyncDataPage,
})

function SyncDataPage() {
  const { isAdmin } = Route.useLoaderData()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pendingImport, setPendingImport] = useState<
    ReturnType<typeof siteDataBundleSchema.parse> | null
  >(null)
  const [pendingSummary, setPendingSummary] = useState<string | null>(null)

  async function handleExport() {
    setError(null)
    setSuccess(null)
    setExporting(true)

    try {
      const bundle = await orpc.syncData.export()
      const blob = new Blob([JSON.stringify(bundle, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `silosgraos-content-${new Date().toISOString().slice(0, 10)}.json`
      anchor.click()
      URL.revokeObjectURL(url)
      setSuccess("Exportação concluída.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao exportar dados.")
    } finally {
      setExporting(false)
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    setError(null)
    setSuccess(null)

    try {
      const text = await file.text()
      const parsed = siteDataBundleSchema.parse(JSON.parse(text))
      const summary = summarizeBundle(parsed)

      setPendingImport(parsed)
      setPendingSummary(
        `${summary.pages} páginas, ${summary.contentEntries} entradas de conteúdo, ${summary.catalogCategories} categorias e ${summary.catalogProducts} produtos (exportado em ${new Date(summary.exportedAt).toLocaleString("pt-BR")}).`
      )
    } catch {
      setError("Arquivo JSON inválido.")
    }
  }

  async function handleConfirmImport() {
    if (!pendingImport) return

    setImporting(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await orpc.syncData.import({
        bundle: pendingImport,
        confirmReplace: true,
      })

      setSuccess(
        `Importação concluída: ${result.pages} páginas, ${result.contentEntries} entradas, ${result.catalogCategories} categorias, ${result.catalogProducts} produtos e ${result.catalogProductImages} imagens de galeria.`
      )
      setPendingImport(null)
      setPendingSummary(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao importar dados.")
    } finally {
      setImporting(false)
    }
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center p-6">
        <div className="w-full rounded-2xl border bg-card p-8 text-center shadow-lg">
          <h1 className="text-xl font-semibold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta página é exclusiva para administradores autenticados.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center p-6">
      <div className="w-full space-y-6 rounded-2xl border bg-card p-8 shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Sincronização de dados</h1>
          <p className="text-sm text-muted-foreground">
            Exporte ou importe o conteúdo do CMS e do catálogo em um arquivo JSON.
            A importação substitui todo o conteúdo existente.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Download className="size-4" />
              Exportar
            </div>
            <p className="text-sm text-muted-foreground">
              Baixa páginas, entradas de conteúdo, categorias e produtos.
            </p>
            <Button
              type="button"
              className="w-full"
              onClick={handleExport}
              disabled={exporting || importing}
            >
              {exporting ? "Exportando..." : "Baixar JSON"}
            </Button>
          </section>

          <section className="space-y-3 rounded-xl border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Upload className="size-4" />
              Importar
            </div>
            <p className="text-sm text-muted-foreground">
              Carrega um arquivo exportado e substitui os dados atuais.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={exporting || importing}
            >
              Selecionar arquivo
            </Button>
          </section>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? <p className="text-sm text-primary">{success}</p> : null}
      </div>

      <ConfirmDialog
        open={pendingImport !== null}
        title="Substituir todo o conteúdo?"
        description={
          pendingSummary
            ? `Esta ação não pode ser desfeita. Serão importados: ${pendingSummary}`
            : "Esta ação não pode ser desfeita."
        }
        confirmLabel="Importar e substituir"
        onConfirm={handleConfirmImport}
        onCancel={() => {
          setPendingImport(null)
          setPendingSummary(null)
        }}
        loading={importing}
      />
    </main>
  )
}
