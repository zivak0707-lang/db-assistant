'use client'

import { DB_TYPES, EXAMPLES } from '../types'

interface InputSectionProps {
  domain: string
  dbType: string
  loading: boolean
  isLimited: boolean
  countdown: number | null
  error: string
  onDomainChange: (val: string) => void
  onDbTypeChange: (val: string) => void
  onGenerate: () => void
}

export default function InputSection({
  domain,
  dbType,
  loading,
  isLimited,
  countdown,
  error,
  onDomainChange,
  onDbTypeChange,
  onGenerate,
}: InputSectionProps) {
  const buttonDisabled = loading || !domain.trim() || isLimited

  function getButtonLabel() {
    if (loading) return '⏳ Генерація...'
    if (isLimited && countdown) return `⏳ Доступно через ${countdown}с`
    if (isLimited) return '⏳ Ліміт вичерпано'
    return '✨ Згенерувати базу даних'
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Опишіть предметну область
      </label>

      <textarea
        value={domain}
        onChange={e => onDomainChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && e.ctrlKey && !buttonDisabled && onGenerate()}
        placeholder="Наприклад: система управління бібліотекою з книгами, авторами, читачами та видачею книг..."
        className="w-full h-28 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
      />

      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500">Приклади:</span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => onDomainChange(ex)}
            className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
          >
            {ex.split(' з ')[0]}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-gray-400 flex-shrink-0">Тип БД:</span>
        <div className="flex gap-2">
          {DB_TYPES.map(type => (
            <button
              key={type}
              onClick={() => onDbTypeChange(type)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                dbType === type
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={buttonDisabled}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        {getButtonLabel()}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-950 border border-red-800 rounded-lg text-sm text-red-400">
          ❌ {error}
        </div>
      )}
    </div>
  )
}