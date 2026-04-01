import React from 'react'
import styles from './TabSeed.module.css'

export default function TabSeed({ seedSQL, loading, isLimited, copied, onGenerate, onCopy, onDownload }) {
  if (!seedSQL) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>
          Згенеруй реалістичні тестові дані (INSERT) для всіх таблиць
        </p>
        <button
          onClick={onGenerate}
          disabled={loading || isLimited}
          className={`${styles.generateBtn} ${loading || isLimited ? styles.generateBtnDisabled : ''}`}
        >
          {loading ? '⏳ Генерація...' : isLimited ? '⏳ Ліміт вичерпано' : '🌱 Згенерувати тестові дані'}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <span className={styles.label}>INSERT дані для тестування</span>
        <div className={styles.actions}>
          <button onClick={onCopy} className={styles.btnSecondary}>
            {copied ? '✓ Скопійовано!' : 'Копіювати'}
          </button>
          <button onClick={onDownload} className={styles.btnGreen}>
            ⬇ Завантажити
          </button>
          <button
            onClick={onGenerate}
            disabled={loading || isLimited}
            className={`${styles.btnSecondary} ${loading || isLimited ? styles.btnDisabled : ''}`}
          >
            {loading ? '⏳' : '🔄 Перегенерувати'}
          </button>
        </div>
      </div>
      <pre className={styles.code}>{seedSQL}</pre>
    </div>
  )
}
