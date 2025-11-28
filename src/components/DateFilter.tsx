
import { useState } from 'react'

interface DateFilterProps {
  onFilterChange: (filter: {
    startDate?: string
    endDate?: string
  }) => void
}

type FilterType = 'all' | 'today' | 'week' | 'month' | 'custom'

export default function DateFilter({ onFilterChange }: DateFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [showCustom, setShowCustom] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleQuickFilter = (type: FilterType) => {
    setActiveFilter(type)
    setShowCustom(false)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (type) {
      case 'all':
        onFilterChange({})
        break
      case 'today':
        onFilterChange({
          startDate: today.toISOString(),
          endDate: new Date().toISOString(),
        })
        break
      case 'week': {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        onFilterChange({
          startDate: weekAgo.toISOString(),
          endDate: new Date().toISOString(),
        })
        break
      }
      case 'month': {
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        onFilterChange({
          startDate: monthAgo.toISOString(),
          endDate: new Date().toISOString(),
        })
        break
      }
      case 'custom':
        setShowCustom(true)
        break
    }
  }

  const handleCustomFilter = () => {
    if (startDate || endDate) {
      onFilterChange({
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      })
    }
  }

  const clearCustomFilter = () => {
    setStartDate('')
    setEndDate('')
    setShowCustom(false)
    setActiveFilter('all')
    onFilterChange({})
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 text-sm items-baseline">
        <span className="text-gray-500 font-medium select-none">Filter:</span>
        {(['all', 'today', 'week', 'month', 'custom'] as const).map((type) => (
          <button
            key={type}
            onClick={() => handleQuickFilter(type)}
            className={`hover:text-[#f2f2f2] capitalize transition-colors ${
              activeFilter === type
                ? 'text-[#f2f2f2] font-bold underline decoration-2 underline-offset-4'
                : 'text-gray-400'
            }`}
          >
            {type === 'week'
              ? 'This Week'
              : type === 'month'
              ? 'This Month'
              : type}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="mt-4 p-4 border border-gray-800 bg-black/50 max-w-md">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent border-b border-gray-700 py-1 text-[#f2f2f2] text-sm focus:border-gray-500 outline-none transition-colors scheme-dark"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent border-b border-gray-700 py-1 text-[#f2f2f2] text-sm focus:border-gray-500 outline-none transition-colors scheme-dark"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCustomFilter}
              className="text-[#f2f2f2] text-sm hover:underline font-medium"
            >
              Apply
            </button>
            <button
              onClick={clearCustomFilter}
              className="text-gray-500 text-sm hover:text-gray-400"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
