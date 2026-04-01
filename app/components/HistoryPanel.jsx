'use client'

import s from './HistoryPanel.module.css'

export default function HistoryPanel({ history, onLoad, onClear }) {
  if (history.length === 0) return null

  return (
    <div className={s.wrapper}>
      <div className={s.topRow}>
        <span className={s.title}>Останні запити</span>
        <button onClick={onClear} className={s.clearBtn}>Очистити</button>
      </div>
      <div className={s.list}>
        {history.map(item => (
          <button key={item.id} onClick={() => onLoad(item)} className={s.item}>
            <div className={s.itemRow}>
              <span className={s.itemDomain}>{item.domain}</span>
              <span className={s.itemBadge}>{item.dbType}</span>
            </div>
            <div className={s.itemDate}>{item.createdAt}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
