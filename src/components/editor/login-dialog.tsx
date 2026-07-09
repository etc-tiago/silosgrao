import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { orpc } from "@/orpc/browser-client"

export function LoginDialog() {
  const navigate = useNavigate()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRequestOtp(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await orpc.auth.requestOtp({ email })
      setStep("otp")
    } catch {
      setError("Não foi possível enviar o código. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await orpc.auth.verifyOtp({ email, code })
      await navigate({ to: "/" })
    } catch {
      setError("Código inválido ou expirado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md items-center justify-center p-6">
      <div className="w-full space-y-6 rounded-2xl border bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Entrar como editor</h1>
          <p className="text-sm text-muted-foreground">
            {step === "email"
              ? "Informe seu email para receber um código de acesso."
              : "Digite o código enviado para seu email."}
          </p>
        </div>

        {step === "email" ? (
          <form className="space-y-4" onSubmit={handleRequestOtp}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="seu@email.com"
              />
            </label>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar código"}
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <label className="block space-y-2">
              <span className="text-sm font-medium">Código OTP</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg border bg-background px-3 py-2 text-center text-lg tracking-[0.4em] ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="000000"
              />
            </label>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verificando..." : "Entrar"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setStep("email")
                setCode("")
              }}
            >
              Voltar
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
