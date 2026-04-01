'use client'

import { DB_TYPES, EXAMPLES } from '../types'
import s from './InputSection.module.css'

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
}) {
  const buttonDisabled = loading || !domain.trim() || isLimited

  function getButtonLabel() {
    if (loading) return '⏳ Генерація...'
    if (isLimited && countdown) return `⏳ Доступно через ${countdown}с`
    if (isLimited) return '⏳ Ліміт вичерпано'
    return '✨ Згенерувати базу даних'
  }

  return (
    <div className={s.wrapper}>
      <label className={s.label}>Опишіть предметну область</label>

      <textarea
        value={domain}
        onChange={e => onDomainChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && e.ctrlKey && !buttonDisabled && onGenerate()}
        placeholder="Наприклад: система управління бібліотекою з книгами, авторами, читачами та видачею книг..."
        className={s.textarea}
      />

      <div className={s.examples}>
        <span className={s.examplesLabel}>Приклади:</span>
        {EXAMPLES.map((ex, i) => (
          <button key={i} onClick={() => onDomainChange(ex)} className={s.exampleBtn}>
            {ex.split(' з ')[0]}
          </button>
        ))}
      </div>

      <div className={s.dbTypeRow}>
        <span className={s.dbTypeLabel}>Тип БД:</span>
        <div className={s.dbTypeButtons}>
          {DB_TYPES.map(type => (
            <button
              key={type}
              onClick={() => onDbTypeChange(type)}
              className={`${s.dbTypeBtn} ${dbType === type ? s.dbTypeBtnActive : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={buttonDisabled}
        className={`${s.generateBtn} ${buttonDisabled ? s.generateBtnDisabled : ''}`}
      >
        {getButtonLabel()}
      </button>

      {error && (
        <div className={s.error}>❌ {error}</div>
      )}
    </div>
  )
}
