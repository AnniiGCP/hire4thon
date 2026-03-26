import { useEffect, useState } from 'react'
import SharedSidebar from '../components/SharedSidebar'
import { DEFAULT_SUBMISSION_STREAK, fetchSubmissionStreak } from '../services/submissionStreakService'
import './HomePage.css'

const heroSlides = [
  {
    id: 1,
    kicker: 'Sponsored',
    heading: 'Sumant Mahesh Adky',
    value: '3.5 LPA',
    brand: 'BARYONS',
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><defs><linearGradient id='g1' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%23f59e0b'/><stop offset='1' stop-color='%238b5cf6'/></linearGradient></defs><rect width='120' height='120' fill='url(%23g1)'/><circle cx='60' cy='46' r='22' fill='%23f5f5f5'/><rect x='24' y='73' width='72' height='34' rx='17' fill='%23f5f5f5'/></svg>",
    background: 'linear-gradient(120deg, #fffbeb 0%, #fef3c7 100%)',
  },
  {
    id: 2,
    kicker: 'Sponsored',
    heading: 'Data Science Bootcamp',
    value: 'Up to 45% Off',
    brand: 'EDUWAVE',
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><defs><linearGradient id='g2' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%2322c55e'/><stop offset='1' stop-color='%2314b8a6'/></linearGradient></defs><rect width='120' height='120' fill='url(%23g2)'/><circle cx='60' cy='46' r='22' fill='%23f5f5f5'/><rect x='24' y='73' width='72' height='34' rx='17' fill='%23f5f5f5'/></svg>",
    background: 'linear-gradient(120deg, #ecfdf5 0%, #d1fae5 100%)',
  },
  {
    id: 3,
    kicker: 'Sponsored',
    heading: 'Frontend Mentor Pro',
    value: 'Live Cohort Open',
    brand: 'PIXELHIVE',
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><defs><linearGradient id='g3' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%233b82f6'/><stop offset='1' stop-color='%230ea5e9'/></linearGradient></defs><rect width='120' height='120' fill='url(%23g3)'/><circle cx='60' cy='46' r='22' fill='%23f5f5f5'/><rect x='24' y='73' width='72' height='34' rx='17' fill='%23f5f5f5'/></svg>",
    background: 'linear-gradient(120deg, #eff6ff 0%, #dbeafe 100%)',
  },
  {
    id: 4,
    kicker: 'Sponsored',
    heading: 'Aptitude Master Sprint',
    value: '7-Day Free Trial',
    brand: 'QUANTIX',
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><defs><linearGradient id='g4' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%23fb7185'/><stop offset='1' stop-color='%23f97316'/></linearGradient></defs><rect width='120' height='120' fill='url(%23g4)'/><circle cx='60' cy='46' r='22' fill='%23f5f5f5'/><rect x='24' y='73' width='72' height='34' rx='17' fill='%23f5f5f5'/></svg>",
    background: 'linear-gradient(120deg, #fff1f2 0%, #ffe4e6 100%)',
  },
]

const rankRows = [
  { rank: 4, avatar: '👩', name: 'Priya Sharma', score: 3575 },
  { rank: 5, avatar: '🧑', name: 'Aman Cheema', score: 2840 },
  { rank: 6, avatar: '👨', name: 'Ritik Verma', score: 2630 },
  { rank: 7, avatar: '👧', name: 'Nisha Gupta', score: 2410 },
]

const personalRank = {
  rank: 18,
  name: 'Sumant Mahesh Adky',
  score: 1760,
}

const driveDataRows = [
  {
    name: 'Programming - KST',
    percent: 50,
    progress: 85,
  },
  {
    name: 'JAX_VARIABLES',
    sub: 'Top Academy',
    percent: 7,
    progress: 7,
  },
  {
    name: 'Data Structures',
    sub: 'Weekly Target',
    percent: 64,
    progress: 64,
  },
  {
    name: 'System Design',
    sub: 'Practice Plan',
    percent: 32,
    progress: 32,
  },
]

const driveDefaultVisibleCount = 3
const leaderboardDefaultVisibleCount = 3

