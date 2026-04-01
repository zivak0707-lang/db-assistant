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
      <div className={s.container}>
        <div className={s.helloWrap}>
          <p className={s.description}>
            Опишіть предметну область звичайною мовою — SchemaForge збудує
            ER-діаграму, SQL-схему та тестові дані автоматично. Без зайвих
            інструментів.
          </p>
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
      </div>
    </div>
  );
};

export default TapeAndComp;
