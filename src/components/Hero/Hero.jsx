import React from "react";
import s from "./Hero.module.css";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="container">
      <div className={s.hero}>
        <p className={s.title}>HELLO SCHEMA FORGE</p>
        <p className={s.description}>Від опису до бази даних за 3 секунди</p>
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
                Відкрити демо →
              </text>
            </svg>
          </Link>

          {/* Кнопка Github: 103x53 */}
          <a
            href="https://github.com/zivak0707-lang/db-assistant"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            <svg
              width="103"
              height="53"
              viewBox="0 0 103 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0 L103 0 L103 53 L0 53 L0 41 L12 41 L12 12 L0 12 Z"
                fill="none"
                stroke="#95B3FF"
                strokeWidth="1.5"
              />
              <text
                x="57"
                y="27"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#95B3FF"
                fontSize="16"
                fontWeight="400"
                fontFamily="Helvetica"
              >
                Github
              </text>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
