import React from "react";
import { useDBAssistant } from "./hooks/useDBAssistant";
import HistoryPanel from "./components/HistoryPanel/HistoryPanel";
import InputSection from "./components/InputSection/InputSection";
import TabER from "./components/TabER/TabER";
import TabTables from "./components/TabTables/TabTables";
import TabSQL from "./components/TabSQL/TabSQL";
import TabSeed from "./components/TabSeed/TabSeed";
import TabNormalize from "./components/TabNormalize/TabNormalize";
import RefineChat from "./components/RefineChat/RefineChat";
import styles from "./App.module.css";
import s from "./components/TapeAndComp/TapeAndComp.module.css";
import image from "./assets";
import { formatTime } from "./types/index.js";

const TABS = [
  { id: "er", label: "ER Діаграма" },
  { id: "tables", label: "Таблиці" },
  { id: "sql", label: "SQL" },
  { id: "seed", label: "Seed" },
  { id: "normalize", label: "Нормалізація" },
];

const MainPage = ({
  onLogoClick,
  rateStatus,
  countdown,
  historyCount,
  onHistoryClick,
}) => {
  const db = useDBAssistant();
  const { history, rateLimit } = db;
  const isLimited = rateStatus === "limited";

  const texts = ["coders.exe", "SchemaForge"];
  const multiplier = 40;
  const multipliedArray = Array(multiplier).fill(texts).flat();

  return (
    <main className={styles.main}>
      <div ref={db.topRef} />
      <div className={styles.content}>
        {history.showHistory && (
          <HistoryPanel
            history={history.history}
            onLoad={(item) => {
              db.loadFromHistory(item);
              history.setShowHistory(false);
            }}
            onClear={history.clear}
          />
        )}
        <div>
          <div className={s.inner}>
            <button onClick={onLogoClick} className={s.logo}>
              <div className={s.logoBadge}>DB</div>
              <div className={s.logoText}>
                <h1 className={s.logoTitle}>DB Assistant</h1>
                <p className={s.logoSub}>Генератор баз даних на основі AI</p>
              </div>
            </button>

            <div className={s.controls}>
            <div className={s.status}>
              <div
                className={`${styles.statusBadge} ${isLimited ? styles.statusLimited : styles.statusOk}`}
              >
                <div
                  className={`${styles.statusDot} ${isLimited ? styles.dotLimited : styles.dotOk}`}
                />
                {isLimited
                  ? `Ліміт вичерпано${countdown ? ` · ${formatTime(countdown)}` : ""}`
                  : "AI готовий"}
              </div>
              {historyCount > 0 && (
                <button onClick={onHistoryClick} className={styles.historyBtn}>
                  🕐 Історія ({historyCount})
                </button>
              )}
            </div>
          </div>
        </div>

        {isLimited && (
          <div className={styles.limitBar}>
            <span className={styles.limitText}>
              ⚠ Денний ліміт токенів Groq вичерпано.
            </span>
            {countdown !== null && (
              <span className={styles.limitCountdown}>
                Відновлення через: <strong>{formatTime(countdown)}</strong>
              </span>
            )}
          </div>
        )}
        </div>
        <a href="#" onClick={onLogoClick} className={styles.logo}>
          <img src={image.logo} alt="logo" />
          <div className={styles.logoText}>
            <h1 className={styles.logoTitle}>SchemaForge</h1>
            <p className={styles.logoSub}>by coders.exe</p>
          </div>
        </a>
        <InputSection
          domain={db.domain}
          dbType={db.dbType}
          loading={db.loading}
          isLimited={rateLimit.isLimited}
          countdown={rateLimit.countdown}
          error={db.error}
          onDomainChange={db.setDomain}
          onDbTypeChange={db.setDbType}
          onGenerate={db.handleGenerate}
        />

        {/* {db.result?.explanation && (
          <div className={styles.explanation}>
            <div className={styles.explanationLabel}>
              💡 Пояснення структури від AI
            </div>
            <p className={styles.explanationText}>{db.result.explanation}</p>
          </div>
        )} */}

        {db.result && (
          <div className={styles.resultCard}>
            <div className={styles.tabs}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => db.setActiveTab(tab.id)}
                  className={`${styles.tab} ${db.activeTab === tab.id ? styles.tabActive : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {db.activeTab === "er" && (
                <TabER
                  diagram={db.result.er_diagram}
                  erRef={db.erRef}
                  onDownload={db.downloadERDiagram}
                />
              )}
              {db.activeTab === "tables" && (
                <TabTables
                  tables={db.result.tables}
                  editingCell={db.editingCell}
                  editValue={db.editValue}
                  onEditValueChange={db.setEditValue}
                  onStartEdit={db.startEdit}
                  onSaveEdit={db.saveEdit}
                  onCancelEdit={() => db.setEditValue("")}
                  onAddColumn={db.addColumn}
                  onRemoveColumn={db.removeColumn}
                />
              )}
              {db.activeTab === "sql" && (
                <TabSQL
                  sql={db.result.sql}
                  dbType={db.result.dbType || db.dbType}
                  copied={db.copied}
                  onCopy={db.copySQL}
                  onDownload={db.downloadSQL}
                  onSQLChange={db.updateSQL}
                />
              )}
              {db.activeTab === "seed" && (
                <TabSeed
                  seedSQL={db.seedSQL}
                  loading={db.seedLoading}
                  isLimited={rateLimit.isLimited}
                  copied={db.seedCopied}
                  onGenerate={db.handleGenerateSeed}
                  onCopy={db.copySeed}
                  onDownload={db.downloadSeed}
                />
              )}
              {db.activeTab === "normalize" && (
                <TabNormalize
                  normalizeResult={db.normalizeResult}
                  loading={db.normalizeLoading}
                  isLimited={rateLimit.isLimited}
                  fixingIssue={db.fixingIssue}
                  onCheck={db.handleNormalize}
                  onFix={db.fixIssueWithAI}
                />
              )}
            </div>
          </div>
        )}

        {db.result && (
          <RefineChat
            chatHistory={db.chatHistory}
            refineMsg={db.refineMsg}
            refineLoading={db.refineLoading}
            refineError={db.refineError}
            isLimited={rateLimit.isLimited}
            countdown={rateLimit.countdown}
            chatEndRef={db.chatEndRef}
            onMsgChange={db.setRefineMsg}
            onSend={db.handleRefine}
          />
        )}
      </div>
      <div className={s.wrapperDemo}>
        <div className={s.trackDemo}>
          {multipliedArray.map((text, index) => (
            <span key={index} className={s.infiniteTextDemo}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MainPage;
