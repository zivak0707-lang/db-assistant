import React from "react";
import s from "./TapeAndComp.module.css";
import image from "../../assets/index";
import Demo from "./Demo/Demo";
import { Link } from "react-router-dom";

const TapeAndComp = () => {
  const texts = ["coders.exe", "SchemaForge"];
  const multiplier = 40;
  const multipliedArray = Array(multiplier).fill(texts).flat();

  return (
    <div className={s.allcont}>
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
        <div className={s.helloWrap} id="features">
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
                <p className={s.terminalAnswer}>• 5 таблиць згенеровано</p>
                <p className={s.terminalAnswer}>• 5 таблиць згенеровано</p>
                <p className={s.terminalAnswer}>• 5 таблиць згенеровано</p>
                <p className={s.terminalAnswer}>• 5 таблиць згенеровано</p>
                <p className={s.terminalAnswer}>• 5 таблиць згенеровано</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={s.whyContainer}>
        <div className={s.whyWrap}>
          <div>
            <p className={s.whyText}>ЧOМУ SCHEMAFORGE</p>
            <div className={s.whyFeatures}>
              <div className={s.whyFeature}>
                /01<p>Повна схема БД за 3 секунди</p>
              </div>
              <div className={s.whyFeature}>
                /02<p>Автоматичний SQL для трьох СУБД</p>
              </div>
              <div className={s.whyFeature}>
                /03<p>Правильні зв'язки та constraints з першого разу</p>
              </div>
              <div className={s.whyFeature}>
                /04<p>Все в одному місці — діаграма, SQL, дані</p>
              </div>
            </div>
          </div>
          <div id="how-it-works">
            <p className={s.howItWorks}>ЯК ЦЕ ПРАЦЮЄ?</p>
            <div className={s.whyBoxes}>
              <div className={s.howBox}>
                /01<p>Повна схема БД за 3 секунди</p>
                <p className={s.howAnswer}>
                  Введіть опис предметної області будь-якою мовою. Чим
                  детальніше - тим краще результат.
                </p>
              </div>
              <div className={s.howBox}>
                /02<p>Автоматичний SQL для трьох СУБД</p>
                <p className={s.howAnswer}>
                  LLaMA 3.3 70B від Groq обробляє запит і проєктує оптимальну
                  структуру з усіма зв'язками.
                </p>
              </div>
              <div className={s.howBox}>
                /03<p>Правильні зв'язки та constraints з першого разу</p>
                <p className={s.howAnswer}>
                  ER-діаграма, SQL DDL, тестові дані та аналіз нормалізації — за
                  ~3 секунди.
                </p>
              </div>
            </div>
          </div>
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
      <div className={s.allNeedContainer}>
        <p className={s.allNeedTitle}>ВСЕ ЩО ПОТРІБНО</p>
        <div className={s.allAnswerBoxes}>
          <div className={s.allAnswerBoxesWrapOne}>
            <div className={s.allAnswerBox}>
              /01<p>ER-діаграма</p>
              <p className={s.allAnswer}>
                Інтерактивна Mermaid-діаграма з автоматичним layout та експортом
                у SVG
              </p>
            </div>
            <div className={s.allAnswerBox}>
              /03<p>SQL генерація</p>
              <p className={s.allAnswer}>
                Готовий DDL для MySQL, PostgreSQL або SQLite з правильними
                типами та ключами
              </p>
            </div>
            <div className={s.allAnswerBox}>
              /05<p>Тестові дані</p>
              <p className={s.allAnswer}>
                Реалістичні INSERT-запити з даними для всіх таблиць, готові до
                вставки
              </p>
            </div>
          </div>
          <div className={s.allAnswerBoxesWrapTwo}>
            <div className={s.allAnswerBox}>
              /02<p>Редагування таблиць</p>
              <p className={s.allAnswer}>
                Клікайте по комірках щоб редагувати. SQL оновлюється синхронно —
                без перегенерації
              </p>
            </div>
            <div className={s.allAnswerBox}>
              /04<p>SQL редактор</p>
              <p className={s.allAnswer}>
                Вбудований редагований редактор — виправляйте помилки AI вручну
                без обмежень
              </p>
            </div>
            <div className={s.allAnswerBox}>
              /06<p>Нормалізація</p>
              <p className={s.allAnswer}>
                Аналіз на 1НФ, 2НФ, 3НФ, BCNF зі score 0-100 та автовиправленням
                через AI
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={s.techWrapConteiner} id="tech-stack">
        <div className={s.techContainer}>
          <p className={s.tehcTitle}>ТЕХНІЧНИЙ СТЕК</p>
          <div className={s.techItems}>
            <p className={s.workType}>Frontend</p>
            <div className={s.techItemsWrap}>
              <div className={s.techItem}>Next.js 16 App Router</div>
              <div className={s.techItem}>React 19 UI core</div>
              <div className={s.techItem}>TypeScript Type safety</div>
              <div className={s.techItem}>CSS Modules Scoped styling</div>
              <div className={s.techItem}>Mermaid.js ER rendering</div>
            </div>
          </div>
          <div className={s.techItems}>
            <p className={s.workType}>AI & INFRA</p>
            <div className={s.techItemsWrap}>
              <div className={s.techItem}>Groq API Inference</div>
              <div className={s.techItem}>LLaMA 3.3 70B Reasoning model</div>
              <div className={s.techItem}>JavaScript Runtime</div>
              <div className={s.techItem}>Node.js Server layer</div>
              <div className={s.techItem}>Vercel Deploy</div>
            </div>
          </div>
        </div>
        <div className={s.demoContainer}>
          <div className={s.demoDescription}>
            <p className={s.demoTitle}>ПОБАЧТЕ SCHEMAFORGE В ДІЇ</p>
            <div className={s.demoDescriptionWrap}>
              <p className={s.demoItem}>input → output</p>
              <p className={s.demoText}>
                AI будує схему з текстового опису за секунди
              </p>
              <p className={s.demoItem}>
                Введення природною мовою, live progress та готовий пакет
                артефактів без перемикань між інструментами.
              </p>
            </div>
          </div>
          <Demo />
        </div>
      </div>
      <div className={s.teamContainer} id="team">
        <p className={s.teamTitle}>КОМАНДА CODERS.EXE</p>
        <div className={s.teamImages}>
          <div className={s.devImgBlock}>
            <img src={image.serioga} className={s.serioga} alt="Serioga" />
            <img src={image.imageBottom} className={s.devBottom} />
            <div>
              <img
                src={image.teamLogo}
                className={s.teamLogo}
                alt="Team Logo"
              />
            </div>
            <div className={s.teamRoles}>
              <p>Backend & AI Architect</p>
            </div>
            <div className={s.teamDecs}>
              <p>SQL Generation</p>
              <p>AI Logic Integration</p>
            </div>
          </div>
          <div className={s.devImgBlock}>
            <img src={image.roma} className={s.serioga} alt="Roma" />
            <img src={image.imageBottom} className={s.devBottom} />
            <div>
              <img
                src={image.teamLogo}
                className={s.teamLogo}
                alt="Team Logo"
              />
            </div>
            <div className={s.teamRoles}>
              <p>Frontend & Visual Developer</p>
            </div>
            <div className={s.teamDecs}>
              <p>Web Integration</p>
              <p>Interface Engineering</p>
            </div>
          </div>
          <div className={s.devImgBlock}>
            <img src={image.zhenya} className={s.serioga} alt="Zhenya" />
            <img src={image.imageBottom} className={s.devBottom} />
            <div>
              <img
                src={image.teamLogo}
                className={s.teamLogo}
                alt="Team Logo"
              />
            </div>
            <div className={s.teamRoles}>
              <p>UX&UI designer</p>
            </div>
            <div className={s.teamDecs}>
              <p>Visual Identity</p>
              <p>Web design</p>
            </div>
          </div>
          <div className={s.devImgBlock}>
            <img src={image.lilia} className={s.serioga} alt="Lilia" />
            <img src={image.imageBottom} className={s.devBottom} />
            <div>
              <img
                src={image.teamLogo}
                className={s.teamLogo}
                alt="Team Logo"
              />
            </div>
            <div className={s.teamRoles}>
              <p>QA & Product Manager</p>
            </div>
            <div className={s.teamDecs}>
              <p>Copywriting</p>
              <p>Pitch Deck</p>
            </div>
          </div>
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
      <div className={s.preFooter}>
        <div className={s.preFooterWrap}>
          <p className={s.title}>
            ГОТОВІ СПРОБУВАТИ? <br></br>
            Запустіть SchemaForge прямо зараз
          </p>
          <p>Безкоштовно. Без реєстрації. Перший результат за 3 секунди</p>
          <div className={s.buttonWrap}>
            <button className={s.buttonProject}>
              <Link to="/main" className={s.buttonLinkMenu}>
                <p className={s.buttonLinkMenu}></p>Відкрити демо
              </Link>
              <img src={image.arrow} alt="Arrow" />
            </button>
            <p className={s.buttonLinkGitText}>
              або переглянь код на {""}
              <a
                href="https://github.com/zivak0707-lang/db-assistant"
                className={s.buttonLinkGit}
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapeAndComp;
