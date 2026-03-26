import { useEffect, useMemo, useState } from 'react'
import SharedSidebar from '../components/SharedSidebar'
import './QuizPage.css'

const fallbackQuestions = [
  {
    id: 1,
    difficulty: 'Intermediate',
    question: "Which planet is known as the 'Red Planet'?",
    correctOption: 'B',
    options: [
      { id: 'A', label: 'Mercury', hint: 'Closest to the Sun' },
      { id: 'B', label: 'Mars', hint: 'Has a reddish appearance' },
      { id: 'C', label: 'Jupiter', hint: 'Largest planet in the solar system' },
      { id: 'D', label: 'Venus', hint: 'Similar size to Earth' },
    ],
  },
  {
    id: 2,
    difficulty: 'Intermediate',
    question: 'What is the largest organ in the human body?',
    correctOption: 'C',
    options: [
      { id: 'A', label: 'Heart', hint: 'Pumps blood through the body' },
      { id: 'B', label: 'Liver', hint: 'Helps detoxify blood' },
      { id: 'C', label: 'Skin', hint: 'Protective external covering' },
      { id: 'D', label: 'Lungs', hint: 'Responsible for gas exchange' },
    ],
  },
  {
    id: 3,
    difficulty: 'Intermediate',
    question: 'Which gas do plants absorb from the atmosphere?',
    correctOption: 'B',
    options: [
      { id: 'A', label: 'Oxygen', hint: 'Released during photosynthesis' },
      { id: 'B', label: 'Carbon Dioxide', hint: 'Used to make glucose' },
      { id: 'C', label: 'Nitrogen', hint: 'Major component of air' },
      { id: 'D', label: 'Hydrogen', hint: 'Very light gas element' },
    ],
  },
  {
    id: 4,
    difficulty: 'Intermediate',
    question: 'Which part of the cell contains genetic material?',
    correctOption: 'A',
    options: [
      { id: 'A', label: 'Nucleus', hint: 'Stores DNA in eukaryotic cells' },
      { id: 'B', label: 'Membrane', hint: 'Controls entry and exit' },
      { id: 'C', label: 'Ribosome', hint: 'Builds proteins' },
      { id: 'D', label: 'Mitochondria', hint: 'Produces ATP energy' },
    ],
  },
  {
    id: 5,
    difficulty: 'Intermediate',
    question: 'Which ocean is the largest on Earth?',
    correctOption: 'D',
    options: [
      { id: 'A', label: 'Atlantic Ocean', hint: 'Separates Europe and the Americas' },
      { id: 'B', label: 'Indian Ocean', hint: 'Borders southern Asia' },
      { id: 'C', label: 'Arctic Ocean', hint: 'Smallest and coldest ocean' },
      { id: 'D', label: 'Pacific Ocean', hint: 'Covers more than 30% of Earth' },
    ],
  },
]

const difficultyOrder = ['Beginner', 'Intermediate', 'Advanced']

const sectionLeaderboardBase = {
  Beginner: [
    { id: 1, name: 'Priya', points: 5 },
    { id: 2, name: 'Rahul', points: 4 },
    { id: 3, name: 'Nat', points: 4 },
    { id: 4, name: 'Ananya', points: 3 },
    { id: 5, name: 'Vikram', points: 3 },
  ],
  Intermediate: [
    { id: 1, name: 'Priya', points: 6 },
    { id: 2, name: 'Rahul', points: 5 },
    { id: 3, name: 'Nat', points: 5 },
    { id: 4, name: 'Ananya', points: 4 },
    { id: 5, name: 'Vikram', points: 4 },
  ],
  Advanced: [
    { id: 1, name: 'Priya', points: 7 },
    { id: 2, name: 'Rahul', points: 6 },
    { id: 3, name: 'Nat', points: 6 },
    { id: 4, name: 'Ananya', points: 5 },
    { id: 5, name: 'Vikram', points: 5 },
  ],
}

function normalizeDifficulty(rawDifficulty) {
  const level = String(rawDifficulty || 'Intermediate').toLowerCase()
  if (level === 'beginner') return 'Beginner'
  if (level === 'advanced') return 'Advanced'
  return 'Intermediate'
}

function buildSectionLeaderboard(sectionName, userPoints) {
  const baseRows = sectionLeaderboardBase[sectionName] || sectionLeaderboardBase.Intermediate
  const you = { id: 'you', name: 'You', points: userPoints }
  const ranked = [...baseRows, you].sort((a, b) => b.points - a.points)
  const yourRank = ranked.findIndex((row) => row.id === 'you') + 1

  let visible = ranked.slice(0, 5)
  if (!visible.some((row) => row.id === 'you')) {
    visible = [...visible.slice(0, 4), you]
  }

  return { rows: visible, yourRank }
}

