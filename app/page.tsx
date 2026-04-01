'use client'

import { useState, useEffect, useRef } from 'react'
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
  explanation?: string
  dbType?: string
}

type HistoryItem = {
  id: string
  domain: string
  dbType: string
  result: DBResult
  createdAt: string
}

type NormalizeIssue = {
  table: string
  form: string
  problem: string
  suggestion: string
}

type NormalizeResult = {
  overall: string
  score: number
  issues: NormalizeIssue[]
  summary: string
}

type RateStatus = 'ok' | 'limited'

const EXAMPLES = [
  'Інтернет-магазин з товарами, категоріями, замовленнями та покупцями',
  'Університет зі студентами, викладачами, курсами та оцінками',
  'Лікарня з пацієнтами, лікарями, прийомами та діагнозами',
]

const DB_TYPES = ['MySQL', 'PostgreSQL', 'SQLite']

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  if (m > 0) return `${m}хв ${s}с`
  return `${s}с`
}

export default function Home() {
  const [domain, setDomain] = useState('')
  const [dbType, setDbType] = useState('MySQL')
  const [result, setResult] = useState<DBResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'er' | 'tables' | 'sql' | 'seed' | 'normalize'>('er')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const [refineMsg, setRefineMsg] = useState('')
  const [refineLoading, setRefineLoading] = useState(false)
  const [refineError, setRefineError] = useState('')
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([])

  const [seedSQL, setSeedSQL] = useState('')
  const [seedLoading, setSeedLoading] = useState(false)
  const [seedCopied, setSeedCopied] = useState(false)

  const [normalizeResult, setNormalizeResult] = useState<NormalizeResult | null>(null)
  const [normalizeLoading, setNormalizeLoading] = useState(false)
  const [fixingIssue, setFixingIssue] = useState<number | null>(null)

  const [editingCell, setEditingCell] = useState<{ tableIdx: number; colIdx: number; field: keyof Column } | null>(null)
  const [editValue, setEditValue] = useState('')

  // Rate limit статус
  const [rateStatus, setRateStatus] = useState<RateStatus>('ok')
  const [retryAfter, setRetryAfter] = useState<number | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const erRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('db-assistant-history')
    if (saved) { try { setHistory(JSON.parse(saved)) } catch {} }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Таймер зворотнього відліку
  useEffect(() => {
    if (retryAfter && retryAfter > 0) {
      setCountdown(Math.ceil(retryAfter))
      setRateStatus('limited')
      if (countdownRef.current) clearInterval(countdownRef.current)
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownRef.current!)
            setRateStatus('ok')
            setRetryAfter(null)
            return null
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [retryAfter])

  function handleRateLimit(data: { rateLimited?: boolean; retryAfter?: number | null }) {
    if (data.rateLimited) {
      setRateStatus('limited')
      if (data.retryAfter) setRetryAfter(data.retryAfter)
    }
  }

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function saveToHistory(domain: string, dbType: string, result: DBResult) {
    const item: HistoryItem = {
      id: Date.now().toString(),
      domain, dbType, result,
      createdAt: new Date().toLocaleString('uk-UA'),
    }
    setHistory(prev => {
      const updated = [item, ...prev].slice(0, 5)
      localStorage.setItem('db-assistant-history', JSON.stringify(updated))
      return updated
    })
  }

  async function handleGenerate() {
    if (!domain.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setSeedSQL('')
    setNormalizeResult(null)
    setChatHistory([])
    setEditingCell(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, dbType }),
      })
      const data = await res.json()
      if (res.status === 429) {
        handleRateLimit(data)
        throw new Error(countdown ? `Ліміт вичерпано. Спробуйте через ${formatTime(countdown)}` : 'Ліміт запитів вичерпано. Спробуйте пізніше.')
      }
      if (!res.ok) throw new Error(data.error || 'Помилка')
      setRateStatus('ok')
      setResult(data)
      setActiveTab('er')
      saveToHistory(domain, dbType, data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Невідома помилка')
    } finally {
      setLoading(false)
    }
  }

  async function sendRefine(message: string, currentResult: DBResult) {
    const res = await fetch('/api/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentSchema: {
          er_diagram: currentResult.er_diagram,
          tables: currentResult.tables,
          sql: currentResult.sql,
        },
        userMessage: message,
        dbType: currentResult.dbType || dbType,
      }),
    })
    const data = await res.json()
    if (res.status === 429) {
      handleRateLimit(data)
      throw new Error(data.retryAfter ? `Ліміт вичерпано. Спробуйте через ${formatTime(data.retryAfter)}` : 'Ліміт запитів вичерпано.')
    }
    if (!res.ok) throw new Error(data.error || 'Помилка')
    setRateStatus('ok')
    return data
  }

  async function handleRefine() {
    if (!refineMsg.trim() || !result) return
    const msg = refineMsg.trim()
    setRefineLoading(true)
    setRefineError('')
    setRefineMsg('')
    setEditingCell(null)
    setChatHistory(prev => [...prev, { role: 'user', text: msg }])

    try {
      const data = await sendRefine(msg, result)
      const updated: DBResult = {
        er_diagram: data.er_diagram || result.er_diagram,
        tables: data.tables || result.tables,
        sql: data.sql || result.sql,
        explanation: data.explanation,
        dbType: data.dbType || result.dbType || dbType,
      }
      setResult(updated)
      setSeedSQL('')
      setNormalizeResult(null)
      setChatHistory(prev => [...prev, { role: 'ai', text: data.explanation || 'Схему оновлено ✓' }])
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Помилка'
      setRefineError(errMsg)
      setChatHistory(prev => [...prev, { role: 'ai', text: `❌ ${errMsg}` }])
    } finally {
      setRefineLoading(false)
    }
  }

  async function fixIssueWithAI(issue: NormalizeIssue, idx: number) {
    if (!result) return
    setFixingIssue(idx)
    setEditingCell(null)
    const message = `Fix normalization issue: table "${issue.table}", problem: ${issue.problem}. Solution: ${issue.suggestion}`
    setChatHistory(prev => [...prev, { role: 'user', text: `🔧 Автовиправлення: ${issue.table} (${issue.form})` }])

    try {
      const data = await sendRefine(message, result)
      const updated: DBResult = {
        er_diagram: data.er_diagram || result.er_diagram,
        tables: data.tables || result.tables,
        sql: data.sql || result.sql,
        explanation: data.explanation,
        dbType: data.dbType || result.dbType || dbType,
      }
      setResult(updated)
      setNormalizeResult(null)
      setSeedSQL('')
      setChatHistory(prev => [...prev, { role: 'ai', text: data.explanation || 'Виправлено ✓ Натисни "Перевірити знову"' }])
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Помилка'
      setChatHistory(prev => [...prev, { role: 'ai', text: `❌ ${errMsg}` }])
    } finally {
      setFixingIssue(null)
    }
  }

  async function handleGenerateSeed() {
    if (!result) return
    setSeedLoading(true)
    setSeedSQL('')
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables: result.tables, dbType: result.dbType || dbType }),
      })
      const data = await res.json()
      if (res.status === 429) { handleRateLimit(data); throw new Error('Ліміт вичерпано') }
      if (!res.ok) throw new Error(data.error || 'Помилка')
      setRateStatus('ok')
      setSeedSQL(data.seed_sql)
    } catch (e: unknown) {
      setSeedSQL(`-- Помилка: ${e instanceof Error ? e.message : 'Невідома помилка'}`)
    } finally {
      setSeedLoading(false)
    }
  }

  async function handleNormalize() {
    if (!result) return
    setNormalizeLoading(true)
    setNormalizeResult(null)
    try {
      const res = await fetch('/api/normalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables: result.tables }),
      })
      const data = await res.json()
      if (res.status === 429) { handleRateLimit(data); throw new Error('Ліміт вичерпано') }
      if (!res.ok) throw new Error(data.error || 'Помилка')
      setRateStatus('ok')
      setNormalizeResult(data)
    } catch (e: unknown) {
      console.error(e)
    } finally {
      setNormalizeLoading(false)
    }
  }

  function startEdit(tableIdx: number, colIdx: number, field: keyof Column) {
    if (!result) return
    const table = result.tables[tableIdx]
    if (!table) return
    const col = table.columns[colIdx]
    if (!col) return
    setEditingCell({ tableIdx, colIdx, field })
    setEditValue(col[field] ?? '')
  }

  function saveEdit() {
    if (!editingCell || !result) return
    const { tableIdx, colIdx, field } = editingCell
    const updated = result.tables.map((t, ti) =>
      ti !== tableIdx ? t : {
        ...t,
        columns: t.columns.map((c, ci) =>
          ci !== colIdx ? c : { ...c, [field]: editValue }
        )
      }
    )
    setResult({ ...result, tables: updated })
    setEditingCell(null)
  }

  function addColumn(tableIdx: number) {
    if (!result) return
    const newCol: Column = { name: 'new_column', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'нова колонка' }
    const newColIdx = result.tables[tableIdx].columns.length
    const updatedTables = result.tables.map((t, i) =>
      i !== tableIdx ? t : { ...t, columns: [...t.columns, newCol] }
    )
    setResult({ ...result, tables: updatedTables })
    setTimeout(() => {
      setEditingCell({ tableIdx, colIdx: newColIdx, field: 'name' })
      setEditValue('new_column')
    }, 50)
  }

  function removeColumn(tableIdx: number, colIdx: number) {
    if (!result) return
    if (editingCell?.tableIdx === tableIdx && editingCell?.colIdx === colIdx) setEditingCell(null)
    const updated = result.tables.map((t, i) =>
      i !== tableIdx ? t : { ...t, columns: t.columns.filter((_, ci) => ci !== colIdx) }
    )
    setResult({ ...result, tables: updated })
  }

  function copySQL() {
    if (result?.sql) { navigator.clipboard.writeText(result.sql); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  function downloadSQL() {
    if (!result?.sql) return
    const blob = new Blob([result.sql], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${domain.slice(0, 20).replace(/\s+/g, '_')}_${result.dbType || dbType}.sql`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadSeed() {
    if (!seedSQL) return
    const blob = new Blob([seedSQL], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seed_${result?.dbType || dbType}.sql`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadERDiagram() {
    const svgEl = erRef.current?.querySelector('svg')
    if (!svgEl) { alert('Спочатку згенеруйте ER-діаграму'); return }
    const svgData = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `er_diagram_${domain.slice(0, 15).replace(/\s+/g, '_')}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  function loadFromHistory(item: HistoryItem) {
    setDomain(item.domain)
    setDbType(item.dbType)
    setResult(item.result)
    setActiveTab('er')
    setShowHistory(false)
    setSeedSQL('')
    setNormalizeResult(null)
    setChatHistory([])
    setEditingCell(null)
  }

  const scoreColor = normalizeResult
    ? normalizeResult.score >= 80 ? 'text-green-400'
      : normalizeResult.score >= 60 ? 'text-yellow-400' : 'text-red-400'
    : ''

  const isLimited = rateStatus === 'limited'

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div ref={topRef} />

      <header className="border-b border-gray-800 px-6 py-4 sticky top-0 bg-gray-950 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={scrollToTop} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-bold">DB</div>
            <div className="text-left">
              <h1 className="text-base font-semibold">DB Assistant</h1>
              <p className="text-xs text-gray-500">Генератор баз даних на основі AI</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {/* Індикатор статусу API */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isLimited
                ? 'border-red-800 bg-red-950 text-red-400'
                : 'border-green-800 bg-green-950 text-green-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isLimited ? 'bg-red-500' : 'bg-green-500'} ${!isLimited ? 'animate-pulse' : ''}`} />
              {isLimited ? (
                <span>
                  Ліміт вичерпано
                  {countdown !== null && ` · ${formatTime(countdown)}`}
                </span>
              ) : (
                <span>AI готовий</span>
              )}
            </div>

            {history.length > 0 && (
              <button onClick={() => setShowHistory(!showHistory)}
                className="text-xs text-gray-400 hover:text-gray-200 border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors">
                🕐 Історія ({history.length})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Банер ліміту */}
      {isLimited && (
        <div className="bg-red-950 border-b border-red-900 px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <span className="text-red-400 text-sm">⚠ Денний ліміт токенів Groq вичерпано.</span>
            {countdown !== null && (
              <span className="text-red-300 text-sm font-medium">
                Відновлення через: <span className="font-bold text-white">{formatTime(countdown)}</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">

        {showHistory && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Останні запити</span>
              <button onClick={() => { setHistory([]); localStorage.removeItem('db-assistant-history') }}
                className="text-xs text-red-400 hover:text-red-300">Очистити</button>
            </div>
            <div className="space-y-2">
              {history.map(item => (
                <button key={item.id} onClick={() => loadFromHistory(item)}
                  className="w-full text-left px-3 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">{item.domain}</span>
                    <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded ml-2 flex-shrink-0">{item.dbType}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.createdAt}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Опишіть предметну область</label>
          <textarea
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.ctrlKey && !isLimited && handleGenerate()}
            placeholder="Наприклад: система управління бібліотекою з книгами, авторами, читачами та видачею книг..."
            className="w-full h-28 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-blue-500 transition-colors"
          />
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500">Приклади:</span>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setDomain(ex)}
                className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                {ex.split(' з ')[0]}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-gray-400 flex-shrink-0">Тип БД:</span>
            <div className="flex gap-2">
              {DB_TYPES.map(type => (
                <button key={type} onClick={() => setDbType(type)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                    dbType === type ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}>
                  {type}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !domain.trim() || isLimited}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
            {loading ? '⏳ Генерація...'
              : isLimited ? `⏳ Доступно через ${countdown !== null ? formatTime(countdown) : '...'}`
              : '✨ Згенерувати базу даних'}
          </button>
          {error && <div className="mt-3 p-3 bg-red-950 border border-red-800 rounded-lg text-sm text-red-400">❌ {error}</div>}
        </div>

        {result?.explanation && (
          <div className="bg-blue-950 border border-blue-800 rounded-xl px-5 py-4 mb-6">
            <div className="text-xs text-blue-400 font-medium mb-1">💡 Пояснення структури від AI</div>
            <p className="text-sm text-blue-100 leading-relaxed">{result.explanation}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex border-b border-gray-800 overflow-x-auto">
              {(['er', 'tables', 'sql', 'seed', 'normalize'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-xs font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800' : 'text-gray-500 hover:text-gray-300'
                  }`}>
                  {tab === 'er' ? '📊 ER-діаграма'
                    : tab === 'tables' ? '📋 Таблиці'
                    : tab === 'sql' ? '💾 SQL код'
                    : tab === 'seed' ? '🌱 Тестові дані'
                    : '🔍 Нормалізація'}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'er' && (
                <div>
                  <div className="flex justify-end mb-3">
                    <button onClick={downloadERDiagram}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md transition-colors">
                      🖼 Зберегти SVG
                    </button>
                  </div>
                  <div ref={erRef}><ERDiagram diagram={result.er_diagram} /></div>
                </div>
              )}

              {activeTab === 'tables' && (
                <div className="space-y-6">
                  <div className="text-xs text-gray-500 mb-2">💡 Натисни на комірку щоб редагувати → Enter зберегти, Escape скасувати</div>
                  {result.tables.map((table, ti) => (
                    <div key={ti} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-400">{table.name}</span>
                        <span className="text-xs text-gray-500">— {table.description}</span>
                        <button onClick={() => addColumn(ti)}
                          className="ml-auto text-xs bg-green-900 hover:bg-green-800 text-green-300 px-2 py-1 rounded transition-colors">
                          + Колонка
                        </button>
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-700 text-gray-500">
                            <th className="text-left px-4 py-2 font-medium">Колонка</th>
                            <th className="text-left px-4 py-2 font-medium">Тип</th>
                            <th className="text-left px-4 py-2 font-medium">Обмеження</th>
                            <th className="text-left px-4 py-2 font-medium">Опис</th>
                            <th className="px-2 py-2 w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {table.columns.map((col, ci) => (
                            <tr key={ci} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group">
                              {(['name', 'type', 'constraints', 'description'] as (keyof Column)[]).map(field => (
                                <td key={field} className="px-4 py-2">
                                  {editingCell?.tableIdx === ti && editingCell?.colIdx === ci && editingCell?.field === field ? (
                                    <input autoFocus value={editValue}
                                      onChange={e => setEditValue(e.target.value)}
                                      onBlur={saveEdit}
                                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveEdit() } if (e.key === 'Escape') setEditingCell(null) }}
                                      className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-0.5 text-xs text-white outline-none" />
                                  ) : (
                                    <span onClick={() => startEdit(ti, ci, field)} title="Натисни щоб редагувати"
                                      className={`cursor-pointer hover:bg-gray-700 rounded px-1 py-0.5 transition-colors inline-block ${
                                        field === 'name' ? 'font-mono text-green-400'
                                          : field === 'type' ? 'text-yellow-400'
                                          : field === 'constraints' ? 'text-purple-400' : 'text-gray-400'
                                      }`}>
                                      {col[field] || '—'}
                                    </span>
                                  )}
                                </td>
                              ))}
                              <td className="px-2 py-2 text-center">
                                <button onClick={() => removeColumn(ti, ci)}
                                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all text-sm" title="Видалити">✕</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'sql' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">{result.dbType || dbType} DDL</span>
                    <div className="flex gap-2">
                      <button onClick={copySQL} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md transition-colors">
                        {copied ? '✓ Скопійовано!' : 'Копіювати'}
                      </button>
                      <button onClick={downloadSQL} className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition-colors">
                        ⬇ Завантажити .sql
                      </button>
                    </div>
                  </div>
                  <pre className="text-xs text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto leading-relaxed">{result.sql}</pre>
                </div>
              )}

              {activeTab === 'seed' && (
                <div>
                  {!seedSQL ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-400 mb-4">Згенеруй реалістичні тестові дані (INSERT) для всіх таблиць</p>
                      <button onClick={handleGenerateSeed} disabled={seedLoading || isLimited}
                        className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
                        {seedLoading ? '⏳ Генерація...' : isLimited ? '⏳ Ліміт вичерпано' : '🌱 Згенерувати тестові дані'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">INSERT дані для тестування</span>
                        <div className="flex gap-2">
                          <button onClick={() => { navigator.clipboard.writeText(seedSQL); setSeedCopied(true); setTimeout(() => setSeedCopied(false), 2000) }}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md transition-colors">
                            {seedCopied ? '✓ Скопійовано!' : 'Копіювати'}
                          </button>
                          <button onClick={downloadSeed} className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-md transition-colors">
                            ⬇ Завантажити
                          </button>
                          <button onClick={handleGenerateSeed} disabled={seedLoading || isLimited}
                            className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition-colors">
                            {seedLoading ? '⏳' : '🔄 Перегенерувати'}
                          </button>
                        </div>
                      </div>
                      <pre className="text-xs text-gray-300 bg-gray-800 p-4 rounded-lg overflow-auto leading-relaxed">{seedSQL}</pre>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'normalize' && (
                <div>
                  {!normalizeResult ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-400 mb-2">AI перевірить схему на відповідність нормальним формам</p>
                      <p className="text-xs text-gray-500 mb-4">1НФ, 2НФ, 3НФ, BCNF — з поясненнями та автовиправленням</p>
                      <button onClick={handleNormalize} disabled={normalizeLoading || isLimited}
                        className="bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
                        {normalizeLoading ? '⏳ Аналіз...' : isLimited ? '⏳ Ліміт вичерпано' : '🔍 Перевірити нормалізацію'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                        <div className="text-center min-w-12">
                          <div className={`text-3xl font-bold ${scoreColor}`}>{normalizeResult.score}</div>
                          <div className="text-xs text-gray-500">/ 100</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Рівень: <span className={scoreColor}>{normalizeResult.overall}</span></div>
                          <div className="text-xs text-gray-400 mt-1">{normalizeResult.summary}</div>
                        </div>
                        <button onClick={handleNormalize} disabled={normalizeLoading || isLimited}
                          className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-3 py-1.5 rounded-md transition-colors flex-shrink-0">
                          🔄 Перевірити знову
                        </button>
                      </div>
                      {normalizeResult.issues.length === 0 ? (
                        <div className="p-4 bg-green-950 border border-green-800 rounded-lg text-sm text-green-400">
                          ✅ Схема відповідає нормальним формам. Проблем не знайдено.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-xs font-medium text-gray-400">Знайдені проблеми ({normalizeResult.issues.length}):</div>
                          {normalizeResult.issues.map((issue, i) => (
                            <div key={i} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                              <div className="flex items-start gap-2 mb-2 flex-wrap">
                                <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-0.5 rounded font-medium flex-shrink-0">{issue.form}</span>
                                <span className="text-sm font-medium text-blue-400">{issue.table}</span>
                                <button onClick={() => fixIssueWithAI(issue, i)} disabled={fixingIssue !== null || isLimited}
                                  className="ml-auto text-xs bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-purple-200 px-3 py-1 rounded-md transition-colors font-medium flex-shrink-0">
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
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
              <span className="text-sm font-medium">💬 Уточнити схему</span>
              <span className="text-xs text-gray-500">— попроси AI змінити структуру</span>
            </div>
            {chatHistory.length > 0 && (
              <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                      msg.role === 'user' ? 'bg-blue-700 text-white'
                        : msg.text.startsWith('❌') ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-gray-800 text-gray-200'
                    }`}>{msg.text}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
            <div className="px-5 py-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input type="text" value={refineMsg}
                  onChange={e => setRefineMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !refineLoading && !isLimited && handleRefine()}
                  placeholder='Наприклад: "Додай таблицю знижок" або "Зроби email унікальним"'
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={refineLoading || isLimited}
                />
                <button onClick={handleRefine} disabled={refineLoading || !refineMsg.trim() || isLimited}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex-shrink-0">
                  {refineLoading ? '⏳' : 'Надіслати'}
                </button>
              </div>
              {refineError && <div className="mt-2 text-xs text-red-400">❌ {refineError}</div>}
              {isLimited && countdown !== null && (
                <div className="mt-2 text-xs text-yellow-400">
                  ⏳ AI буде доступний через {formatTime(countdown)}
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {['Додай таблицю коментарів', 'Зроби email унікальним', 'Додай created_at до всіх таблиць', 'Розбий адресу на окрему таблицю'].map((hint, i) => (
                  <button key={i} onClick={() => setRefineMsg(hint)} disabled={isLimited}
                    className="text-xs text-gray-500 hover:text-gray-300 disabled:opacity-40 border border-gray-700 hover:border-gray-500 px-2 py-1 rounded transition-colors">
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}