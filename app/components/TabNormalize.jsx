'use client'

import s from './TabNormalize.module.css'

export default function TabNormalize({
  normalizeResult,
  loading,
  isLimited,
  fixingIssue,
  onCheck,
  onFix,
}) {
  if (!normalizeResult) {
    return (
      <div className={s.empty}>
        <p className={s.emptyText}>AI перевірить схему на відповідність нормальним формам</p>
        <p className={s.emptySubText}>1НФ, 2НФ, 3НФ, BCNF — з поясненнями та автовиправленням</p>
        <button
          onClick={onCheck}
          disabled={loading || isLimited}
          className={`${s.checkBtn} ${loading || isLimited ? s.checkBtnDisabled : ''}`}
        >
          {loading ? '⏳ Аналіз...' : isLimited ? '⏳ Ліміт вичерпано' : '🔍 Перевірити нормалізацію'}
        </button>
      </div>
    )
  }

  const scoreClass =
    normalizeResult.score >= 80 ? s.scoreGreen
      : normalizeResult.score >= 60 ? s.scoreYellow
      : s.scoreRed

  return (
    <div className={s.wrapper}>
      <div className={s.scoreCard}>
        <div className={s.scoreBlock}>
          <div className={`${s.scoreNum} ${scoreClass}`}>{normalizeResult.score}</div>
          <div className={s.scoreMax}>/ 100</div>
        </div>
        <div className={s.scoreInfo}>
          <div className={s.scoreLevel}>
            Рівень: <span className={scoreClass}>{normalizeResult.overall}</span>
          </div>
          <div className={s.scoreSummary}>{normalizeResult.summary}</div>
        </div>
        <button
          onClick={onCheck}
          disabled={loading || isLimited}
          className={`${s.recheckBtn} ${loading || isLimited ? s.recheckBtnDisabled : ''}`}
        >
          🔄 Перевірити знову
        </button>
      </div>

      {normalizeResult.issues.length === 0 ? (
        <div className={s.noIssues}>
          ✅ Схема відповідає нормальним формам. Проблем не знайдено.
        </div>
      ) : (
        <div className={s.issues}>
          <div className={s.issuesTitle}>Знайдені проблеми ({normalizeResult.issues.length}):</div>
          {normalizeResult.issues.map((issue, i) => (
            <div key={i} className={s.issueCard}>
              <div className={s.issueTop}>
                <span className={s.issueForm}>{issue.form}</span>
                <span className={s.issueTable}>{issue.table}</span>
                <button
                  onClick={() => onFix(issue, i)}
                  disabled={fixingIssue !== null || isLimited}
                  className={`${s.fixBtn} ${fixingIssue !== null || isLimited ? s.fixBtnDisabled : ''}`}
                >
                  {fixingIssue === i ? '⏳ Виправляю...' : '🤖 Виправити з AI'}
                </button>
              </div>
              <div className={s.issueProblem}>⚠ {issue.problem}</div>
              <div className={s.issueSuggestion}>💡 {issue.suggestion}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