function QuizPage({ onNavigate = () => {}, onQuizComplete = () => {}, analysisData = null }) {
  const totalTimeSeconds = 10 * 60
  const pointsPerQuestion = 1
  const sourceQuestions = analysisData?.quiz?.allQuestions?.length
    ? analysisData.quiz.allQuestions
    : fallbackQuestions
  const quizTopic = analysisData?.topic || 'General Science'
  const normalizedQuestions = useMemo(
    () => sourceQuestions.map((item) => ({ ...item, difficulty: normalizeDifficulty(item.difficulty) })),
    [sourceQuestions],
  )

  const questionsByDifficulty = useMemo(
    () =>
      normalizedQuestions.reduce(
        (acc, item) => {
          acc[item.difficulty].push(item)
          return acc
        },
        { Beginner: [], Intermediate: [], Advanced: [] },
      ),
    [normalizedQuestions],
  )

  const availableSections = useMemo(
    () => difficultyOrder.filter((level) => questionsByDifficulty[level].length > 0),
    [questionsByDifficulty],
  )

  const difficultyCounts = {
    beginner: questionsByDifficulty.Beginner.length,
    intermediate: questionsByDifficulty.Intermediate.length,
    advanced: questionsByDifficulty.Advanced.length,
  }

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalTimeSeconds)
  const [answersByQuestionId, setAnswersByQuestionId] = useState({})
  const [showSectionLeaderboard, setShowSectionLeaderboard] = useState(false)
  const [completedSection, setCompletedSection] = useState('')

  const currentSectionName = availableSections[currentSectionIndex] || 'Intermediate'
  const currentSectionQuestions = questionsByDifficulty[currentSectionName] || []
  const question = currentSectionQuestions[currentQuestionIndex]
  const isLastQuestionInSection = currentQuestionIndex === currentSectionQuestions.length - 1
  const isLastSection = currentSectionIndex === availableSections.length - 1

  const questionsBeforeCurrentSection = availableSections
    .slice(0, currentSectionIndex)
    .reduce((sum, level) => sum + questionsByDifficulty[level].length, 0)
  const overallQuestionNumber = questionsBeforeCurrentSection + currentQuestionIndex + 1

  const getSectionScore = (sectionName) => {
    const sectionQuestions = questionsByDifficulty[sectionName] || []
    return sectionQuestions.reduce(
      (sum, item) => sum + (answersByQuestionId[item.id] === item.correctOption ? pointsPerQuestion : 0),
      0,
    )
  }

  const sectionLeaderboard = buildSectionLeaderboard(completedSection || currentSectionName, getSectionScore(completedSection || currentSectionName))

  useEffect(() => {
    if (!hasStarted || showSectionLeaderboard) {
      return undefined
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted, showSectionLeaderboard])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const handleNext = () => {
    if (!isLastQuestionInSection) {
      const nextQuestion = currentSectionQuestions[currentQuestionIndex + 1]
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedOption(nextQuestion ? answersByQuestionId[nextQuestion.id] || null : null)
      return
    }

    if (!isLastSection) {
      setCompletedSection(currentSectionName)
      setShowSectionLeaderboard(true)
      return
    }

    handleSubmit()
  }

  const handleSubmit = () => {
    const reviewAnswers = normalizedQuestions.map((item, idx) => {
      const selected = answersByQuestionId[item.id] || null
      const selectedOptionDetails = item.options.find((opt) => opt.id === selected)
      const correctOptionDetails = item.options.find((opt) => opt.id === item.correctOption)
      const isCorrect = selected === item.correctOption

      return {
        id: idx + 1,
        question: item.question,
        yourAnswer: selectedOptionDetails ? selectedOptionDetails.label : 'Not Answered',
        correctAnswer: correctOptionDetails ? correctOptionDetails.label : '-',
        status: isCorrect ? 'Correct' : 'Incorrect',
      }
    })

    const correctCount = reviewAnswers.filter((entry) => entry.status === 'Correct').length
    const totalQuestions = normalizedQuestions.length
    const accuracy = Math.round((correctCount / totalQuestions) * 100)
    const timeTakenSeconds = totalTimeSeconds - timeLeft
    const sectionScores = availableSections.reduce((acc, level) => {
      acc[level] = getSectionScore(level)
      return acc
    }, {})

    const attempt = {
      id: Date.now(),
      topic: quizTopic,
      difficulty: 'Mixed',
      score: `${correctCount} / ${totalQuestions}`,
      scoreNumber: correctCount,
      totalQuestions,
      accuracy,
      timeTakenSeconds,
      sectionScores,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      reviewAnswers,
    }

    onQuizComplete(attempt)
  }

  const handleStartQuiz = () => {
    setCurrentSectionIndex(0)
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setAnswersByQuestionId({})
    setTimeLeft(totalTimeSeconds)
    setShowSectionLeaderboard(false)
    setCompletedSection('')
    setHasStarted(true)
  }

  const handleStartNextSection = () => {
    const nextSectionIndex = currentSectionIndex + 1
    const nextSectionName = availableSections[nextSectionIndex]
    const firstQuestionInNextSection = nextSectionName ? questionsByDifficulty[nextSectionName][0] : null

    setCurrentSectionIndex(nextSectionIndex)
    setCurrentQuestionIndex(0)
    setSelectedOption(firstQuestionInNextSection ? answersByQuestionId[firstQuestionInNextSection.id] || null : null)
    setShowSectionLeaderboard(false)
    setCompletedSection('')
  }

  return (
    <div className="quiz-page">
      <SharedSidebar active="quiz" onNavigate={onNavigate} />

      <main className="quiz-main">
        {!hasStarted ? (
          <section className="quiz-shell quiz-intro-shell">
            <h2 className="quiz-title">Quiz Overview</h2>
            <p className="quiz-subtitle">Review the details below before you begin.</p>

            <div className="quiz-intro-grid">
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Topic</p>
                <p className="quiz-intro-value">{quizTopic}</p>
              </article>
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Difficulty</p>
                <p className="quiz-intro-value">Beginner + Intermediate + Advanced</p>
              </article>
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Questions</p>
                <p className="quiz-intro-value">{sourceQuestions.length}</p>
              </article>
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Points / Question</p>
                <p className="quiz-intro-value">{pointsPerQuestion} pts</p>
              </article>
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Time Limit</p>
                <p className="quiz-intro-value">10 Minutes</p>
              </article>
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Total Points</p>
                <p className="quiz-intro-value">{sourceQuestions.length * pointsPerQuestion} pts</p>
              </article>
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Difficulty Mix</p>
                <p className="quiz-intro-value">
                  B:{difficultyCounts.beginner} · I:{difficultyCounts.intermediate} · A:{difficultyCounts.advanced}
                </p>
              </article>
            </div>

            <ul className="quiz-intro-list">
              <li>
                <span className="quiz-intro-list-icon" aria-hidden="true">🧠</span>
                <span>Read each question carefully and pick one option.</span>
              </li>
              <li>
                <span className="quiz-intro-list-icon" aria-hidden="true">⏱️</span>
                <span>Once started, the timer begins immediately.</span>
              </li>
              <li>
                <span className="quiz-intro-list-icon" aria-hidden="true">✅</span>
                <span>Submit at the end to view your results.</span>
              </li>
            </ul>

            <div className="quiz-actions quiz-actions-start">
              <button type="button" className="quiz-next-btn" onClick={handleStartQuiz}>
                Start Quiz
              </button>
            </div>
          </section>
        ) : (
        showSectionLeaderboard ? (
          <section className="quiz-shell quiz-section-shell">
            <div className="quiz-top">
              <div>
                <h2 className="quiz-title">{completedSection} Section Complete</h2>
                <p className="quiz-subtitle">Top 5 and your current rank for {completedSection}</p>
              </div>
              <div className="quiz-timer">🕐 {timerText}</div>
            </div>

            <article className="quiz-section-board">
              <p className="quiz-section-points">Your {completedSection} Points: {getSectionScore(completedSection)} pts</p>

              <div className="quiz-section-leaderboard-list">
                {sectionLeaderboard.rows.map((entry) => (
                  <div key={entry.id} className="quiz-section-row">
                    <span className="quiz-section-rank">#{entry.id === 'you' ? sectionLeaderboard.yourRank : entry.id}</span>
                    <span className="quiz-section-name">{entry.name}</span>
                    <span className="quiz-section-score">{entry.points} pts</span>
                  </div>
                ))}
              </div>

              <p className="quiz-section-rank-note">Your Rank: #{sectionLeaderboard.yourRank}</p>
            </article>

            <div className="quiz-actions">
              <button type="button" className="quiz-next-btn" onClick={handleStartNextSection}>
                Next Section →
              </button>
            </div>
          </section>
        ) : (
        <section className="quiz-shell">
          <div className="quiz-top">
            <div>
              <h2 className="quiz-title">Quiz</h2>
              <p className="quiz-subtitle">Answer the following question</p>
            </div>
            <div className="quiz-timer">🕐 {timerText}</div>
          </div>

          <article className="quiz-question-card">
            <div className="quiz-question-top">
              <div className="quiz-chip-group">
                <span className="quiz-chip-left">🔍 Question {overallQuestionNumber} of {normalizedQuestions.length}</span>
                <span className="quiz-chip-points">{pointsPerQuestion} pts</span>
              </div>
              <span className="quiz-chip-right">● {currentSectionName}</span>
            </div>
            <p className="quiz-question-text">{question.question}</p>
          </article>

          <div className="quiz-options">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`quiz-option ${isSelected ? 'quiz-option-selected' : ''}`}
                  onClick={() => {
                    setSelectedOption(option.id)
                    setAnswersByQuestionId((prev) => ({ ...prev, [question.id]: option.id }))
                  }}
                >
                  <span className="quiz-radio">{isSelected ? '✓' : ''}</span>
                  <span>
                    <p className="quiz-option-title">{option.id}) {option.label}</p>
                    <p className="quiz-option-hint">{option.hint}</p>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="quiz-actions">
            {!isLastQuestionInSection || !isLastSection ? (
              <button type="button" className="quiz-next-btn" onClick={handleNext}>
                {isLastQuestionInSection ? `Finish ${currentSectionName} →` : 'Next →'}
              </button>
            ) : (
              <button type="button" className="quiz-next-btn" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>

          <p className="quiz-footer">✈ Multiple Choice · Single Answer · Auto-Grading · New Options Generated</p>
        </section>
        )
        )}
      </main>
    </div>
  )
}

export default QuizPage
