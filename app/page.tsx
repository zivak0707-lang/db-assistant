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

const TABS = [
  { id: 'er', label: '📊 ER-діаграма' },
  { id: 'tables', label: '📋 Таблиці' },
  { id: 'sql', label: '💾 SQL код' },
  { id: 'seed', label: '🌱 Тестові дані' },
  { id: 'normalize', label: '🔍 Нормалізація' },
] as const

export default function Home() {
  const db = useDBAssistant()
  const { rateLimit, history } = db

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div ref={db.topRef} />

      <Header
        onLogoClick={db.scrollToTop}
        rateStatus={rateLimit.isLimited ? 'limited' : 'ok'}
        countdown={rateLimit.countdown}
        historyCount={history.history.length}
        onHistoryClick={() => history.setShowHistory(!history.showHistory)}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {history.showHistory && (
          <HistoryPanel
            history={history.history}
            onLoad={item => {
              db.setDomain(item.domain)
              db.setDbType(item.dbType)
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
          <div className="bg-blue-950 border border-blue-800 rounded-xl px-5 py-4 mb-6">
            <div className="text-xs text-blue-400 font-medium mb-1">💡 Пояснення структури від AI</div>
            <p className="text-sm text-blue-100 leading-relaxed">{db.result.explanation}</p>
          </div>
        )}

        {db.result && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-gray-800 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => db.setActiveTab(tab.id)}
                  className={`px-4 py-3 text-xs font-medium transition-colors whitespace-nowrap ${
                    db.activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
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