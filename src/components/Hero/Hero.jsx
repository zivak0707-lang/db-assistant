import React from "react";
import s from "./Hero.module.css";
import image from "../../assets/index.js";

const Hero = () => {
  return (
    <div className="container">
      <div className={s.hero}>
        <p className={s.title}>HELLO SCHEMA FORGE</p>
        <p className={s.description}>Від опису до бази даних за 3 секунди</p>
        <div className={s.buttons}>
          <button className={s.buttonMenu}>
            <a href="#" className={s.buttonLinkMenu}>
              Відкрити демо
            </a>{" "}
            <img src={image.arrow} alt="Arrow" />
          </button>
          <button className={s.buttonGit}>
            <a href="#" className={s.buttonLinkGit}>
              GitHub
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
