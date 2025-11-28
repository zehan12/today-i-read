import { Type, Link as LinkIcon, User, Calendar, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ArticleFormProps {
  article?: {
    id: string
    title: string
    url: string | null
    source: string | null
    readAt: Date
    notes: string | null
  }
  onSubmit: (data: {
    title: string
    url?: string
    source?: string
    readAt: string
    notes?: string
  }) => void
  onCancel: () => void
}

export default function ArticleForm({
  article,
  onSubmit,
  onCancel,
}: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title || '')
  const [url, setUrl] = useState(article?.url || '')
  const [source, setSource] = useState(article?.source || '')
  const [readAt, setReadAt] = useState(
    article?.readAt
      ? new Date(article.readAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  )
  const [notes, setNotes] = useState(article?.notes || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setUrl(article.url || '')
      setSource(article.source || '')
      setReadAt(new Date(article.readAt).toISOString().split('T')[0])
      setNotes(article.notes || '')
    } else {
      setTitle('')
      setUrl('')
      setSource('')
      setReadAt(new Date().toISOString().split('T')[0])
      setNotes('')
    }
  }, [article])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (url.trim() && !url.trim().match(/^https?:\/\/.+/)) {
      newErrors.url = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    onSubmit({
      title: title.trim(),
      url: url.trim() || undefined,
      source: source.trim() || undefined,
      readAt: new Date(readAt).toISOString(),
      notes: notes.trim() || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#121212] p-8 max-w-md w-full rounded-3xl shadow-2xl relative">
        <h2 className="text-3xl font-bold text-white mb-8">
          {article ? 'Edit Article' : 'New Article'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Type className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#2a2a2a] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Article Title"
              autoFocus
            />
          </div>
          {errors.title && (
            <p className="text-xs text-red-500 ml-4">{errors.title}</p>
          )}

          {/* URL Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <LinkIcon className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
            </div>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#2a2a2a] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="https://example.com/..."
            />
          </div>
          {errors.url && (
            <p className="text-xs text-red-500 ml-4">{errors.url}</p>
          )}

          <div className="flex gap-4">
            {/* Source Input */}
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#2a2a2a] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Source"
              />
            </div>

            {/* Date Input */}
            <div className="relative group w-40">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="date"
                id="readAt"
                value={readAt}
                onChange={(e) => setReadAt(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#2a2a2a] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all scheme-dark"
              />
            </div>
          </div>

          {/* Notes Input */}
          <div className="relative group">
            <div className="absolute top-3.5 left-0 pl-4 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
            </div>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full pl-12 pr-4 py-3.5 bg-[#2a2a2a] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder="Notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-full border border-blue-500 text-white font-semibold hover:bg-blue-500/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-full bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
            >
              {article ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
