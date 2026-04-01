import { useState, useEffect, useRef } from 'react'
import {
  Column, DBResult, NormalizeIssue, NormalizeResult,
  ChatMessage, EditingCell, formatTime
} from '../types'
import { useHistory } from './useHistory'
import { useRateLimit } from './useRateLimit'

export function useDBAssistant() {
  const [domain, setDomain] = useState('')
  const [dbType, setDbType] = useState('MySQL')
  const [result, setResult] = useState<DBResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'er' | 'tables' | 'sql' | 'seed' | 'normalize'>('er')

  const [refineMsg, setRefineMsg] = useState('')
  const [refineLoading, setRefineLoading] = useState(false)
  const [refineError, setRefineError] = useState('')
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])

  const [seedSQL, setSeedSQL] = useState('')
  const [seedLoading, setSeedLoading] = useState(false)
  const [seedCopied, setSeedCopied] = useState(false)
  const [copied, setCopied] = useState(false)

  const [normalizeResult, setNormalizeResult] = useState<NormalizeResult | null>(null)
  const [normalizeLoading, setNormalizeLoading] = useState(false)
  const [fixingIssue, setFixingIssue] = useState<number | null>(null)

  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [editValue, setEditValue] = useState('')

  const chatEndRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const erRef = useRef<HTMLDivElement>(null)

  const history = useHistory()
  const rateLimit = useRateLimit()

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function loadFromHistory(item: Parameters<typeof history.save>[2] extends DBResult ? never : Parameters<ReturnType<typeof useHistory>['save']>[2] extends DBResult ? never : DBResult, domain: string, dbType: string) {
    // handled below
  }

  // --- API helpers ---

  async function callAPI(url: string, body: object) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (res.status === 429) {
      rateLimit.handleRateLimit(data)
      throw new Error(
        data.retryAfter
          ? `Ліміт вичерпано. Спробуйте через ${formatTime(data.retryAfter)}`
          : 'Ліміт запитів вичерпано.'
      )
    }
    if (!res.ok) throw new Error(data.error || 'Помилка')
    rateLimit.setRateStatus('ok')
    return data
  }

  // --- Генерація ---

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
      const data = await callAPI('/api/generate', { domain, dbType })
      setResult(data)
      setActiveTab('er')
      history.save(domain, dbType, data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Невідома помилка')
    } finally {
      setLoading(false)
    }
  }

  // --- Уточнення схеми ---

  async function callRefine(message: string, currentResult: DBResult) {
    return callAPI('/api/refine', {
      currentSchema: {
        er_diagram: currentResult.er_diagram,
        tables: currentResult.tables,
        sql: currentResult.sql,
      },
      userMessage: message,
      dbType: currentResult.dbType || dbType,
    })
  }

  function applyRefineResult(data: DBResult) {
    setResult(prev => prev ? {
      ...prev,
      er_diagram: data.er_diagram || prev.er_diagram,
      tables: data.tables || prev.tables,
      sql: data.sql || prev.sql,
      explanation: data.explanation,
      dbType: data.dbType || prev.dbType,
    } : prev)
    setSeedSQL('')
    setNormalizeResult(null)
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
      const data = await callRefine(msg, result)
      applyRefineResult(data)
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
      const data = await callRefine(message, result)
      applyRefineResult(data)
      setChatHistory(prev => [...prev, { role: 'ai', text: data.explanation || 'Виправлено ✓ Натисни "Перевірити знову"' }])
    } catch (e: unknown) {
      setChatHistory(prev => [...prev, { role: 'ai', text: `❌ ${e instanceof Error ? e.message : 'Помилка'}` }])
    } finally {
      setFixingIssue(null)
    }
  }

  // --- Seed та нормалізація ---

  async function handleGenerateSeed() {
    if (!result) return
    setSeedLoading(true)
    setSeedSQL('')
    try {
      const data = await callAPI('/api/seed', { tables: result.tables, dbType: result.dbType || dbType })
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
      const data = await callAPI('/api/normalize', { tables: result.tables })
      setNormalizeResult(data)
    } catch (e: unknown) {
      console.error(e)
    } finally {
      setNormalizeLoading(false)
    }
  }

  // --- Редагування таблиць ---

  function startEdit(tableIdx: number, colIdx: number, field: keyof Column) {
    if (!result) return
    const col = result.tables[tableIdx]?.columns[colIdx]
    if (!col) return
    setEditingCell({ tableIdx, colIdx, field })
    setEditValue(col[field] ?? '')
  }

  function saveEdit() {
    if (!editingCell || !result) return
    const { tableIdx, colIdx, field } = editingCell
    setResult(prev => {
      if (!prev) return prev
      return {
        ...prev,
        tables: prev.tables.map((t, ti) =>
          ti !== tableIdx ? t : {
            ...t,
            columns: t.columns.map((c, ci) =>
              ci !== colIdx ? c : { ...c, [field]: editValue }
            )
          }
        )
      }
    })
    setEditingCell(null)
  }

  function addColumn(tableIdx: number) {
    if (!result) return
    const newCol: Column = { name: 'new_column', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'нова колонка' }
    const newColIdx = result.tables[tableIdx].columns.length
    setResult(prev => {
      if (!prev) return prev
      return {
        ...prev,
        tables: prev.tables.map((t, i) =>
          i !== tableIdx ? t : { ...t, columns: [...t.columns, newCol] }
        )
      }
    })
    setTimeout(() => {
      setEditingCell({ tableIdx, colIdx: newColIdx, field: 'name' })
      setEditValue('new_column')
    }, 50)
  }

  function removeColumn(tableIdx: number, colIdx: number) {
    if (editingCell?.tableIdx === tableIdx && editingCell?.colIdx === colIdx) setEditingCell(null)
    setResult(prev => {
      if (!prev) return prev
      return {
        ...prev,
        tables: prev.tables.map((t, i) =>
          i !== tableIdx ? t : { ...t, columns: t.columns.filter((_, ci) => ci !== colIdx) }
        )
      }
    })
  }

  // --- Файли ---

  function copySQL() {
    if (!result?.sql) return
    navigator.clipboard.writeText(result.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadFile(content: string, filename: string, type = 'text/plain') {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadSQL() {
    if (!result?.sql) return
    downloadFile(result.sql, `${domain.slice(0, 20).replace(/\s+/g, '_')}_${result.dbType || dbType}.sql`)
  }

  function downloadSeed() {
    if (!seedSQL) return
    downloadFile(seedSQL, `seed_${result?.dbType || dbType}.sql`)
  }

  function downloadERDiagram() {
    const svgEl = erRef.current?.querySelector('svg')
    if (!svgEl) { alert('Спочатку згенеруйте ER-діаграму'); return }
    const svgData = new XMLSerializer().serializeToString(svgEl)
    downloadFile(svgData, `er_diagram_${domain.slice(0, 15).replace(/\s+/g, '_')}.svg`, 'image/svg+xml;charset=utf-8')
  }

  function copySeed() {
    if (!seedSQL) return
    navigator.clipboard.writeText(seedSQL)
    setSeedCopied(true)
    setTimeout(() => setSeedCopied(false), 2000)
  }

  return {
    // Стан
    domain, setDomain,
    dbType, setDbType,
    result,
    loading,
    error,
    activeTab, setActiveTab,
    copied,
    refineMsg, setRefineMsg,
    refineLoading,
    refineError,
    chatHistory,
    seedSQL,
    seedLoading,
    seedCopied,
    normalizeResult,
    normalizeLoading,
    fixingIssue,
    editingCell,
    editValue, setEditValue,
    // Вкладені хуки
    history,
    rateLimit,
    // Refs
    chatEndRef,
    topRef,
    erRef,
    // Дії
    scrollToTop,
    handleGenerate,
    handleRefine,
    fixIssueWithAI,
    handleGenerateSeed,
    handleNormalize,
    startEdit,
    saveEdit,
    addColumn,
    removeColumn,
    copySQL,
    copySeed,
    downloadSQL,
    downloadSeed,
    downloadERDiagram,
  }
}