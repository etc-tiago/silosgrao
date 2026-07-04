import { and, desc, eq, gt } from "drizzle-orm"
import type { Db } from "@/db/client"
import { otpChallenges } from "@/db/schema"
import { generateOtpCode, hashValue } from "@/lib/crypto"

const OTP_TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

export async function createOtpChallenge(db: Db, email: string) {
  const normalizedEmail = email.toLowerCase().trim()
  const code = generateOtpCode()
  const codeHash = hashValue(`otp:${normalizedEmail}:${code}`)
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)

  await db.delete(otpChallenges).where(eq(otpChallenges.email, normalizedEmail))

  await db.insert(otpChallenges).values({
    email: normalizedEmail,
    codeHash,
    expiresAt,
    attempts: 0,
  })

  return { code, expiresAt }
}

export async function verifyOtpChallenge(
  db: Db,
  email: string,
  code: string
): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim()
  const challenge = await db.query.otpChallenges.findFirst({
    where: and(
      eq(otpChallenges.email, normalizedEmail),
      gt(otpChallenges.expiresAt, new Date())
    ),
    orderBy: desc(otpChallenges.createdAt),
  })

  if (!challenge) {
    return false
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    return false
  }

  const codeHash = hashValue(`otp:${normalizedEmail}:${code}`)
  const valid = codeHash === challenge.codeHash

  await db
    .update(otpChallenges)
    .set({ attempts: challenge.attempts + 1 })
    .where(eq(otpChallenges.id, challenge.id))

  if (valid) {
    await db.delete(otpChallenges).where(eq(otpChallenges.id, challenge.id))
  }

  return valid
}
