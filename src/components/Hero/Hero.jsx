import React from "react";
import s from "./Hero.module.css";
import image from "../../assets/index.js";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="container">
      <div className={s.hero}>
        <p className={s.title}>HELLO SCHEMA FORGE</p>
        <p className={s.description}>Від опису до бази даних за 3 секунди</p>
        <div className={s.buttons}>
          <button className={s.buttonProject}>
            <Link to="/main" className={s.buttonLinkMenu}>
              Відкрити демо
            </Link>
            <img src={image.arrow} alt="Arrow" />
          </button>

          <button className={s.buttonGit}>
            <a
              href="https://github.com/zivak0707-lang/db-assistant"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              <svg
                width="40" 
                // width="180" 
                height="64"
                viewBox="0 0 40 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0 L104 0 L104 60 L0 60 L0 40 L16 40 L16 16 L0 16 Z"
                  fill="rgba(147,179,255,0.08)"
                  stroke="#95B3FF"
                  strokeWidth="1.5"
                />
                <text
                  x="60"
                  y="31"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#95B3FF"
                  fontSize="16"
                  fontWeight="400"
                >
                  Github
                </text>
              </svg>
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
