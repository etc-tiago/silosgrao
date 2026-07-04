import { sha256 } from "@noble/hashes/sha2.js"
import { bytesToHex } from "@noble/hashes/utils.js"

export function hashValue(value: string): string {
  return bytesToHex(sha256(new TextEncoder().encode(value)))
}

export function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return bytesToHex(bytes)
}

export function generateOtpCode(): string {
  const num = crypto.getRandomValues(new Uint32Array(1))[0]! % 1_000_000
  return num.toString().padStart(6, "0")
}

export function editorHashFromEmail(email: string): string {
  return hashValue(`editor:${email.toLowerCase()}`)
}
