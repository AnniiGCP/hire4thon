import { useState } from 'react'
import SharedSidebar from '../components/SharedSidebar'
import './ResultsPage.css'

const baseLeaderboard = [
  { id: 1, name: 'Priya', points: 507, initial: 'P', avatarClass: 'rp-avatar-priya' },
  { id: 2, name: 'Rahul', points: 482, initial: 'R', avatarClass: 'rp-avatar-rahul' },
  { id: 3, name: 'Nat', points: 445, initial: 'N', avatarClass: 'rp-avatar-nat' },
  { id: 4, name: 'Ananya', points: 389, initial: 'A', avatarClass: 'rp-avatar-ananya' },
  { id: 5, name: 'Vikram', points: 373, initial: 'V', avatarClass: 'rp-avatar-vikram' },
]

function ResultsPage({ onNavigate = () => {}, latestAttempt = null, attempts = [] }) {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showAllRows, setShowAllRows] = useState(false)
  const activeTopic = latestAttempt ? latestAttempt.topic : 'No Quiz Attempt Yet'
  const reviewedAnswers = latestAttempt ? latestAttempt.reviewAnswers : []
  const totalQuizzes = attempts.length
  const accuracy = latestAttempt ? latestAttempt.accuracy : 0
  const bestStreak = Math.max(1, Math.min(7, totalQuizzes))
  const yourLeaderboardPoints = attempts.reduce((sum, attempt) => {
    const scoreBoost = Number.isFinite(attempt.scoreNumber) ? attempt.scoreNumber * 100 : 0
    return sum + scoreBoost + (attempt.accuracy || 0)
  }, 0)
  const leaderboard = [...baseLeaderboard, {
    id: 'you',
    name: 'You',
    points: yourLeaderboardPoints,
    initial: 'Y',
    avatarClass: 'rp-avatar-you',
  }]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
  const tableRows = attempts.map((attempt, index) => ({
    id: attempt.id || index + 1,
    date: attempt.date,
    topic: attempt.topic,
    score: attempt.score,
    difficulty: attempt.difficulty,
  }))
  const hasMoreThanThree = tableRows.length > 3
  const visibleRows = showAllRows ? tableRows : tableRows.slice(0, 3)

  const handleCloseModal = () => {
    setShowReviewModal(false)
  }

  return (
    <div className="rp-page">
      <SharedSidebar active="results" onNavigate={onNavigate} />

      <main className="rp-main">
        <div className="rp-container">
          <header className="rp-header">
            <h1>Results &amp; Progress</h1>
            <p>Track your learning journey and quiz performance</p>
          </header>

          <section className="rp-banner">
            <div>
              <p className="rp-banner-title">🏆 🎉 Congratulations!</p>
              <p className="rp-banner-text">
                You scored <strong>{latestAttempt ? latestAttempt.score : '0 / 0'}</strong> on the quiz <strong>'{activeTopic}'</strong>
              </p>
            </div>
            <button type="button" className="rp-great-btn">
              Great work!
            </button>
          </section>

          <section className="rp-grid">
            <article className="rp-card rp-progress-card">
              <h2>Progress Overview</h2>
              <div className="rp-metric rp-metric-green">✅ <strong>{accuracy}%</strong> accuracy in your latest quiz</div>
              <div className="rp-metric rp-metric-orange">🔥 <strong>{bestStreak} day{bestStreak > 1 ? 's' : ''}</strong> Best Streak</div>
              <div className="rp-metric rp-metric-gray">📅 <strong>{totalQuizzes}</strong> Total Quizzes</div>

              <button type="button" className="rp-review-btn" onClick={() => setShowReviewModal(true)}>
                Review Answers
              </button>
            </article>

            <article className="rp-card rp-leaderboard-card">
              <h2>🏆 Leaderboard</h2>
              <div className="rp-leaderboard-list">
                {leaderboard.map((entry) => (
                  <div key={entry.id} className="rp-leader-row">
                    <div className={`rp-avatar ${entry.avatarClass}`}>{entry.initial}</div>
                    <p className="rp-leader-name">{entry.name}</p>
                    <p className="rp-leader-points">{entry.points} pts</p>
                  </div>
                ))}
              </div>
              <a href="#" className="rp-link">
                View Full Leaderboard →
              </a>
            </article>
          </section>

          <section className="rp-card rp-table-card">
            <h2>Date Taken</h2>
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Date Taken</th>
                    <th>Topic</th>
                    <th>Score</th>
                    <th>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.length > 0 ? (
                    visibleRows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.date}</td>
                        <td className="rp-topic-cell">{row.topic}</td>
                        <td className="rp-score-cell">{row.score}</td>
                        <td>
                          <span className="rp-difficulty-pill">{row.difficulty}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No quiz attempts yet. Complete a quiz to see real results.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {hasMoreThanThree && (
              <button
                type="button"
                className="rp-link rp-link-center rp-link-button"
                onClick={() => setShowAllRows((prev) => !prev)}
              >
                {showAllRows ? 'Show Less Quizzes' : 'View All Quizzes →'}
              </button>
            )}
          </section>
        </div>

        {showReviewModal && (
          <div className="rp-modal-overlay" role="dialog" aria-modal="true" aria-label="Review answers">
            <div className="rp-modal">
              <div className="rp-modal-head">
                <h3>Answer Review</h3>
                <button type="button" className="rp-modal-close" onClick={handleCloseModal}>
                  ✕
                </button>
              </div>

              <div className="rp-modal-body">
                <p className="rp-review-topic">Topic: {activeTopic}</p>
                {reviewedAnswers.length > 0 ? (
                  reviewedAnswers.map((item) => (
                    <article key={item.id} className="rp-answer-card">
                      <p className="rp-answer-question">Q{item.id}. {item.question}</p>
                      <p className="rp-answer-line"><strong>Your Answer:</strong> {item.yourAnswer}</p>
                      <p className="rp-answer-line"><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                      <span className={`rp-answer-status ${item.status === 'Correct' ? 'rp-answer-status-correct' : 'rp-answer-status-incorrect'}`}>
                        {item.status}
                      </span>
                    </article>
                  ))
                ) : (
                  <p className="rp-answer-line">No answer review available yet. Take a quiz first.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ResultsPage
