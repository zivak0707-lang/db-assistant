'use client'

import { useState } from 'react'
import ERDiagram from './components/ERDiagram'

type Column = {
  name: string
  type: string
  constraints: string
  description: string
}

type Table = {
  name: string
  description: string
  columns: Column[]
}

type DBResult = {
  er_diagram: string
  tables: Table[]
  sql: string
}

const EXAMPLES = [
  'Інтернет-магазин з товарами, категоріями, замовленнями та покупцями',
  'Університет зі студентами, викладачами, курсами та оцінками',
  'Лікарня з пацієнтами, лікарями, прийомами та діагнозами',
]

export default function Home() {
  const [domain, setDomain] = useState('')
  const [result, setResult] = useState<DBResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'er' | 'tables' | 'sql'>('er')
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!domain.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Помилка')
      setResult(data)
      setActiveTab('er')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Невідома помилка')
    } finally {
      setLoading(false)
    }
  }

  function copySQL() {
    if (result?.sql) {
      navigator.clipboard.writeText(result.sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">

      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold">
            DB
          </div>
          <div>
            <h1 className="text-base font-semibold">DB Assistant</h1>
            <p className="text-xs text-gray-500">Генератор баз даних на основі AI</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Input Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Опишіть предметну область
          </label>
          <textarea
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleGenerate()}
            placeholder="Наприклад: система управління бібліотекою з книгами, авторами, читачами та видачею книг..."
            className="w-full h-28 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
          />

          {/* Quick examples */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500">Приклади:</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setDomain(ex)}
                className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                {ex.split(' з ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !domain.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {loading ? '⏳ Генерація...' : '✨ Згенерувати базу даних'}
          </button>

          {error && (
            <div className="mt-3 p-3 bg-red-950 border border-red-800 rounded-lg text-sm text-red-400">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              {(['er', 'tables', 'sql'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab === 'er' ? '📊 ER-діаграма' : tab === 'tables' ? '📋 Таблиці' : '💾 SQL код'}
                </button>
              ))}
            </div>

            <div className="p-6">

              {/* ER Diagram tab — тепер рендерить Mermaid */}
              {activeTab === 'er' && (
                <ERDiagram diagram={result.er_diagram} />
              )}

              {/* Tables tab */}
              {activeTab === 'tables' && (
                <div className="space-y-6">
                  {result.tables.map((table, i) => (
                    <div key={i} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-400">{table.name}</span>
                        <span className="text-xs text-gray-500">— {table.description}</span>
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-500">
                            <th className="text-left px-4 py-2 font-medium">Колонка</th>
                            <th className="text-left px-4 py-2 font-medium">Тип</th>
                            <th className="text-left px-4 py-2 font-medium">Обмеження</th>
                            <th className="text-left px-4 py-2 font-medium">Опис</th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((col, j) => (
                            <tr key={j} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                              <td className="px-4 py-2 font-mono text-green-400">{col.name}</td>
                              <td className="px-4 py-2 text-yellow-400">{col.type}</td>
                              <td className="px-4 py-2 text-purple-400">{col.constraints}</td>
                              <td className="px-4 py-2 text-gray-400">{col.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {/* SQL tab */}
              {activeTab === 'sql' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">MySQL DDL</span>
                    <button
                      onClick={copySQL}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md transition-colors"
                    >
                      {copied ? '✓ Скопійовано!' : 'Копіювати SQL'}
                    </button>
                  </div>
                  <pre className="text-xs text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto leading-relaxed">
                    {result.sql}
                  </pre>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </main>
  )
}