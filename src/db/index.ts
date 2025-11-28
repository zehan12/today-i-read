import { config } from 'dotenv'
import mongoose from 'mongoose'

config()

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined')
}

// Global variable to cache the connection across hot reloads in development
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(process.env.MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export const db = {
  connect: connectToDatabase
}

