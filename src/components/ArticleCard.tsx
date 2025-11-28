

interface ArticleCardProps {
  article: {
    id: number
    title: string
    url: string | null
    source: string | null
    readAt: Date
    notes: string | null
  }
  onEdit: (article: ArticleCardProps['article']) => void
  onDelete: (id: number) => void
}

export default function ArticleCard({
  article,
  onEdit,
  onDelete,
}: ArticleCardProps) {


  return (
    <div className="group py-1">
      <div className="flex flex-wrap items-baseline gap-x-3">
        {article.url ? (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f2f2f2] underline hover:no-underline font-medium"
          >
            {article.title}
          </a>
        ) : (
          <span className="text-[#f2f2f2] font-medium">{article.title}</span>
        )}

        {article.source && (
          <span className="text-gray-500 text-sm">({article.source})</span>
        )}

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm select-none">
          <button
            onClick={() => onEdit(article)}
            className="text-gray-500 hover:text-[#f2f2f2]"
          >
            [edit]
          </button>
          <button
            onClick={() => onDelete(article.id)}
            className="text-gray-500 hover:text-red-400"
          >
            [delete]
          </button>
        </div>
      </div>

      {article.notes && (
        <div className="mt-1 ml-4 text-gray-400 text-sm font-mono">
          // {article.notes}
        </div>
      )}
    </div>
  )
}
