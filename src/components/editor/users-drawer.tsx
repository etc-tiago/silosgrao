import { ConfirmDialog } from "@/components/editor/confirm-dialog"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { EditorTipo } from "@/db/schema"
import { cn } from "@/lib/utils"
import { orpc } from "@/orpc/browser-client"
import { Shield, User, UserMinus } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type PublicEditor = {
  id: number
  email: string
  tipo: EditorTipo
  createdAt: Date
}

type UsersDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentEditorId: number
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

function RoleBadge({ tipo }: { tipo: EditorTipo }) {
  const isAdmin = tipo === "admin"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isAdmin
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {isAdmin ? <Shield className="size-3" /> : <User className="size-3" />}
      {isAdmin ? "Admin" : "Usuário"}
    </span>
  )
}

export function UsersDrawer({
  open,
  onOpenChange,
  currentEditorId,
}: UsersDrawerProps) {
  const [users, setUsers] = useState<PublicEditor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteTipo, setInviteTipo] = useState<EditorTipo>("usuario")
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<PublicEditor | null>(null)
  const [revoking, setRevoking] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await orpc.users.list()
      setUsers(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar usuários.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    void loadUsers()
    setInviteSuccess(null)
    setError(null)
  }, [open, loadUsers])

  async function handleInvite(event: React.FormEvent) {
    event.preventDefault()
    setInviting(true)
    setError(null)
    setInviteSuccess(null)

    try {
      const created = await orpc.users.invite({
        email: inviteEmail,
        tipo: inviteTipo,
      })
      setUsers((current) => {
        const without = current.filter((user) => user.id !== created.id)
        return [...without, created].sort((a, b) =>
          a.email.localeCompare(b.email)
        )
      })
      setInviteEmail("")
      setInviteTipo("usuario")
      setInviteSuccess(`Convite enviado para ${created.email}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar convite.")
    } finally {
      setInviting(false)
    }
  }

  async function handleRevoke() {
    if (!revokeTarget) return

    setRevoking(true)
    setError(null)

    try {
      await orpc.users.revoke({ editorId: revokeTarget.id })
      setUsers((current) =>
        current.filter((user) => user.id !== revokeTarget.id)
      )
      setRevokeTarget(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao revogar acesso.")
    } finally {
      setRevoking(false)
    }
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="right">
        <DrawerContent className="h-full max-h-dvh [--drawer-content-width:min(28rem,100vw)]">
          <DrawerHeader className="border-b pb-4">
            <DrawerTitle>Usuários</DrawerTitle>
            <DrawerDescription>
              Convide novos editores e gerencie o acesso ao CMS.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
            <form onSubmit={handleInvite} className="space-y-3 rounded-2xl border p-4">
              <p className="text-sm font-medium">Convidar usuário</p>

              <div className="space-y-2">
                <label htmlFor="invite-email" className="text-xs text-muted-foreground">
                  Email
                </label>
                <input
                  id="invite-email"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="nome@empresa.com"
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Papel</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteTipo("usuario")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                      inviteTipo === "usuario"
                        ? "border-primary bg-primary/5 text-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <User className="size-4" />
                    Usuário
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteTipo("admin")}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors",
                      inviteTipo === "admin"
                        ? "border-primary bg-primary/5 text-primary"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Shield className="size-4" />
                    Admin
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={inviting}>
                {inviting ? "Enviando..." : "Enviar convite"}
              </Button>

              {inviteSuccess ? (
                <p className="text-xs text-primary">{inviteSuccess}</p>
              ) : null}
            </form>

            {error ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Usuários ativos</p>
                <span className="text-xs text-muted-foreground">
                  {users.length}
                </span>
              </div>

              {loading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum usuário ativo.
                </p>
              ) : (
                <ul className="space-y-2">
                  {users.map((user) => {
                    const isSelf = user.id === currentEditorId

                    return (
                      <li
                        key={user.id}
                        className="flex items-center gap-3 rounded-xl border bg-background p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {user.email}
                            {isSelf ? (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (você)
                              </span>
                            ) : null}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <RoleBadge tipo={user.tipo} />
                            <span className="text-xs text-muted-foreground">
                              desde {formatDate(user.createdAt)}
                            </span>
                          </div>
                        </div>

                        {!isSelf ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="shrink-0"
                            onClick={() => setRevokeTarget(user)}
                          >
                            <UserMinus className="size-4" />
                            <span className="sr-only">Revogar</span>
                          </Button>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="border-t p-4">
            <DrawerClose
              render={<Button variant="outline" className="w-full" />}
            >
              Fechar
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>

      <ConfirmDialog
        open={revokeTarget != null}
        title="Revogar acesso?"
        description={
          revokeTarget
            ? `${revokeTarget.email} perderá o acesso imediatamente e não poderá mais entrar no CMS.`
            : ""
        }
        confirmLabel="Revogar"
        onConfirm={handleRevoke}
        onCancel={() => setRevokeTarget(null)}
        loading={revoking}
      />
    </>
  )
}
