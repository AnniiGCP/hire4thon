import { useEffect, useState } from 'react'
import SharedSidebar from '../components/SharedSidebar'
import './DashboardPage.css'

const leaderboardTopThree = [
  { rank: 1, name: 'Aarav Sharma', points: 960, icon: 'A', crown: true },
  { rank: 2, name: 'Diya Patel', points: 910, icon: 'D' },
  { rank: 3, name: 'Rohan Verma', points: 875, icon: 'R' },
]

const leaderboardOthers = [
  { rank: 4, name: 'Ananya Iyer', points: 860 },
  { rank: 5, name: 'Kabir Singh', points: 845 },
]

const personalRank = {
  rank: 18,
  name: 'You (Sumant Mahesh Adky)',
}

function DashboardPage({ onNavigate = () => {}, userQuizPoints = 0, onAnalyze = async () => {} }) {
  const [topic, setTopic] = useState('')
  const [file, setFile] = useState(null)
  const [showProgress, setShowProgress] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisError, setAnalysisError] = useState('')

  const handleFileChange = (event) => {
    const selected = event.target.files && event.target.files[0] ? event.target.files[0] : null
    setFile(selected)
  }

  useEffect(() => {
    if (!showProgress) {
      return undefined
    }

    if (analysisProgress >= 92) {
      return undefined
    }

    const timer = setTimeout(() => {
      setAnalysisProgress((prev) => Math.min(92, prev + 4))
    }, 90)

    return () => clearTimeout(timer)
  }, [showProgress, analysisProgress])

  const handleAnalyzeClick = async () => {
    if (showProgress) {
      return
    }

    if (!topic.trim() && !file) {
      setAnalysisError('Enter a topic or upload a file before analyzing.')
      return
    }

    setAnalysisError('')
    setShowProgress(true)
    setAnalysisProgress(0)

    try {
      await onAnalyze({ topic, file })
      setAnalysisProgress(100)
    } catch (error) {
      setShowProgress(false)
      setAnalysisProgress(0)
      setAnalysisError(error?.message || 'Unable to analyze your content right now. Please try again.')
    }
  }

  return (
    <div className="dashboard-page">
      <SharedSidebar active="dashboard" onNavigate={onNavigate} />

      <main className="dashboard-main">
        <div className="dashboard-shell">
          <header className="dashboard-header">
            <h1>Learn</h1>
            <p>Create quizzes from any topic or document with AI</p>
          </header>

          <div className="dashboard-inputs-grid">
            <section className="dashboard-card">
              <h3 className="dashboard-section-title">
                <span className="dashboard-icon-circle">✏️</span>
                <span>1. Explain a Topic</span>
              </h3>
              <p className="dashboard-section-subtitle">
                Type or paste the topic you want a quiz on. Our AI will understand and generate relevant questions.
              </p>
              <textarea
                className="dashboard-textarea"
                placeholder="e.g., Photosynthesis in Plants, Newton's Laws of Motion, Python Functions..."
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              />
            </section>

            <section className="dashboard-card">
              <h3 className="dashboard-section-title">
                <span className="dashboard-icon-circle">📄</span>
                <span>2. Upload a Document</span>
                <span className="dashboard-section-title-inline">(RAG Powered)</span>
              </h3>
              <p className="dashboard-section-subtitle">
                Upload notes, PDFs, or study materials. Our AI will use Retrieval Augmented Generation to learn from your content.
              </p>

              <label className="dashboard-upload-box">
                <div className="dashboard-upload-icon">☁️</div>
                <p className="dashboard-upload-title">Click to Upload or Drag & Drop</p>
                <p className="dashboard-upload-meta">Supports: PDF, DOCX, TXT (Max 20MB)</p>
                <span className="dashboard-browse-btn">Browse Files</span>
                <input type="file" hidden onChange={handleFileChange} />
              </label>

              {file ? <p className="dashboard-upload-meta">Selected file: {file.name}</p> : null}
            </section>
          </div>

          <section className="dashboard-card dashboard-analyze-card">
            <h3 className="dashboard-difficulty-title">Ready to Analyze?</h3>

            {showProgress && (
              <>
                <div className="dashboard-progress-head">
                  <span className="dashboard-progress-label">Analyzing content</span>
                  <span className="dashboard-progress-value">{analysisProgress}%</span>
                </div>
                <div className="dashboard-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={analysisProgress}>
                  <div className="dashboard-progress-fill" style={{ width: `${analysisProgress}%` }} />
                </div>
              </>
            )}

            <button
              type="button"
              className="dashboard-generate-btn"
              onClick={handleAnalyzeClick}
              disabled={showProgress}
            >
              {showProgress ? `Analyzing with LLM... ${analysisProgress}%` : 'Analyze'}
            </button>
            <p className="dashboard-generate-subtitle">
              Analyze sends your topic/module to the LLM and prepares notes, insights, and quiz levels.
            </p>
            {analysisError ? <p className="dashboard-error-text">{analysisError}</p> : null}
          </section>

          <section className="dashboard-bottom-grid">
            <article className="dashboard-card">
              <h3 className="dashboard-step-title">✦ How It Works</h3>
              <ol className="dashboard-steps">
                <li className="dashboard-step-item"><span className="dashboard-step-number">1</span>Provide a topic or upload a document</li>
                <li className="dashboard-step-item"><span className="dashboard-step-number">2</span>AI (LLM + RAG) processes and understands</li>
                <li className="dashboard-step-item"><span className="dashboard-step-number">3</span>Quizzes are generated in 3 difficulty levels</li>
                <li className="dashboard-step-item"><span className="dashboard-step-number">4</span>Take the quiz and get instant results</li>
                <li className="dashboard-step-item"><span className="dashboard-step-number">5</span>Track your progress and improve!</li>
                <li className="dashboard-step-item"><span className="dashboard-step-number">6</span>Review explanations for wrong answers</li>
                <li className="dashboard-step-item"><span className="dashboard-step-number">7</span>Focus on weak topics using targeted practice</li>
                <li className="dashboard-step-item"><span className="dashboard-step-number">8</span>Retake quizzes to improve accuracy and rank</li>
              </ol>
            </article>

            <article className="dashboard-card">
              <h3 className="dashboard-leaderboard-title">🏆 Leaderboard</h3>
              <p className="dashboard-leaderboard-subtitle">Top 5 Performers This Week</p>

              <div className="dashboard-podium">
                {leaderboardTopThree.map((item) => (
                  <div key={item.rank} className={`dashboard-podium-item dashboard-podium-rank-${item.rank}`}>
                    {item.crown ? <div className="dashboard-podium-crown">👑</div> : null}
                    <div className="dashboard-podium-icon">{item.icon}</div>
                    <span className="dashboard-podium-rank-badge">#{item.rank}</span>
                    <p className="dashboard-podium-name">{item.name}</p>
                    <p className="dashboard-podium-points">{item.points} pts</p>
                  </div>
                ))}
              </div>

              <div className="dashboard-leaderboard-list">
                {leaderboardOthers.map((item) => (
                  <div key={item.rank} className="dashboard-leaderboard-row">
                    <span className="dashboard-rank">#{item.rank}</span>
                    <span className="dashboard-name">{item.name}</span>
                    <span className="dashboard-score">{item.points} pts</span>
                  </div>
                ))}
              </div>

              <div className="dashboard-personal-rank">
                <span className="dashboard-personal-rank-number">#{personalRank.rank}</span>
                <div>
                  <p className="dashboard-personal-rank-label">Your Rank</p>
                  <p className="dashboard-personal-rank-name">{personalRank.name}</p>
                </div>
                <span className="dashboard-personal-rank-points">{userQuizPoints} pts</span>
              </div>

              <div className="dashboard-link-wrap">
                <a href="#" className="dashboard-link">View Full Leaderboard →</a>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
