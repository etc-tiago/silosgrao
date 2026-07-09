import { sql } from "drizzle-orm"
import type { Db } from "@/db/client"

type DbExecutor = Pick<Db, "run">

export function buildFtsQuery(search: string) {
  const terms = search
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\s+/)
    .map((term) => term.replace(/[^a-z0-9]+/g, ""))
    .filter((term) => term.length >= 2)

  if (terms.length === 0) return null

  return terms.map((term) => `"${term}"*`).join(" AND ")
}

export async function syncProductFts(
  db: DbExecutor,
  productId: number,
  title: string,
  description: string | null
) {
  await db.run(
    sql`DELETE FROM catalog_products_fts WHERE rowid = ${productId}`
  )
  await db.run(
    sql`INSERT INTO catalog_products_fts(rowid, title, description) VALUES (${productId}, ${title}, ${description ?? ""})`
  )
}

export async function deleteProductFts(db: DbExecutor, productId: number) {
  await db.run(sql`DELETE FROM catalog_products_fts WHERE rowid = ${productId}`)
}
