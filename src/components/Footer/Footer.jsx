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
      </div>
    </div>
  );
};

export default Footer;