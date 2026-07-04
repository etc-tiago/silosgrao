import { relations, sql } from "drizzle-orm"
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

export const editorTipoEnum = ["admin", "usuario"] as const
export type EditorTipo = (typeof editorTipoEnum)[number]

export const contentTypeEnum = ["text", "richtext", "image", "json"] as const
export type ContentType = (typeof contentTypeEnum)[number]

export const environmentEnum = ["prod", "dev"] as const
export type Environment = (typeof environmentEnum)[number]

export const changeOperationEnum = ["set", "delete"] as const
export type ChangeOperation = (typeof changeOperationEnum)[number]

export const editores = sqliteTable(
  "editores",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    tipo: text("tipo", { enum: editorTipoEnum }).notNull(),
    hash: text("hash").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex("editores_email_unique").on(table.email),
    uniqueIndex("editores_hash_unique").on(table.hash),
  ]
)

export const pages = sqliteTable(
  "pages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [uniqueIndex("pages_slug_unique").on(table.slug)]
)

export const contentEntries = sqliteTable(
  "content_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    pageId: integer("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    path: text("path").notNull(),
    type: text("type", { enum: contentTypeEnum }).notNull(),
    value: text("value").notNull(),
    environment: text("environment", { enum: environmentEnum }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedBy: integer("updated_by").references(() => editores.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    uniqueIndex("content_entries_page_path_env_unique").on(
      table.pageId,
      table.path,
      table.environment
    ),
    index("content_entries_environment_idx").on(table.environment),
  ]
)

export const changeLog = sqliteTable(
  "change_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    editorId: integer("editor_id")
      .notNull()
      .references(() => editores.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(),
    pageId: integer("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    path: text("path").notNull(),
    operation: text("operation", { enum: changeOperationEnum }).notNull(),
    beforeValue: text("before_value"),
    afterValue: text("after_value"),
    undoneAt: integer("undone_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("change_log_editor_sequence_idx").on(table.editorId, table.sequence),
    index("change_log_undone_at_idx").on(table.undoneAt),
  ]
)

export const otpChallenges = sqliteTable(
  "otp_challenges",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    codeHash: text("code_hash").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [index("otp_challenges_email_idx").on(table.email)]
)

export const sessions = sqliteTable(
  "sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    editorId: integer("editor_id")
      .notNull()
      .references(() => editores.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
    index("sessions_editor_id_idx").on(table.editorId),
  ]
)

export const rateLimitBuckets = sqliteTable("rate_limit_buckets", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: integer("window_start", { mode: "timestamp_ms" }).notNull(),
  windowMs: integer("window_ms").notNull(),
})

export const editoresRelations = relations(editores, ({ many }) => ({
  sessions: many(sessions),
  changeLogs: many(changeLog),
  contentEntries: many(contentEntries),
}))

export const pagesRelations = relations(pages, ({ many }) => ({
  contentEntries: many(contentEntries),
  changeLogs: many(changeLog),
}))

export const contentEntriesRelations = relations(contentEntries, ({ one }) => ({
  page: one(pages, {
    fields: [contentEntries.pageId],
    references: [pages.id],
  }),
  editor: one(editores, {
    fields: [contentEntries.updatedBy],
    references: [editores.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  editor: one(editores, {
    fields: [sessions.editorId],
    references: [editores.id],
  }),
}))

export type Editor = typeof editores.$inferSelect
export type Page = typeof pages.$inferSelect
export type ContentEntry = typeof contentEntries.$inferSelect
export type ChangeLogEntry = typeof changeLog.$inferSelect
