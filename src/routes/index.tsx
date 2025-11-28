import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { client as orpcClient } from '@/orpc/client'
import ArticleList from '@/components/ArticleList'
import ArticleForm from '@/components/ArticleForm'
import DateFilter from '@/components/DateFilter'

export const Route = createFileRoute('/')({ component: App })

interface Article {
  id: number
  title: string
  url: string | null
  source: string | null
  readAt: Date
  notes: string | null
}

function App() {
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | undefined>()
  const [dateFilter, setDateFilter] = useState<{
    startDate?: string
    endDate?: string
  }>({})

  const queryClient = useQueryClient()

  // Fetch articles with optional date filtering
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', dateFilter],
    queryFn: async () => {
      const result = await orpcClient.getArticles(dateFilter)
      return result as Article[]
    },
  })

  // Create article mutation
  const createMutation = useMutation({
    mutationFn: async (data: {
      title: string
      url?: string
      source?: string
      readAt: string
      notes?: string
    }) => {
      return await orpcClient.createArticle(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      setShowForm(false)
    },
  })

  // Update article mutation
  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: number
      title?: string
      url?: string
      source?: string
      readAt?: string
      notes?: string
    }) => {
      return await orpcClient.updateArticle(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      setEditingArticle(undefined)
    },
  })

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await orpcClient.deleteArticle({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })

  const handleAddArticle = () => {
    setEditingArticle(undefined)
    setShowForm(true)
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setShowForm(true)
  }

  const handleDeleteArticle = (id: number) => {
    deleteMutation.mutate(id)
  }

  const handleFormSubmit = (data: {
    title: string
    url?: string
    source?: string
    readAt: string
    notes?: string
  }) => {
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingArticle(undefined)
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-mono! mb-4 text-[#f2f2f2]">Today I Read</h1>
        <p className="text-lg text-gray-400 mb-6 leading-relaxed">
          Track your daily reading journey. Save articles, add notes, and build your knowledge library.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleAddArticle}
            className="text-[#f2f2f2] underline hover:no-underline"
          >
            Add Article
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Date Filter */}
        <DateFilter onFilterChange={setDateFilter} />

        {/* Articles List */}
        <ArticleList
          articles={articles}
          isLoading={isLoading}
          onEdit={handleEditArticle}
          onDelete={handleDeleteArticle}
        />
      </div>

      {/* Article Form Modal */}
      {showForm && (
        <ArticleForm
          article={editingArticle}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}

