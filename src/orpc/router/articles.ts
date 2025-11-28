import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db'
import { Article } from '@/db/schema'

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
  id: z.string(),
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
    await db.connect()

    const query: any = {}

    if (input.startDate || input.endDate) {
      query.readAt = {}
      if (input.startDate) {
        query.readAt.$gte = new Date(input.startDate)
      }
      if (input.endDate) {
        query.readAt.$lte = new Date(input.endDate)
      }
    }

    const articles = await Article.find(query).sort({ readAt: -1 })

    return articles.map(article => ({
      id: article._id.toString(),
      title: article.title,
      url: article.url,
      source: article.source,
      readAt: article.readAt,
      notes: article.notes,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    }))
  })

// Get articles grouped by date
export const getArticlesByDate = os.input(z.object({})).handler(async () => {
  await db.connect()
  
  const allArticles = await Article.find().sort({ readAt: -1 })

  // Group articles by date (YYYY-MM-DD)
  const grouped = allArticles.reduce(
    (acc, article) => {
      const date = new Date(article.readAt)
      const dateKey = date.toISOString().split('T')[0]

      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      
      acc[dateKey].push({
        id: article._id.toString(),
        title: article.title,
        url: article.url,
        source: article.source,
        readAt: article.readAt,
        notes: article.notes,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      })
      return acc
    },
    {} as Record<string, any[]>,
  )

  return grouped
})

// Create a new article
export const createArticle = os
  .input(createArticleSchema)
  .handler(async ({ input }) => {
    await db.connect()

    const newArticle = await Article.create({
      title: input.title,
      url: input.url || undefined,
      source: input.source || undefined,
      readAt: input.readAt ? new Date(input.readAt) : new Date(),
      notes: input.notes || undefined,
    })

    return {
      id: newArticle._id.toString(),
      title: newArticle.title,
      url: newArticle.url,
      source: newArticle.source,
      readAt: newArticle.readAt,
      notes: newArticle.notes,
      createdAt: newArticle.createdAt,
      updatedAt: newArticle.updatedAt
    }
  })

// Update an existing article
export const updateArticle = os
  .input(updateArticleSchema)
  .handler(async ({ input }) => {
    await db.connect()
    
    const { id, ...updates } = input

    const updateData: any = {}
    
    if (updates.title) updateData.title = updates.title
    if (updates.url !== undefined) updateData.url = updates.url || undefined
    if (updates.source !== undefined) updateData.source = updates.source || undefined
    if (updates.readAt) updateData.readAt = new Date(updates.readAt)
    if (updates.notes !== undefined) updateData.notes = updates.notes || undefined

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    if (!updatedArticle) {
      throw new Error('Article not found')
    }

    return {
      id: updatedArticle._id.toString(),
      title: updatedArticle.title,
      url: updatedArticle.url,
      source: updatedArticle.source,
      readAt: updatedArticle.readAt,
      notes: updatedArticle.notes,
      createdAt: updatedArticle.createdAt,
      updatedAt: updatedArticle.updatedAt
    }
  })

// Delete an article
export const deleteArticle = os
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    await db.connect()
    await Article.findByIdAndDelete(input.id)
    return { success: true }
  })


