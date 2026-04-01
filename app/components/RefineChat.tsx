'use client'

import { RefObject } from 'react'
import { ChatMessage } from '../types'

const HINTS = [
  'Додай таблицю коментарів',
  'Зроби email унікальним',
  'Додай created_at до всіх таблиць',
  'Розбий адресу на окрему таблицю',
]

interface RefineChatProps {
  chatHistory: ChatMessage[]
  refineMsg: string
  refineLoading: boolean
  refineError: string
  isLimited: boolean
  countdown: number | null
  chatEndRef: RefObject<HTMLDivElement>
  onMsgChange: (val: string) => void
  onSend: () => void
}

export default function RefineChat({
  chatHistory,
  refineMsg,
  refineLoading,
  refineError,
  isLimited,
  countdown,
  chatEndRef,
  onMsgChange,
  onSend,
}: RefineChatProps) {
  return (
    <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
        <span className="text-sm font-medium">💬 Уточнити схему</span>
        <span className="text-xs text-gray-500">— попроси AI змінити структуру</span>
      </div>

      {chatHistory.length > 0 && (
        <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-700 text-white'
                  : msg.text.startsWith('❌')
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-gray-800 text-gray-200'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}

      <div className="px-5 py-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={refineMsg}
            onChange={e => onMsgChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !refineLoading && !isLimited && onSend()}
            placeholder='Наприклад: "Додай таблицю знижок" або "Зроби email унікальним"'
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            disabled={refineLoading || isLimited}
          />
          <button
            onClick={onSend}
            disabled={refineLoading || !refineMsg.trim() || isLimited}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex-shrink-0"
          >
            {refineLoading ? '⏳' : 'Надіслати'}
          </button>
        </div>

        {refineError && (
          <div className="mt-2 text-xs text-red-400">❌ {refineError}</div>
        )}
        {isLimited && countdown !== null && (
          <div className="mt-2 text-xs text-yellow-400">
            ⏳ AI буде доступний через {countdown}с
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {HINTS.map((hint, i) => (
            <button
              key={i}
              onClick={() => onMsgChange(hint)}
              disabled={isLimited}
              className="text-xs text-gray-500 hover:text-gray-300 disabled:opacity-40 border border-gray-700 hover:border-gray-500 px-2 py-1 rounded transition-colors"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}