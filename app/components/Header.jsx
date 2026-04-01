'use client'

import { formatTime } from '../types'
import s from './Header.module.css'

export default function Header({
  onLogoClick,
  rateStatus,
  countdown,
  historyCount,
  onHistoryClick,
}) {
  const isLimited = rateStatus === 'limited'

  return (
    <header className={s.header}>
      <div className={s.inner}>

        <button onClick={onLogoClick} className={s.logo}>
          <div className={s.logoBadge}>DB</div>
          <div className={s.logoText}>
            <h1 className={s.logoTitle}>DB Assistant</h1>
            <p className={s.logoSub}>Генератор баз даних на основі AI</p>
          </div>
        </button>

        <div className={s.controls}>
          <div className={`${s.statusBadge} ${isLimited ? s.statusLimited : s.statusOk}`}>
            <div className={`${s.statusDot} ${isLimited ? s.dotLimited : s.dotOk}`} />
            {isLimited
              ? `Ліміт вичерпано${countdown ? ` · ${formatTime(countdown)}` : ''}`
              : 'AI готовий'
            }
          </div>

          {historyCount > 0 && (
            <button onClick={onHistoryClick} className={s.historyBtn}>
              🕐 Історія ({historyCount})
            </button>
          )}
        </div>
      </div>

      {isLimited && (
        <div className={s.limitBar}>
          <span className={s.limitText}>⚠ Денний ліміт токенів Groq вичерпано.</span>
          {countdown !== null && (
            <span className={s.limitCountdown}>
              Відновлення через: <strong>{formatTime(countdown)}</strong>
            </span>
          )}
        </div>
      )}
    </header>
  )
}
