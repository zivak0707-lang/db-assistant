'use client'

import { useDBAssistant } from './hooks/useDBAssistant'
import Header from './components/Header'
import HistoryPanel from './components/HistoryPanel'
import InputSection from './components/InputSection'
import TabER from './components/TabER'
import TabTables from './components/TabTables'
import TabSQL from './components/TabSQL'
import TabSeed from './components/TabSeed'
import TabNormalize from './components/TabNormalize'
import RefineChat from './components/RefineChat'
import s from './page.module.css'

const TABS = [
  { id: 'er',        label: '📊 ER-діаграма' },
  { id: 'tables',    label: '📋 Таблиці' },
  { id: 'sql',       label: '💾 SQL код' },
  { id: 'seed',      label: '🌱 Тестові дані' },
  { id: 'normalize', label: '🔍 Нормалізація' },
]

export default function Home() {
  const db = useDBAssistant()
  const { rateLimit, history } = db

  return (
    <main className={s.main}>
      <div ref={db.topRef} />

      <Header
        onLogoClick={db.resetToHome}
        rateStatus={rateLimit.isLimited ? 'limited' : 'ok'}
        countdown={rateLimit.countdown}
        historyCount={history.history.length}
        onHistoryClick={() => history.setShowHistory(!history.showHistory)}
      />

      <div className={s.content}>

        {history.showHistory && (
          <HistoryPanel
            history={history.history}
            onLoad={item => {
              db.loadFromHistory(item)
              history.setShowHistory(false)
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
          <div className={s.explanation}>
            <div className={s.explanationLabel}>💡 Пояснення структури від AI</div>
            <p className={s.explanationText}>{db.result.explanation}</p>
          </div>
        )}

        {db.result && (
          <div className={s.resultCard}>

            {/* Tabs nav */}
            <div className={s.tabs}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => db.setActiveTab(tab.id)}
                  className={`${s.tab} ${db.activeTab === tab.id ? s.tabActive : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={s.tabContent}>
              {db.activeTab === 'er' && (
                <TabER
                  diagram={db.result.er_diagram}
                  erRef={db.erRef}
                  onDownload={db.downloadERDiagram}
                />
              )}

              {db.activeTab === 'tables' && (
                <TabTables
                  tables={db.result.tables}
                  editingCell={db.editingCell}
                  editValue={db.editValue}
                  onEditValueChange={db.setEditValue}
                  onStartEdit={db.startEdit}
                  onSaveEdit={db.saveEdit}
                  onCancelEdit={() => db.setEditValue('')}
                  onAddColumn={db.addColumn}
                  onRemoveColumn={db.removeColumn}
                />
              )}

              {db.activeTab === 'sql' && (
                <TabSQL
                  sql={db.result.sql}
                  dbType={db.result.dbType || db.dbType}
                  copied={db.copied}
                  onCopy={db.copySQL}
                  onDownload={db.downloadSQL}
                  onSQLChange={db.updateSQL}
                />
              )}

              {db.activeTab === 'seed' && (
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

              {db.activeTab === 'normalize' && (
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
  )
}