import React from 'react'
import ERDiagram from '../ERDiagram/ERDiagram'
import styles from './TabER.module.css'

export default function TabER({ diagram, erRef, onDownload }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <button onClick={onDownload} className={styles.downloadBtn}>
          🖼 Зберегти SVG
        </button>
      </div>
      <div ref={erRef}>
        <ERDiagram diagram={diagram} />
      </div>
    </div>
  )
}
