'use client'

import s from './TabSeed.module.css'

export default function TabSeed({
  seedSQL,
  loading,
  isLimited,
  copied,
  onGenerate,
  onCopy,
  onDownload,
}) {
  if (!seedSQL) {
    return (
      <div className={s.empty}>
        <p className={s.emptyText}>
          Згенеруй реалістичні тестові дані (INSERT) для всіх таблиць
        </p>
        <button
          onClick={onGenerate}
          disabled={loading || isLimited}
          className={`${s.generateBtn} ${loading || isLimited ? s.generateBtnDisabled : ''}`}
        >
          {loading ? '⏳ Генерація...' : isLimited ? '⏳ Ліміт вичерпано' : '🌱 Згенерувати тестові дані'}
        </button>
      </div>
    )
  }

  return (
    <div className={s.wrapper}>
      <div className={s.topRow}>
        <span className={s.label}>INSERT дані для тестування</span>
        <div className={s.actions}>
          <button onClick={onCopy} className={s.btnSecondary}>
            {copied ? '✓ Скопійовано!' : 'Копіювати'}
          </button>
          <button onClick={onDownload} className={s.btnGreen}>
            ⬇ Завантажити
          </button>
          <button
            onClick={onGenerate}
            disabled={loading || isLimited}
            className={`${s.btnSecondary} ${loading || isLimited ? s.btnDisabled : ''}`}
          >
            {loading ? '⏳' : '🔄 Перегенерувати'}
          </button>
        </div>
      </div>
      <pre className={s.code}>{seedSQL}</pre>
    </div>
  )
}
