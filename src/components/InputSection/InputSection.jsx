import React from 'react'
import { DB_TYPES, EXAMPLES } from '../../types'
import styles from './InputSection.module.css'

export default function InputSection({
  domain, dbType, loading, isLimited, countdown, error,
  onDomainChange, onDbTypeChange, onGenerate,
}) {
  const buttonDisabled = loading || !domain.trim() || isLimited

  function getButtonLabel() {
    if (loading) return '⏳ Генерація...'
    if (isLimited && countdown) return `⏳ Доступно через ${countdown}с`
    if (isLimited) return '⏳ Ліміт вичерпано'
    return 'Згенерувати базу даних'
  }

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Опишіть предметну область</label>

      <textarea
        value={domain}
        onChange={e => onDomainChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && e.ctrlKey && !buttonDisabled && onGenerate()}
        placeholder="Наприклад: система управління бібліотекою з книгами, авторами, читачами та видачею книг..."
        className={styles.textarea}
      />

      <div className={styles.examples}>
        <span className={styles.examplesLabel}>Приклади:</span>
        {EXAMPLES.map((ex, i) => (
          <button key={i} onClick={() => onDomainChange(ex)} className={styles.exampleBtn}>
            {ex.split(' з ')[0]}
          </button>
        ))}
      </div>

      <div className={styles.dbTypeRow}>
        <span className={styles.dbTypeLabel}>Тип БД:</span>
        <div className={styles.dbTypeButtons}>
          {DB_TYPES.map(type => (
            <button
              key={type}
              onClick={() => onDbTypeChange(type)}
              className={`${styles.dbTypeBtn} ${dbType === type ? styles.dbTypeBtnActive : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={buttonDisabled}
        className={`${styles.generateBtn} ${buttonDisabled ? styles.generateBtnDisabled : ''}`}
      >
        {getButtonLabel()}
      </button>

      {error && <div className={styles.error}>❌ {error}</div>}
    </div>
  )
}
