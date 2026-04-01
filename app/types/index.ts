export type Column = {
  name: string
  type: string
  constraints: string
  description: string
}

export type Table = {
  name: string
  description: string
  columns: Column[]
}

export type DBResult = {
  er_diagram: string
  tables: Table[]
  sql: string
  explanation?: string
  dbType?: string
}

export type HistoryItem = {
  id: string
  domain: string
  dbType: string
  result: DBResult
  createdAt: string
}

export type NormalizeIssue = {
  table: string
  form: string
  problem: string
  suggestion: string
}

export type NormalizeResult = {
  overall: string
  score: number
  issues: NormalizeIssue[]
  summary: string
}

export type RateStatus = 'ok' | 'limited'

export type ChatMessage = {
  role: 'user' | 'ai'
  text: string
}

export type EditingCell = {
  tableIdx: number
  colIdx: number
  field: keyof Column
}

export const DB_TYPES = ['MySQL', 'PostgreSQL', 'SQLite'] as const
export type DBType = typeof DB_TYPES[number]

export const EXAMPLES = [
  'Інтернет-магазин з товарами, категоріями, замовленнями та покупцями',
  'Університет зі студентами, викладачами, курсами та оцінками',
  'Лікарня з пацієнтами, лікарями, прийомами та діагнозами',
] as const

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  if (m > 0) return `${m}хв ${s}с`
  return `${s}с`
}