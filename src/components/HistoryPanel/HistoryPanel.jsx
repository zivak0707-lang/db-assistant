import React from "react";
import styles from "./HistoryPanel.module.css";

export default function HistoryPanel({ history, onLoad, onClear, onClose }) {
  if (history.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <span className={styles.title}>Останні запити</span>
        <div className={styles.buttons}>
          <button onClick={onClose} className={styles.closeBtn}>
            Закрити
          </button>
          <button onClick={onClear} className={styles.clearBtn}>
            Очистити
          </button>
        </div>
      </div>
      <div className={styles.list}>
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onLoad(item)}
            className={styles.item}
          >
            <div className={styles.itemRow}>
              <span className={styles.itemDomain}>{item.domain}</span>
              <span className={styles.itemBadge}>{item.dbType}</span>
            </div>
            <div className={styles.itemDate}>{item.createdAt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
