'use client'

interface TabSeedProps {
  seedSQL: string
  loading: boolean
  isLimited: boolean
  copied: boolean
  onGenerate: () => void
  onCopy: () => void
  onDownload: () => void
}

export default function TabSeed({
  seedSQL,
  loading,
  isLimited,
  copied,
  onGenerate,
  onCopy,
  onDownload,
}: TabSeedProps) {
  if (!seedSQL) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-400 mb-4">
          Згенеруй реалістичні тестові дані (INSERT) для всіх таблиць
        </p>
        <button
          onClick={onGenerate}
          disabled={loading || isLimited}
          className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading ? '⏳ Генерація...' : isLimited ? '⏳ Ліміт вичерпано' : '🌱 Згенерувати тестові дані'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-gray-500">INSERT дані для тестування</span>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md transition-colors"
          >
            {copied ? '✓ Скопійовано!' : 'Копіювати'}
          </button>
          <button
            onClick={onDownload}
            className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-md transition-colors"
          >
            ⬇ Завантажити
          </button>
          <button
            onClick={onGenerate}
            disabled={loading || isLimited}
            className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-3 py-1.5 rounded-md transition-colors"
          >
            {loading ? '⏳' : '🔄 Перегенерувати'}
          </button>
        </div>
      </div>
      <pre className="text-xs text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto leading-relaxed">
        {seedSQL}
      </pre>
    </div>
  )
}