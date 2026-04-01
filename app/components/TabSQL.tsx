'use client'

interface TabSQLProps {
  sql: string
  dbType: string
  copied: boolean
  onCopy: () => void
  onDownload: () => void
}

export default function TabSQL({ sql, dbType, copied, onCopy, onDownload }: TabSQLProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-gray-500">{dbType} DDL</span>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md transition-colors"
          >
            {copied ? '✓ Скопійовано!' : 'Копіювати'}
          </button>
          <button
            onClick={onDownload}
            className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition-colors"
          >
            ⬇ Завантажити .sql
          </button>
        </div>
      </div>
      <pre className="text-xs text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto leading-relaxed">
        {sql}
      </pre>
    </div>
  )
}