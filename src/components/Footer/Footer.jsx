import React from "react";
import s from "./Footer.module.css";
import image from "../../assets/index.js";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Footer = ({ onLogoClick, rateStatus, countdown, historyCount, onHistoryClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    // Якщо вже на головній — просто скролимо
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Якщо на іншій сторінці — переходимо на "/" і скролимо після рендеру
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

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
            <button className={s.navLink} onClick={() => scrollToSection("features")}>
              Можливості
            </button>
            <button className={s.navLink} onClick={() => scrollToSection("how-it-works")}>
              Як працює
            </button>
            <button className={s.navLink} onClick={() => scrollToSection("tech-stack")}>
              Стек
            </button>
            <button className={s.navLink} onClick={() => scrollToSection("team")}>
              Команда
            </button>
          </div>

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