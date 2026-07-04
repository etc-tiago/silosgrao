/// Re-export Cloudflare generated bindings
interface Env {
  DB: D1Database
  EMAIL: SendEmail
  OTP_FROM_EMAIL: string
  TURNSTILE_SITE_KEY: string
  TURNSTILE_SECRET_KEY: string
  SESSION_SECRET?: string
}

export type { Env }