function HomePage({ onNavigate = () => {} }) {
  const [leaderboardFilter, setLeaderboardFilter] = useState('Total')
  const [activeSlide, setActiveSlide] = useState(0)
  const [submissionStreak, setSubmissionStreak] = useState(DEFAULT_SUBMISSION_STREAK)
  const [showAllDriveRows, setShowAllDriveRows] = useState(false)
  const [showAllLeaderboardRows, setShowAllLeaderboardRows] = useState(false)

  const visibleDriveRows = showAllDriveRows
    ? driveDataRows
    : driveDataRows.slice(0, driveDefaultVisibleCount)

  const visibleLeaderboardRows = showAllLeaderboardRows
    ? rankRows
    : rankRows.slice(0, leaderboardDefaultVisibleCount)

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3600)

    return () => clearInterval(slideTimer)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadSubmissionStreak = async () => {
      try {
        const payload = await fetchSubmissionStreak()
        if (!cancelled) {
          setSubmissionStreak(payload)
        }
      } catch {
        if (!cancelled) {
          setSubmissionStreak(DEFAULT_SUBMISSION_STREAK)
        }
      }
    }

    loadSubmissionStreak()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home-page">
      <SharedSidebar active="home" onNavigate={onNavigate} />

      <main className="home-main">
        <div className="home-shell">
          <section className="home-hero home-hero-carousel">
            <div
              className="home-hero-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {heroSlides.map((slide) => (
                <article key={slide.id} className="home-hero-slide" style={{ background: slide.background }}>
                  <div>
                    <p className="home-ad-kicker">{slide.kicker}</p>
                    <h2>{slide.heading}</h2>
                    <h1>{slide.value}</h1>
                  </div>

                  <div className="home-hero-right">
                    <img className="home-avatar" alt={slide.heading} src={slide.image} />
                    <div className="home-avatar-label">{slide.brand}</div>
                  </div>
                </article>
              ))}
            </div>

            <div className="home-hero-dots">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`home-hero-dot ${idx === activeSlide ? 'home-hero-dot-active' : ''}`}
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Show slide ${idx + 1}`}
                />
              ))}
            </div>
          </section>

          <section className="home-grid">
            <div>
              <article className="home-card">
                <h3 className="home-card-title">Drives Data</h3>

                {visibleDriveRows.map((row, index) => (
                  <div
                    key={`${row.name}-${index}`}
                    className={`home-drive-section ${index > 0 ? 'home-drive-section-separated' : ''}`}
                  >
                    <div className="home-drive-row">
                      <span className="home-ring" style={{ '--value': `${row.percent}%` }} />
                      <div>
                        <p className="home-drive-name">{row.name}</p>
                        {row.sub ? <p className="home-drive-sub">{row.sub}</p> : null}
                      </div>
                      <p className="home-drive-percent">{row.percent}%</p>
                    </div>
                    <div className="home-progress-wrap">
                      <div className="home-progress-meta">{row.progress}%</div>
                      <div className="home-progress-track"><div className="home-progress-fill" style={{ width: `${row.progress}%` }} /></div>
                    </div>
                    <div className="home-drive-action-wrap">
                      <button
                        type="button"
                        className="home-drive-action-btn"
                        title="Resume practice"
                        aria-label={`Resume ${row.name}`}
                      >
                        <svg viewBox="0 0 24 24" className="home-drive-action-icon" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {driveDataRows.length > driveDefaultVisibleCount ? (
                  <div className="home-drive-show-more-wrap">
                    <button
                      type="button"
                      className="home-drive-show-more"
                      onClick={() => setShowAllDriveRows((prev) => !prev)}
                    >
                      {showAllDriveRows ? 'Show less' : 'Show more'}
                    </button>
                  </div>
                ) : null}
              </article>
            </div>

            <div>
              <article className="home-card">
                <div className="home-lead-header">
                  <h3>Leaderboard</h3>
                  <select
                    className="home-filter"
                    value={leaderboardFilter}
                    onChange={(event) => setLeaderboardFilter(event.target.value)}
                  >
                    <option value="Total">Total</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <p className="home-lead-sub">Overall Top 5 Performers</p>

                <div className="home-podium">
                  <div className="home-podium-item home-podium-second">
                    <div className="home-podium-circle">D</div>
                    <span className="home-podium-rank">2</span>
                    <p className="home-podium-name">Dhruv Kumar</p>
                    <p className="home-podium-score">1750</p>
                  </div>

                  <div className="home-podium-item home-podium-first">
                    <div className="home-crown">👑</div>
                    <div className="home-podium-circle">N</div>
                    <span className="home-podium-rank">1</span>
                    <p className="home-podium-name">Natasha Sethi</p>
                    <p className="home-podium-score">7600</p>
                  </div>

                  <div className="home-podium-item home-podium-third">
                    <div className="home-podium-circle">S</div>
                    <span className="home-podium-rank">3</span>
                    <p className="home-podium-name">Stephen Williams</p>
                    <p className="home-podium-score">6540</p>
                  </div>
                </div>

                <div className="home-rank-list">
                  {visibleLeaderboardRows.map((row) => (
                    <div key={row.rank} className={`home-rank-row ${row.highlight ? 'home-rank-highlight' : ''}`}>
                      <span className="home-rank-number">{row.rank}</span>
                      <span className="home-rank-avatar">{row.avatar}</span>
                      <span className="home-rank-name">{row.name}</span>
                      <span className="home-rank-score">{row.score}</span>
                    </div>
                  ))}
                </div>

                <div className="home-personal-rank">
                  <span className="home-personal-rank-number">#{personalRank.rank}</span>
                  <div>
                    <p className="home-personal-rank-label">Your Rank</p>
                    <p className="home-personal-rank-name">{personalRank.name}</p>
                  </div>
                  <span className="home-personal-rank-score">{personalRank.score} pts</span>
                </div>

                <div className="home-show-more">
                  {rankRows.length > leaderboardDefaultVisibleCount ? (
                    <button
                      type="button"
                      className="home-link-btn"
                      onClick={() => setShowAllLeaderboardRows((prev) => !prev)}
                    >
                      {showAllLeaderboardRows ? 'Show less' : 'Show more →'}
                    </button>
                  ) : null}
                </div>
              </article>
            </div>
          </section>

          <article className="home-card home-submission-full">
            <div className="home-streak-head">
              <h3 className="home-streak-title">Submission Streak</h3>
              <span className="home-share">↗</span>
            </div>

            <div className="home-contrib">
              <div className="home-day-labels" aria-hidden="true">
                {submissionStreak.dayLabels.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="home-contrib-main">
                <div className="home-months">
                  {submissionStreak.months.map((month) => (
                    <span key={month.label} style={{ gridColumn: `${month.col} / span 4` }}>
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="home-heatmap" role="img" aria-label="Submission activity heatmap">
                  {submissionStreak.levels.map((level, idx) => (
                    <span key={idx} className={`home-square home-level-${level}`} title={`Level ${level}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="home-legend">
              <span className="home-legend-label">No Practice</span>
              <span className="home-legend-squares" aria-label="Heatmap levels">
                <span className="home-legend-level"><span className="home-square home-level-0" />L0</span>
                <span className="home-legend-level"><span className="home-square home-level-1" />L1</span>
                <span className="home-legend-level"><span className="home-square home-level-2" />L2</span>
                <span className="home-legend-level"><span className="home-square home-level-3" />L3</span>
                <span className="home-legend-level"><span className="home-square home-level-4" />L4</span>
              </span>
              <span className="home-legend-label">{submissionStreak.streakWeeks} Weeks Of Skill Streak</span>
            </div>
          </article>

          <article className="home-card home-current-streak home-current-streak-full">
            <h3>⭐ Current Streak</h3>
            <p>Consistency is key: Start your streak by practicing for at least 10 minutes each day</p>
            <div className="home-day-badges">
              <span className="home-day-badge">⚡ Day 1</span>
              <span className="home-day-badge">⚡ Day 2</span>
            </div>
            <span className="home-streak-pill">2<br />Days</span>
          </article>
        </div>
      </main>
    </div>
  )
}

export default HomePage
