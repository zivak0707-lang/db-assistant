import React from "react";
import { useDBAssistant } from "./hooks/useDBAssistant";
import { useHistory } from "./hooks/useHistory";       // adjust import paths
import { useRateLimit } from "./hooks/useRateLimit";   // adjust import paths
import HistoryPanel from "./components/HistoryPanel/HistoryPanel";
import InputSection from "./components/InputSection/InputSection";
import TabER from "./components/TabER/TabER";
import TabTables from "./components/TabTables/TabTables";
import TabSQL from "./components/TabSQL/TabSQL";
import TabSeed from "./components/TabSeed/TabSeed";
import TabNormalize from "./components/TabNormalize/TabNormalize";
import RefineChat from "./components/RefineChat/RefineChat";
import styles from "./App.module.css";

const TABS = [
  { id: "er", label: "ER Діаграма" },
  { id: "tables", label: "Таблиці" },
  { id: "sql", label: "SQL" },
  { id: "seed", label: "Seed" },
  { id: "normalize", label: "Нормалізація" },
];

const MainPage = () => {
  const db = useDBAssistant();
  const history = useHistory();       // use your actual hook name
  const rateLimit = useRateLimit();   // use your actual hook name

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

        {db.result?.explanation && (
          <div className={styles.explanation}>
            <div className={styles.explanationLabel}>
              💡 Пояснення структури від AI
            </div>
            <p className={styles.explanationText}>{db.result.explanation}</p>
          </div>
        )}

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
    </main>
  );
};

export default MainPage;