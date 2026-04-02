import React from 'react'
import styles from './TabTables.module.css'

const FIELD_CLASSES = {
  name: styles.cellName,
  type: styles.cellType,
  constraints: styles.cellConstraints,
  description: styles.cellDescription,
}

export default function TabTables({
  tables, editingCell, editValue, onEditValueChange,
  onStartEdit, onSaveEdit, onCancelEdit, onAddColumn, onRemoveColumn,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.hint}>
        Натисни на комірку щоб редагувати → Enter зберегти, Escape скасувати
      </div>

      {tables.map((table, ti) => (
        <div key={ti} className={styles.tableBlock}>
          <div className={styles.tableHeader}>
            <span className={styles.tableName}>{table.name}</span>
            <span className={styles.tableDesc}>— {table.description}</span>
            <button onClick={() => onAddColumn(ti)} className={styles.addColBtn}>
              + Колонка
            </button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.th}>Колонка</th>
                <th className={styles.th}>Тип</th>
                <th className={styles.th}>Обмеження</th>
                <th className={styles.th}>Опис</th>
                <th className={styles.thAction} />
              </tr>
            </thead>
            <tbody>
              {table.columns.map((col, ci) => (
                <tr key={ci} className={styles.row}>
                  {['name', 'type', 'constraints', 'description'].map(field => (
                    <td key={field} className={styles.td}>
                      {editingCell?.tableIdx === ti && editingCell?.colIdx === ci && editingCell?.field === field ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={e => onEditValueChange(e.target.value)}
                          onBlur={onSaveEdit}
                          onKeyDown={e => {
                            if (e.key === 'Enter') { e.preventDefault(); onSaveEdit() }
                            if (e.key === 'Escape') onCancelEdit()
                          }}
                          className={styles.editInput}
                        />
                      ) : (
                        <span
                          onClick={() => onStartEdit(ti, ci, field)}
                          title="Натисни щоб редагувати"
                          className={`${styles.cellValue} ${FIELD_CLASSES[field]}`}
                        >
                          {col[field] || '—'}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className={styles.tdAction}>
                    <button onClick={() => onRemoveColumn(ti, ci)} className={styles.removeBtn} title="Видалити">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
