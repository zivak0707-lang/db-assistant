import React from "react";
import { formatTime } from "../../types";
import s from "./Header.module.css";
import image from "../../assets/index.js";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header({
  onLogoClick,
  rateStatus,
  countdown,
  historyCount,
  onHistoryClick,
}) {
  const isLimited = rateStatus === "limited";
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className={s.container}>
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
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection("features"); }} className={s.navLink}>
              Можливості
            </a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection("how-it-works"); }} className={s.navLink}>
              Як працює
            </a>
            <a href="#tech-stack" onClick={(e) => { e.preventDefault(); scrollToSection("tech-stack"); }} className={s.navLink}>
              Стек
            </a>
            <a href="#team" onClick={(e) => { e.preventDefault(); scrollToSection("team"); }} className={s.navLink}>
              Команда
            </a>
          </div>

          <button className={s.buttonProject}>
            <Link to="/main" className={s.buttonLinkMenu}>
              <p className={s.buttonLinkMenu}></p>Спробувати
            </Link>
            <img src={image.arrow} alt="Arrow" />
          </button>
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