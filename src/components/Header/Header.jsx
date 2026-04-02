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
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
              }}
              className={s.navLink}
            >
              Можливості
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("how-it-works");
              }}
              className={s.navLink}
            >
              Як працює
            </a>
            <a
              href="#tech-stack"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("tech-stack");
              }}
              className={s.navLink}
            >
              Стек
            </a>
            <a
              href="#team"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("team");
              }}
              className={s.navLink}
            >
              Команда
            </a>
          </div>

          {/* <button className={s.buttonProject}> */}
          <div className={s.buttons}>
            {/* Кнопка Відкрити демо: 233x53 */}
            <Link
              to="/main"
              style={{ textDecoration: "none", display: "inline-block" }}
            >
              <svg
                width="233"
                height="53"
                viewBox="0 0 233 53"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0 L221 0 L221 12 L233 12 L233 41 L221 41 L221 53 L12 53 L12 41 L0 41 L0 12 L12 12 Z"
                  fill="#95B3FF"
                />
                <text
                  x="116"
                  y="27"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#0a0a1a"
                  fontSize="16"
                  fontWeight="400"
                  fontFamily="Helvetica"
                >
                  Спробувати →
                </text>
              </svg>
            </Link>

            {/* Кнопка Github: 103x53 */}
            <a
              href="https://github.com/zivak0707-lang/db-assistant"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", display: "inline-block" }}
            ></a>
          </div>
          {/* <img src={image.arrow} alt="Arrow" /> */}
          {/* </button> */}
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
