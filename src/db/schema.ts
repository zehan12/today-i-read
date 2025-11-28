import mongoose, { Schema, type Document } from 'mongoose'

export interface IArticle extends Document {
  title: string
  url?: string
  source?: string
  readAt: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    url: { type: String },
    source: { type: String },
    readAt: { type: Date, required: true, default: Date.now },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
)

// Prevent overwriting the model if it's already compiled
export const Article = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema)

