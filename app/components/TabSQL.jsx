'use client'

import s from './TabSQL.module.css'

export default function TabSQL({ sql, dbType, copied, onCopy, onDownload, onSQLChange }) {
  return (
    <div className={s.wrapper}>
      <div className={s.topRow}>
        <div className={s.labelGroup}>
          <span className={s.label}>{dbType} DDL</span>
          {/* Bug 2 fix: поле редагується — підказка для користувача */}
          <span className={s.editHint}>✏️ Можна редагувати вручну</span>
        </div>
        <div className={s.actions}>
          <button onClick={onCopy} className={s.btnSecondary}>
            {copied ? '✓ Скопійовано!' : 'Копіювати'}
          </button>
          <button onClick={onDownload} className={s.btnPrimary}>
            ⬇ Завантажити .sql
          </button>
        </div>
      </div>
      {/* Bug 2 fix: замінено <pre> на <textarea> — SQL тепер редагується */}
      <textarea
        className={s.codeEditor}
        value={sql}
        onChange={e => onSQLChange(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  )
}