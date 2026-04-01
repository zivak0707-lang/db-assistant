import React from 'react'
import styles from './TabNormalize.module.css'

export default function TabNormalize({ normalizeResult, loading, isLimited, fixingIssue, onCheck, onFix }) {
  if (!normalizeResult) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>AI перевірить схему на відповідність нормальним формам</p>
        <p className={styles.emptySubText}>1НФ, 2НФ, 3НФ, BCNF — з поясненнями та автовиправленням</p>
        <button
          onClick={onCheck}
          disabled={loading || isLimited}
          className={`${styles.checkBtn} ${loading || isLimited ? styles.checkBtnDisabled : ''}`}
        >
          {loading ? '⏳ Аналіз...' : isLimited ? '⏳ Ліміт вичерпано' : '🔍 Перевірити нормалізацію'}
        </button>
      </div>
    )
  }

  const scoreClass =
    normalizeResult.score >= 80 ? styles.scoreGreen
      : normalizeResult.score >= 60 ? styles.scoreYellow
      : styles.scoreRed

  return (
    <div className={styles.wrapper}>
      <div className={styles.scoreCard}>
        <div className={styles.scoreBlock}>
          <div className={`${styles.scoreNum} ${scoreClass}`}>{normalizeResult.score}</div>
          <div className={styles.scoreMax}>/ 100</div>
        </div>
        <div className={styles.scoreInfo}>
          <div className={styles.scoreLevel}>
            Рівень: <span className={scoreClass}>{normalizeResult.overall}</span>
          </div>
          <div className={styles.scoreSummary}>{normalizeResult.summary}</div>
        </div>
        <button
          onClick={onCheck}
          disabled={loading || isLimited}
          className={`${styles.recheckBtn} ${loading || isLimited ? styles.recheckBtnDisabled : ''}`}
        >
          🔄 Перевірити знову
        </button>
      </div>

      {normalizeResult.issues.length === 0 ? (
        <div className={styles.noIssues}>
          ✅ Схема відповідає нормальним формам. Проблем не знайдено.
        </div>
      ) : (
        <div className={styles.issues}>
          <div className={styles.issuesTitle}>Знайдені проблеми ({normalizeResult.issues.length}):</div>
          {normalizeResult.issues.map((issue, i) => (
            <div key={i} className={styles.issueCard}>
              <div className={styles.issueTop}>
                <span className={styles.issueForm}>{issue.form}</span>
                <span className={styles.issueTable}>{issue.table}</span>
                <button
                  onClick={() => onFix(issue, i)}
                  disabled={fixingIssue !== null || isLimited}
                  className={`${styles.fixBtn} ${fixingIssue !== null || isLimited ? styles.fixBtnDisabled : ''}`}
                >
                  {fixingIssue === i ? '⏳ Виправляю...' : '🤖 Виправити з AI'}
                </button>
              </div>
              <div className={styles.issueProblem}>⚠ {issue.problem}</div>
              <div className={styles.issueSuggestion}>💡 {issue.suggestion}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
