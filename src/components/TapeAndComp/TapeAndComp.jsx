import React from "react";
import s from "./TapeAndComp.module.css";
import image from "../../assets/index";

const TapeAndComp = () => {
  const texts = ["coders.exe", "SchemaForge"];
  const multiplier = 40;
  const multipliedArray = Array(multiplier).fill(texts).flat();

  const duplicatedTexts = [...texts, ...texts, ...texts, ...texts];

  return (
    <div>
      <div className={s.wrapper}>
        <div className={s.track}>
          {multipliedArray.map((text, index) => (
            <span key={index} className={s.infiniteText}>
              {text}
            </span>
          ))}
        </div>
      </div>
      <div className={s.containerHello}>
        <div className={s.helloWrap}>
          <p className={s.description}>
            Опишіть предметну область звичайною мовою — SchemaForge збудує
            ER-діаграму, SQL-схему та тестові дані автоматично. Без зайвих
            інструментів.
          </p>
        </div>
      </div>
      <div className={s.wrapper}>
        <div className={s.track}>
          {multipliedArray.map((text, index) => (
            <span key={index} className={s.infiniteText}>
              {text}
            </span>
          ))}
        </div>
      </div>
      <div className={s.container}>
        <div className={s.featuresContainer}>
          <div className={s.features}>
            <div className={s.feature}>3 сек генерації</div>
            <div className={s.feature}>MySQL / PostgreSQL / SQLite</div>
            <div className={s.feature}>LLaMA 3.3 70B</div>
          </div>
          <div className={s.terminalWrapper}>
            <div className={s.terminal}>
              <div className={s.terminalImage}>
                <div className={s.terminalImageRed}></div>
                <div className={s.terminalImageYellow}></div>
                <div className={s.terminalImageGreen}></div>
              </div>

              <p>SCHEMAFORGE TERMINAL</p>
            </div>
            <div className={s.terminalContent}>
              <div className={s.terminalCommands}>
                <p className={s.terminalCommand}>
                  $ describe » Інтернет-магазин з товарами, категоріями,
                  замовленнями та покупцями
                </p>
                <p className={s.terminalCommand}>↓</p>
              </div>
              <div сlassName={s.terminalAnswers}>
                <p className={s.terminalAnswer}>
                  • 5 таблиць згенеровано
                </p>
                <p className={s.terminalAnswer}>
                  • 5 таблиць згенеровано
                </p>
                <p className={s.terminalAnswer}>
                  • 5 таблиць згенеровано
                </p>
                <p className={s.terminalAnswer}>
                  • 5 таблиць згенеровано
                </p>
                <p className={s.terminalAnswer}>
                  • 5 таблиць згенеровано
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapeAndComp;
