'use client'

import { RateStatus, formatTime } from '../types'

interface HeaderProps {
  onLogoClick: () => void
  rateStatus: RateStatus
  countdown: number | null
  historyCount: number
  onHistoryClick: () => void
}

export default function Header({
  onLogoClick,
  rateStatus,
  countdown,
  historyCount,
  onHistoryClick,
}: HeaderProps) {
  const isLimited = rateStatus === 'limited'

  return (
    <header className="border-b border-gray-800 px-6 py-4 sticky top-0 bg-gray-950 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold">
            DB
          </div>
          <div className="text-left">
            <h1 className="text-base font-semibold">DB Assistant</h1>
            <p className="text-xs text-gray-500">Генератор баз даних на основі AI</p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isLimited
              ? 'border-red-800 bg-red-950 text-red-400'
              : 'border-green-800 bg-green-950 text-green-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isLimited ? 'bg-red-500' : 'bg-green-500 animate-pulse'
            }`} />
            {isLimited
              ? `Ліміт вичерпано${countdown ? ` · ${formatTime(countdown)}` : ''}`
              : 'AI готовий'
            }
          </div>

          {historyCount > 0 && (
            <button
              onClick={onHistoryClick}
              className="text-xs text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              🕐 Історія ({historyCount})
            </button>
          )}
        </div>
      </div>

      {isLimited && (
        <div className="max-w-5xl mx-auto mt-2 flex items-center gap-3">
          <span className="text-red-400 text-xs">
            ⚠ Денний ліміт токенів Groq вичерпано.
          </span>
          {countdown !== null && (
            <span className="text-red-300 text-xs">
              Відновлення через: <span className="font-bold text-white">{formatTime(countdown)}</span>
            </span>
          )}
        </div>
      )}
    </header>
  )
}