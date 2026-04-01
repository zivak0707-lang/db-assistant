'use client'

import { NormalizeResult, NormalizeIssue } from '../types'

interface TabNormalizeProps {
  normalizeResult: NormalizeResult | null
  loading: boolean
  isLimited: boolean
  fixingIssue: number | null
  onCheck: () => void
  onFix: (issue: NormalizeIssue, idx: number) => void
}

export default function TabNormalize({
  normalizeResult,
  loading,
  isLimited,
  fixingIssue,
  onCheck,
  onFix,
}: TabNormalizeProps) {
  if (!normalizeResult) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-400 mb-2">
          AI перевірить схему на відповідність нормальним формам
        </p>
        <p className="text-xs text-gray-500 mb-4">
          1НФ, 2НФ, 3НФ, BCNF — з поясненнями та автовиправленням
        </p>
        <button
          onClick={onCheck}
          disabled={loading || isLimited}
          className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading ? '⏳ Аналіз...' : isLimited ? '⏳ Ліміт вичерпано' : '🔍 Перевірити нормалізацію'}
        </button>
      </div>
    )
  }

  const scoreColor =
    normalizeResult.score >= 80 ? 'text-green-400'
      : normalizeResult.score >= 60 ? 'text-yellow-400'
      : 'text-red-400'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
        <div className="text-center min-w-12">
          <div className={`text-3xl font-bold ${scoreColor}`}>{normalizeResult.score}</div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">
            Рівень: <span className={scoreColor}>{normalizeResult.overall}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{normalizeResult.summary}</div>
        </div>
        <button
          onClick={onCheck}
          disabled={loading || isLimited}
          className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-3 py-1.5 rounded-md transition-colors flex-shrink-0"
        >
          🔄 Перевірити знову
        </button>
      </div>

      {normalizeResult.issues.length === 0 ? (
        <div className="p-4 bg-green-950 border border-green-800 rounded-lg text-sm text-green-400">
          ✅ Схема відповідає нормальним формам. Проблем не знайдено.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-400">
            Знайдені проблеми ({normalizeResult.issues.length}):
          </div>
          {normalizeResult.issues.map((issue, i) => (
            <div key={i} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
              <div className="flex items-start gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded font-medium flex-shrink-0">
                  {issue.form}
                </span>
                <span className="text-sm font-medium text-blue-400">{issue.table}</span>
                <button
                  onClick={() => onFix(issue, i)}
                  disabled={fixingIssue !== null || isLimited}
                  className="ml-auto text-xs bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-purple-200 px-3 py-1 rounded-md transition-colors font-medium flex-shrink-0"
                >
                  {fixingIssue === i ? '⏳ Виправляю...' : '🤖 Виправити з AI'}
                </button>
              </div>
              <div className="text-xs text-red-400 mb-1">⚠ {issue.problem}</div>
              <div className="text-xs text-green-400">💡 {issue.suggestion}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}