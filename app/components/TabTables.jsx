'use client'

import s from './TabTables.module.css'

const FIELD_CLASSES = {
  name: s.cellName,
  type: s.cellType,
  constraints: s.cellConstraints,
  description: s.cellDescription,
}

export default function TabTables({
  tables,
  editingCell,
  editValue,
  onEditValueChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onAddColumn,
  onRemoveColumn,
}) {
  return (
    <div className={s.wrapper}>
      <div className={s.hint}>
        💡 Натисни на комірку щоб редагувати → Enter зберегти, Escape скасувати
      </div>

      {tables.map((table, ti) => (
        <div key={ti} className={s.tableBlock}>
          <div className={s.tableHeader}>
            <span className={s.tableName}>{table.name}</span>
            <span className={s.tableDesc}>— {table.description}</span>
            <button onClick={() => onAddColumn(ti)} className={s.addColBtn}>
              + Колонка
            </button>
          </div>

          <table className={s.table}>
            <thead>
              <tr className={s.theadRow}>
                <th className={s.th}>Колонка</th>
                <th className={s.th}>Тип</th>
                <th className={s.th}>Обмеження</th>
                <th className={s.th}>Опис</th>
                <th className={s.thAction} />
              </tr>
            </thead>
            <tbody>
              {table.columns.map((col, ci) => (
                <tr key={ci} className={s.row}>
                  {['name', 'type', 'constraints', 'description'].map(field => (
                    <td key={field} className={s.td}>
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
                          className={s.editInput}
                        />
                      ) : (
                        <span
                          onClick={() => onStartEdit(ti, ci, field)}
                          title="Натисни щоб редагувати"
                          className={`${s.cellValue} ${FIELD_CLASSES[field]}`}
                        >
                          {col[field] || '—'}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className={s.tdAction}>
                    <button
                      onClick={() => onRemoveColumn(ti, ci)}
                      className={s.removeBtn}
                      title="Видалити"
                    >
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
