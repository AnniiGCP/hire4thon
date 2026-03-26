import { useEffect, useState } from 'react'
import SharedSidebar from '../components/SharedSidebar'
import './QuizPage.css'

const questions = [
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

function QuizPage({ onNavigate = () => {}, onQuizComplete = () => {} }) {
  const totalTimeSeconds = 10 * 60
  const quizTopic = 'General Science'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalTimeSeconds)
  const [answersByQuestionId, setAnswersByQuestionId] = useState({})

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  useEffect(() => {
    if (!hasStarted) {
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
  }, [hasStarted])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1)
    const nextQuestion = questions[currentQuestion + 1]
    setSelectedOption(nextQuestion ? answersByQuestionId[nextQuestion.id] || null : null)
  }

  const handleSubmit = () => {
    const reviewAnswers = questions.map((item, idx) => {
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
    const totalQuestions = questions.length
    const accuracy = Math.round((correctCount / totalQuestions) * 100)
    const timeTakenSeconds = totalTimeSeconds - timeLeft

    const attempt = {
      id: Date.now(),
      topic: quizTopic,
      difficulty: 'Intermediate',
      score: `${correctCount} / ${totalQuestions}`,
      scoreNumber: correctCount,
      totalQuestions,
      accuracy,
      timeTakenSeconds,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      reviewAnswers,
    }

    onQuizComplete(attempt)
  }

  const handleStartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setAnswersByQuestionId({})
    setTimeLeft(totalTimeSeconds)
    setHasStarted(true)
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
                <p className="quiz-intro-value">Intermediate</p>
              </article>
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Questions</p>
                <p className="quiz-intro-value">{questions.length}</p>
              </article>
              <article className="quiz-intro-item">
                <p className="quiz-intro-label">Time Limit</p>
                <p className="quiz-intro-value">10 Minutes</p>
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
              <span className="quiz-chip-left">🔍 Question {currentQuestion + 1} of {questions.length}</span>
              <span className="quiz-chip-right">● {question.difficulty}</span>
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
            {!isLastQuestion ? (
              <button type="button" className="quiz-next-btn" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button type="button" className="quiz-next-btn" onClick={handleSubmit}>
                Submit
              </button>
            )}
          </div>

          <p className="quiz-footer">✈ Multiple Choice · Single Answer · Auto-Grading · New Options Generated</p>
        </section>
        )}
      </main>
    </div>
  )
}

export default QuizPage
