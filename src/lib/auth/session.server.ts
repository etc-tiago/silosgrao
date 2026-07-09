import { and, eq, gt } from "drizzle-orm"
import {
  deleteCookie,
  getCookie,
  setCookie,
} from "@tanstack/react-start/server"
import type { Db } from "@/db/client"
import { sessions } from "@/db/schema"
import type { Editor } from "@/db/schema"
import { isActiveEditor } from "@/lib/auth/editor"
import { generateToken, hashValue } from "@/lib/crypto"

export const SESSION_COOKIE = "editor_session"
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

export async function createSession(db: Db, editorId: number) {
  const token = generateToken()
  const tokenHash = hashValue(`session:${token}`)
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)

  await db.insert(sessions).values({
    editorId,
    tokenHash,
    expiresAt,
  })

  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  })

  return token
}

export async function getSessionEditor(db: Db): Promise<Editor | null> {
  const token = getCookie(SESSION_COOKIE)
  if (!token) return null

  const tokenHash = hashValue(`session:${token}`)
  const session = await db.query.sessions.findFirst({
    where: and(
      eq(sessions.tokenHash, tokenHash),
      gt(sessions.expiresAt, new Date())
    ),
    with: { editor: true },
  })

  if (!session) return null

  const editor = session.editor as Editor
  if (!isActiveEditor(editor)) {
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash))
    deleteCookie(SESSION_COOKIE, { path: "/" })
    return null
  }

  return editor
}

export async function destroyEditorSessions(db: Db, editorId: number) {
  await db.delete(sessions).where(eq(sessions.editorId, editorId))
}

export async function destroySession(db: Db) {
  const token = getCookie(SESSION_COOKIE)
  if (token) {
    const tokenHash = hashValue(`session:${token}`)
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash))
  }

  deleteCookie(SESSION_COOKIE, { path: "/" })
}
