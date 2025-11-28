import ArticleCard from './ArticleCard'
import { BookOpen } from 'lucide-react'

interface Article {
  id: number
  title: string
  url: string | null
  source: string | null
  readAt: Date
  notes: string | null
}

interface ArticleListProps {
  articles: Article[]
  isLoading?: boolean
  onEdit: (article: Article) => void
  onDelete: (id: number) => void
}

export default function ArticleList({
  articles,
  isLoading,
  onEdit,
  onDelete,
}: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-slate-800/50 rounded-full p-6 mb-4">
          <BookOpen className="w-12 h-12 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          No articles yet
        </h3>
        <p className="text-gray-500">
          Start tracking your reading journey by adding your first article!
        </p>
      </div>
    )
  }

  // Group articles by date
  const groupedArticles = articles.reduce(
    (acc, article) => {
      const date = new Date(article.readAt)
      const dateKey = date.toISOString().split('T')[0]

      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(article)
      return acc
    },
    {} as Record<string, Article[]>,
  )

  const sortedDates = Object.keys(groupedArticles).sort((a, b) =>
    b.localeCompare(a),
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const isToday = date.toDateString() === today.toDateString()
    const isYesterday = date.toDateString() === yesterday.toDateString()

    if (isToday) return 'Today'
    if (isYesterday) return 'Yesterday'

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-12">
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          <h2 className="text-xl font-serif text-[#f2f2f2] mb-4 border-b border-gray-800 pb-2">
            {formatDate(dateKey)}
          </h2>
          <div className="space-y-2">
            {groupedArticles[dateKey].map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
