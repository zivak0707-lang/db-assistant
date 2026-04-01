'use client'

import s from './RefineChat.module.css'

const HINTS = [
  'Додай таблицю коментарів',
  'Зроби email унікальним',
  'Додай created_at до всіх таблиць',
  'Розбий адресу на окрему таблицю',
]

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
}) {
  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <span className={s.headerTitle}>💬 Уточнити схему</span>
        <span className={s.headerSub}>— попроси AI змінити структуру</span>
      </div>

      {chatHistory.length > 0 && (
        <div className={s.messages}>
          {chatHistory.map((msg, i) => (
            <div key={i} className={`${s.msgRow} ${msg.role === 'user' ? s.msgRowUser : s.msgRowAi}`}>
              <div className={`${s.bubble} ${
                msg.role === 'user' ? s.bubbleUser
                  : msg.text.startsWith('❌') ? s.bubbleError
                  : s.bubbleAi
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}

      <div className={s.inputArea}>
        <div className={s.inputRow}>
          <input
            type="text"
            value={refineMsg}
            onChange={e => onMsgChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !refineLoading && !isLimited && onSend()}
            placeholder='Наприклад: "Додай таблицю знижок" або "Зроби email унікальним"'
            className={s.input}
            disabled={refineLoading || isLimited}
          />
          <button
            onClick={onSend}
            disabled={refineLoading || !refineMsg.trim() || isLimited}
            className={`${s.sendBtn} ${refineLoading || !refineMsg.trim() || isLimited ? s.sendBtnDisabled : ''}`}
          >
            {refineLoading ? '⏳' : 'Надіслати'}
          </button>
        </div>

        {refineError && <div className={s.error}>❌ {refineError}</div>}

        {isLimited && countdown !== null && (
          <div className={s.limitMsg}>⏳ AI буде доступний через {countdown}с</div>
        )}

        <div className={s.hints}>
          {HINTS.map((hint, i) => (
            <button
              key={i}
              onClick={() => onMsgChange(hint)}
              disabled={isLimited}
              className={`${s.hintBtn} ${isLimited ? s.hintBtnDisabled : ''}`}
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
