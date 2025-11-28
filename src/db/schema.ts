import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const todos = sqliteTable('todos', {
  id: integer('id', { mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  title: text('title').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`,
  ),
})

export const articles = sqliteTable('articles', {
  id: integer('id', { mode: 'number' }).primaryKey({
    autoIncrement: true,
  }),
  title: text('title').notNull(),
  url: text('url'),
  source: text('source'),
  readAt: integer('read_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})
