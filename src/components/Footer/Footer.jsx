import React from "react";
import s from "./Footer.module.css";
import image from "../../assets/index.js";
import { Link } from "react-router-dom";

const Footer = ({
  onLogoClick,
  rateStatus,
  countdown,
  historyCount,
  onHistoryClick,
}) => {
  return (
    <div className="container">
      <div className={s.footer}>
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
          {/* <div className={s.controls}>
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
          </div> */}
          <button className={s.buttonProject}>
            <Link to="/main" className={s.buttonLinkMenu}>
              <p className={s.buttonLinkMenu}></p>Спробувати
            </Link>
            <img src={image.arrow} alt="Arrow" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
