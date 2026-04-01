import React from 'react'
import styles from './RefineChat.module.css'

const HINTS = [
  'Додай таблицю коментарів',
  'Зроби email унікальним',
  'Додай created_at до всіх таблиць',
  'Розбий адресу на окрему таблицю',
]

export default function RefineChat({
  chatHistory, refineMsg, refineLoading, refineError,
  isLimited, countdown, chatEndRef, onMsgChange, onSend,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>💬 Уточнити схему</span>
        <span className={styles.headerSub}>— попроси AI змінити структуру</span>
      </div>

      {chatHistory.length > 0 && (
        <div className={styles.messages}>
          {chatHistory.map((msg, i) => (
            <div key={i} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgRowUser : styles.msgRowAi}`}>
              <div className={`${styles.bubble} ${
                msg.role === 'user' ? styles.bubbleUser
                  : msg.text.startsWith('❌') ? styles.bubbleError
                  : styles.bubbleAi
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}

      <div className={styles.inputArea}>
        <div className={styles.inputRow}>
          <input
            type="text"
            value={refineMsg}
            onChange={e => onMsgChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !refineLoading && !isLimited && onSend()}
            placeholder='Наприклад: "Додай таблицю знижок" або "Зроби email унікальним"'
            className={styles.input}
            disabled={refineLoading || isLimited}
          />
          <button
            onClick={onSend}
            disabled={refineLoading || !refineMsg.trim() || isLimited}
            className={`${styles.sendBtn} ${refineLoading || !refineMsg.trim() || isLimited ? styles.sendBtnDisabled : ''}`}
          >
            {refineLoading ? '⏳' : 'Надіслати'}
          </button>
        </div>

        {refineError && <div className={styles.error}>❌ {refineError}</div>}

        {isLimited && countdown !== null && (
          <div className={styles.limitMsg}>⏳ AI буде доступний через {countdown}с</div>
        )}

        <div className={styles.hints}>
          {HINTS.map((hint, i) => (
            <button
              key={i}
              onClick={() => onMsgChange(hint)}
              disabled={isLimited}
              className={`${styles.hintBtn} ${isLimited ? styles.hintBtnDisabled : ''}`}
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
