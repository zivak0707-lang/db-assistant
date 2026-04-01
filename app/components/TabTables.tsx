'use client'

import { Table, Column, EditingCell } from '../types'

interface TabTablesProps {
  tables: Table[]
  editingCell: EditingCell | null
  editValue: string
  onEditValueChange: (val: string) => void
  onStartEdit: (tableIdx: number, colIdx: number, field: keyof Column) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onAddColumn: (tableIdx: number) => void
  onRemoveColumn: (tableIdx: number, colIdx: number) => void
}

const FIELD_COLORS: Record<keyof Column, string> = {
  name: 'font-mono text-green-400',
  type: 'text-yellow-400',
  constraints: 'text-purple-400',
  description: 'text-gray-400',
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
}: TabTablesProps) {
  return (
    <div className="space-y-6">
      <div className="text-xs text-gray-500 mb-2">
        💡 Натисни на комірку щоб редагувати → Enter зберегти, Escape скасувати
      </div>
      {tables.map((table, ti) => (
        <div key={ti} className="border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2">
            <span className="text-sm font-medium text-blue-400">{table.name}</span>
            <span className="text-xs text-gray-500">— {table.description}</span>
            <button
              onClick={() => onAddColumn(ti)}
              className="ml-auto text-xs bg-green-900 hover:bg-green-800 text-green-300 px-2 py-1 rounded transition-colors"
            >
              + Колонка
            </button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700 text-gray-500">
                <th className="text-left px-4 py-2 font-medium">Колонка</th>
                <th className="text-left px-4 py-2 font-medium">Тип</th>
                <th className="text-left px-4 py-2 font-medium">Обмеження</th>
                <th className="text-left px-4 py-2 font-medium">Опис</th>
                <th className="px-2 py-2 w-8" />
              </tr>
            </thead>
            <tbody>
              {table.columns.map((col, ci) => (
                <tr key={ci} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors group">
                  {(['name', 'type', 'constraints', 'description'] as (keyof Column)[]).map(field => (
                    <td key={field} className="px-4 py-2">
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
                          className="w-full bg-gray-700 border border-blue-500 rounded px-2 py-0.5 text-xs text-white outline-none"
                        />
                      ) : (
                        <span
                          onClick={() => onStartEdit(ti, ci, field)}
                          title="Натисни щоб редагувати"
                          className={`cursor-pointer hover:bg-gray-700 rounded px-1 py-0.5 transition-colors inline-block ${FIELD_COLORS[field]}`}
                        >
                          {col[field] || '—'}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => onRemoveColumn(ti, ci)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all text-sm"
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