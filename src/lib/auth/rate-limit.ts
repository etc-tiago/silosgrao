import { eq } from "drizzle-orm"
import { ORPCError } from "@orpc/server"
import type { Db } from "@/db/client"
import { rateLimitBuckets } from "@/db/schema"

export async function checkRateLimit(
  db: Db,
  key: string,
  limit: number,
  windowMs: number
): Promise<void> {
  const now = Date.now()
  const existing = await db.query.rateLimitBuckets.findFirst({
    where: eq(rateLimitBuckets.key, key),
  })

  if (!existing || now - existing.windowStart.getTime() >= windowMs) {
    await db
      .insert(rateLimitBuckets)
      .values({ key, count: 1, windowStart: new Date(now), windowMs })
      .onConflictDoUpdate({
        target: rateLimitBuckets.key,
        set: { count: 1, windowStart: new Date(now), windowMs },
      })
    return
  }

  if (existing.count >= limit) {
    throw new ORPCError("TOO_MANY_REQUESTS", {
      message: "Muitas tentativas. Tente novamente mais tarde.",
    })
  }

  await db
    .update(rateLimitBuckets)
    .set({ count: existing.count + 1 })
    .where(eq(rateLimitBuckets.key, key))
}
