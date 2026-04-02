import React from "react";
import { formatTime } from "../../types";
import s from "./Header.module.css";
import image from "../../assets/index.js";


export default function Header({
  onLogoClick,
  rateStatus,
  countdown,
  historyCount,
  onHistoryClick,
}) {
  const isLimited = rateStatus === "limited";

  return (
    <div className="container">
      <header className={s.header}>
        <div className={s.inner}>
          
          <a href="#" onClick={onLogoClick} className={s.logo}>
            <img src={image.logo} alt="logo" />
            <div className={s.logoText}>
              <h1 className={s.logoTitle}>SchemaForge</h1>
              <p className={s.logoSub}>by coders.exe</p>
            </div>
          </a>
          <div className={s.navLinks}>
            <a href="#" className={s.navLink}>
              Можливості
            </a>
            <a href="#" className={s.navLink}>
              Як працює
            </a>
            <a href="#" className={s.navLink}>
              Стек
            </a>
            <a href="#" className={s.navLink}>
              Команда
            </a>
          </div>
          <div className={s.controls}>
            <div className={s.status}>
              <div
                className={`${s.statusBadge} ${isLimited ? s.statusLimited : s.statusOk}`}
              >
                <div
                  className={`${s.statusDot} ${isLimited ? s.dotLimited : s.dotOk}`}
                />
                {isLimited
                  ? `Ліміт вичерпано${countdown ? ` · ${formatTime(countdown)}` : ""}`
                  : "AI готовий"}
              </div>
              {historyCount > 0 && (
                <button onClick={onHistoryClick} className={s.historyBtn}>
                  🕐 Історія ({historyCount})
                </button>
              )}
            </div>
          </div>
        </div>

        {isLimited && (
          <div className={s.limitBar}>
            <span className={s.limitText}>
              ⚠ Денний ліміт токенів Groq вичерпано.
            </span>
            {countdown !== null && (
              <span className={s.limitCountdown}>
                Відновлення через: <strong>{formatTime(countdown)}</strong>
              </span>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
