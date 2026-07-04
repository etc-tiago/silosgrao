import { env } from "cloudflare:workers"
import type { Env } from "@/env"
import { getDb } from "@/db/client"

export function getWorkerEnv(): Env {
  return env as unknown as Env
}

export function getServerDb() {
  return getDb(getWorkerEnv().DB)
}
