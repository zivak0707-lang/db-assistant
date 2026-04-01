'use client'

import ERDiagram from './ERDiagram'
import s from './TabER.module.css'

export default function TabER({ diagram, erRef, onDownload }) {
  return (
    <div className={s.wrapper}>
      <div className={s.topRow}>
        <button onClick={onDownload} className={s.downloadBtn}>
          🖼 Зберегти SVG
        </button>
      </div>
      <div ref={erRef}>
        <ERDiagram diagram={diagram} />
      </div>
    </div>
  )
}
