'use client'

import { HistoryItem } from '../types'

interface HistoryPanelProps {
  history: HistoryItem[]
  onLoad: (item: HistoryItem) => void
  onClear: () => void
}

export default function HistoryPanel({ history, onLoad, onClear }: HistoryPanelProps) {
  if (history.length === 0) return null

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium">Останні запити</span>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Очистити
        </button>
      </div>
      <div className="space-y-2">
        {history.map(item => (
          <button
            key={item.id}
            onClick={() => onLoad(item)}
            className="w-full text-left px-3 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm truncate flex-1">{item.domain}</span>
              <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded ml-2 flex-shrink-0">
                {item.dbType}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{item.createdAt}</div>
          </button>
        ))}
      </div>
    </div>
  )
}