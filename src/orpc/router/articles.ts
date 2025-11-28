import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db'
import { articles } from '@/db/schema'
import { eq, desc, gte, lte, and } from 'drizzle-orm'

// Schema for creating an article
const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url().optional().or(z.literal('')),
  source: z.string().optional(),
  readAt: z.string().optional(), // ISO date string
  notes: z.string().optional(),
})

// Schema for updating an article
const updateArticleSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required').optional(),
  url: z.string().url().optional().or(z.literal('')),
  source: z.string().optional(),
  readAt: z.string().optional(), // ISO date string
  notes: z.string().optional(),
})

// Schema for filtering articles
const filterArticlesSchema = z.object({
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
})

// Get all articles with optional date filtering
export const getArticles = os
  .input(filterArticlesSchema)
  .handler(async ({ input }) => {
    const conditions = []

    if (input.startDate) {
      conditions.push(gte(articles.readAt, new Date(input.startDate)))
    }
    if (input.endDate) {
      conditions.push(lte(articles.readAt, new Date(input.endDate)))
    }

    const result = await db
      .select()
      .from(articles)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(articles.readAt))

    return result
  })

// Get articles grouped by date
export const getArticlesByDate = os.input(z.object({})).handler(async () => {
  const allArticles = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.readAt))

  // Group articles by date (YYYY-MM-DD)
  const grouped = allArticles.reduce(
    (acc, article) => {
      const date = new Date(article.readAt)
      const dateKey = date.toISOString().split('T')[0]

      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(article)
      return acc
    },
    {} as Record<string, typeof allArticles>,
  )

  return grouped
})

// Create a new article
export const createArticle = os
  .input(createArticleSchema)
  .handler(async ({ input }) => {
    const result = await db
      .insert(articles)
      .values({
        title: input.title,
        url: input.url || null,
        source: input.source || null,
        readAt: input.readAt ? new Date(input.readAt) : new Date(),
        notes: input.notes || null,
      })
      .returning()

    return result[0]
  })

// Update an existing article
export const updateArticle = os
  .input(updateArticleSchema)
  .handler(async ({ input }) => {
    const { id, ...updates } = input

    const updateData: Record<string, any> = {}
    
    if (updates.title) updateData.title = updates.title
    if (updates.url !== undefined) updateData.url = updates.url || null
    if (updates.source !== undefined) updateData.source = updates.source || null
    if (updates.readAt) updateData.readAt = new Date(updates.readAt)
    if (updates.notes !== undefined) updateData.notes = updates.notes || null

    const result = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning()

    return result[0]
  })

// Delete an article
export const deleteArticle = os
  .input(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    await db.delete(articles).where(eq(articles.id, input.id))
    return { success: true }
  })

