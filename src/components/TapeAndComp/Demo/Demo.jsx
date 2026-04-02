import React, { useState } from "react";
import s from "./Demo.module.css";

// ─── SQL Preview ───────────────────────────────────────────────
const SqlPreview = () => {
  const [activeDb, setActiveDb] = useState("mysql");

  const SQL_CODE = {
    mysql: `CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

ALTER TABLE orders 
  ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id)
  REFERENCES users(id);`,
    postgresql: `CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE orders
  ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id)
  REFERENCES users(id);`,
    sqlite: `CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_orders_user
  ON orders(user_id);`,
  };

  const DBS = ["mysql", "postgresql", "sqlite"];

  return (
    <div className={s.sqlPreview}>
      <div className={s.sqlDatabases}>
        <p className={s.sqlDbTitle}>DATABASES</p>
        {DBS.map((db) => (
          <button
            key={db}
            className={`${s.sqlDbButton} ${activeDb === db ? s.sqlDbButtonActive : ""}`}
            onClick={() => setActiveDb(db)}
          >
            {db.charAt(0).toUpperCase() + db.slice(1)}
          </button>
        ))}
      </div>
      <div className={s.sqlEditor}>
        <div className={s.sqlEditorHeader}>
          <span className={s.sqlFileName}>schema.sql</span>
          <span className={s.sqlValidated}>Validated</span>
        </div>
        <div className={s.sqlCode}>
          <pre>
            {SQL_CODE[activeDb].split("\n").map((line, i) => (
              <div key={i} className={s.sqlLine}>
                <span className={s.sqlLineNum}>{i + 1}</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: line
                      .replace(
                        /\b(CREATE|TABLE|ALTER|ADD|CONSTRAINT|FOREIGN KEY|REFERENCES|PRIMARY KEY|NOT NULL|AUTOINCREMENT|INDEX|ON)\b/g,
                        '<span style="color:#569cd6">$1</span>',
                      )
                      .replace(
                        /\b(BIGINT|VARCHAR|TIMESTAMP|BIGSERIAL|TIMESTAMPTZ|INTEGER|TEXT)\b/g,
                        '<span style="color:#4ec9b0">$1</span>',
                      )
                      .replace(
                        /\b(users|orders|order_items|products|categories)\b/g,
                        '<span style="color:#ce9178">$1</span>',
                      ),
                  }}
                />
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ─── Normalization Preview ──────────────────────────────────────
const NormalizationPreview = () => {
  const checks = [
    {
      label: "1НФ",
      desc: "Усі атрибути атомарні",
      status: "Pass",
      color: "#34d399",
    },
    {
      label: "2НФ",
      desc: "Складені залежності усунені",
      status: "Pass",
      color: "#34d399",
    },
    {
      label: "BCNF",
      desc: "Рекомендовано винести address_history",
      status: "Review",
      color: "#fbbf24",
    },
  ];

  return (
    <div className={s.normPreview}>
      {/* Ліва — score */}
      <div className={s.normScore}>
        <p className={s.normScoreTitle}>NORMALIZATION</p>
        <div className={s.normScoreBox}>
          <p className={s.normScoreLabel}>Score</p>
          <p className={s.normScoreValue}>92</p>
          <p className={s.normScoreStatus}>3НФ готова</p>
        </div>
      </div>

      {/* Права — чекліст */}
      <div className={s.normChecks}>
        {checks.map((c) => (
          <div key={c.label} className={s.normCheck}>
            <div className={s.normCheckHeader}>
              <span className={s.normCheckLabel}>{c.label}</span>
              <span
                className={s.normCheckStatus}
                style={{
                  color: c.color,
                  borderColor: c.color,
                  background: `${c.color}18`,
                }}
              >
                {c.status}
              </span>
            </div>
            <p className={s.normCheckDesc}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TAB_CONTENT ───────────────────────────────────────────────
const TAB_CONTENT = {
  generation: {
    // label: "input → output",
    // title: "Prompt Studio",
    // desc1: "Describe your domain",
    // desc2: "Інтернет-магазин з товарами, категоріями, замовленнями та покупцями",
    // desc3: "Analyzing entities, attributes and constraints...",
    preview: (
      <div>
        <div className={s.promptStudio}>
          <div className={s.promptHeader}>
            <div className={s.promptDots}>
              <span className={s.dotRed}></span>
              <span className={s.dotYellow}></span>
              <span className={s.dotGreen}></span>
            </div>
            <span className={s.promptTitle}>Prompt Studio</span>
          </div>
          <div className={s.promptBody}>
            <p className={s.promptPlaceholder}>Describe your domain</p>
            <p className={s.promptInput}>
              Інтернет-магазин з товарами, категоріями, замовленнями та
              покупцями
            </p>
            <p className={s.promptAnalyzing}>
              Analyzing entities, attributes and constraints...
            </p>
          </div>
        </div>
        <div className={s.promptFooter}>
          <span>✅ 5 таблиць згенеровано</span>
          <span>✅ ER-діаграма готова</span>
          <span>✅ SQL DDL для MySQL</span>
        </div>
      </div>
    ),
  },
  er: {
    label: "VISUAL MODELING",
    title: "Зв'язки, ключі та залежності видно одразу",
    desc: "Чистий dark UI з Mermaid-візуалізацією, мінімапою та панеллю з метаданими таблиць.",
    preview: (
      <div className={s.erPreview}>
        <div className={s.erEntities}>
          <p className={s.erEntitiesTitle}>ENTITIES</p>
          {["users", "orders", "products", "categories", "order_items"].map(
            (e) => (
              <div key={e} className={s.erEntity}>
                {e}
              </div>
            ),
          )}
        </div>
        <div className={s.erDiagram}>
          <svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="200"
              y1="80"
              x2="310"
              y2="150"
              stroke="#6c63ff"
              strokeWidth="1.5"
            />
            <line
              x1="380"
              y1="60"
              x2="310"
              y2="150"
              stroke="#a78bfa"
              strokeWidth="1.5"
            />
            <line
              x1="170"
              y1="220"
              x2="310"
              y2="150"
              stroke="#34d399"
              strokeWidth="1.5"
            />
            <line
              x1="420"
              y1="210"
              x2="310"
              y2="150"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            {[
              { x: 140, y: 65, label: "products" },
              { x: 340, y: 45, label: "categories" },
              { x: 275, y: 135, label: "order_items" },
              { x: 120, y: 205, label: "orders" },
              { x: 385, y: 195, label: "users" },
            ].map(({ x, y, label }) => (
              <g key={label}>
                <rect
                  x={x - 45}
                  y={y - 16}
                  width={90}
                  height={32}
                  rx={6}
                  fill="#1a1a2e"
                  stroke={label === "order_items" ? "#fbbf24" : "#2a2a4a"}
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill="#ccc"
                  fontSize="12"
                  fontFamily="monospace"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    ),
  },
  sql: {
    label: "DDL EDITOR",
    title: "Редагуйте SQL вручну без втрати синхронізації",
    desc: "Код, статус валідації та перемикання між MySQL / PostgreSQL / SQLite в одному вікні.",
    preview: <SqlPreview />,
  },
  normalization: {
    label: "QUALITY SCORE",
    title: "SchemaForge підсвічує слабкі місця структури",
    desc: "1НФ, 2НФ, 3НФ, BCNF, score та рекомендації AI для покращення схеми.",
    preview: <NormalizationPreview />,
  },
};

const TABS = [
  { key: "generation", label: "⚡ Генерація" },
  { key: "er", label: "🗂 ER-діаграма" },
  { key: "sql", label: "💾 SQL редактор" },
  { key: "normalization", label: "🔍 Нормалізація" },
];

// ─── Demo ───────────────────────────────────────────────────────
const Demo = () => {
  const [activeTab, setActiveTab] = useState("generation");
  const content = TAB_CONTENT[activeTab];

  return (
    <div className={s.demoContainer}>
      <p className={s.demoTitle}>ПОБАЧТЕ SCHEMAFORGE В ДІЇ</p>

      <div className={s.demoTabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${s.demoButton} ${activeTab === tab.key ? s.demoButtonActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={s.demoContent}>
        <p className={s.demoLabel}>{content.label}</p>
        <p className={s.demoHeading}>{content.title}</p>
        <p className={s.demoDesc}>{content.desc}</p>
        {content.preview && (
          <div className={s.demoPreview}>{content.preview}</div>
        )}
      </div>
    </div>
  );
};

export default Demo;
