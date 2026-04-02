import React from 'react'
import styles from './TabSQL.module.css'

export default function TabSQL({ sql, dbType, copied, onCopy, onDownload, onSQLChange }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div className={styles.labelGroup}>
          <span className={styles.label}>{dbType} DDL</span>
          <span className={styles.editHint}>Можна редагувати вручну</span>
        </div>
        <div className={styles.actions}>
          <button onClick={onCopy} className={styles.btnSecondary}>
            {copied ? '✓ Скопійовано!' : 'Копіювати'}
          </button>
          <button onClick={onDownload} className={styles.btnPrimary}>
            ⬇ Завантажити .sql
          </button>
        </div>
      </div>
      <textarea
        className={styles.codeEditor}
        value={sql}
        onChange={e => onSQLChange(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  )
}
