export const DB_TYPES = ['MySQL', 'PostgreSQL', 'SQLite']

export const EXAMPLES = [
  'Інтернет-магазин з товарами, категоріями, замовленнями та покупцями',
  'Університет зі студентами, викладачами, курсами та оцінками',
  'Лікарня з пацієнтами, лікарями, прийомами та діагнозами',
]

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  if (m > 0) return `${m}хв ${s}с`
  return `${s}с`
}
