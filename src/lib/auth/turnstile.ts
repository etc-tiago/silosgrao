import { ORPCError } from "@orpc/server"

interface SiteverifyResponse {
  success: boolean
  "error-codes"?: string[]
}

export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteip?: string
): Promise<void> {
  const body = new URLSearchParams({
    secret,
    response: token,
  })

  if (remoteip) {
    body.set("remoteip", remoteip)
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body }
  )

  if (!response.ok) {
    throw new ORPCError("BAD_REQUEST", {
      message: "Falha ao validar Turnstile.",
    })
  }

  const data = (await response.json()) as SiteverifyResponse

  if (!data.success) {
    throw new ORPCError("BAD_REQUEST", {
      message: "Verificação Turnstile inválida.",
    })
  }
}
