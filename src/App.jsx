import { useState } from 'react'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import NotesPage from './pages/NotesPage'
import ResultsPage from './pages/ResultsPage'
import QuizPage from './pages/QuizPage'
import { analyzeStudyContent } from './services/llmLearningService'

function App() {
  const [activePage, setActivePage] = useState('login')
  const [quizUnlocked, setQuizUnlocked] = useState(false)
  const [quizAttempts, setQuizAttempts] = useState([])
  const [analysisData, setAnalysisData] = useState(null)
  const totalQuizPoints = quizAttempts.reduce((sum, attempt) => sum + (attempt.scoreNumber || 0), 0)

  const handleNavigate = (nextPage) => {
    if (nextPage === 'quiz' && !quizUnlocked) {
      setActivePage('notes')
      return
    }

    setActivePage(nextPage)
  }

  const handleLogin = () => {
    setQuizUnlocked(false)
    setQuizAttempts([])
    setAnalysisData(null)
    setActivePage('home')
  }

  const handleGenerateQuiz = () => {
    if (!analysisData) {
      return
    }

    setQuizUnlocked(true)
    setActivePage('quiz')
  }

  const handleAnalyzeRequest = async ({ topic, file }) => {
    const generated = await analyzeStudyContent({ topic, file })
    setAnalysisData(generated)
    setQuizUnlocked(true)
    setActivePage('notes')
    return generated
  }

  const handleQuizComplete = (attempt) => {
    setQuizAttempts((prev) => [attempt, ...prev])
    setActivePage('results')
  }

  if (activePage === 'login') {
    return <LoginPage onLogin={handleLogin} />
  }

  if (activePage === 'home') {
    return <HomePage onNavigate={handleNavigate} userQuizPoints={totalQuizPoints} />
  }

  if (activePage === 'dashboard') {
    return (
      <DashboardPage
        onNavigate={handleNavigate}
        userQuizPoints={totalQuizPoints}
        onAnalyze={handleAnalyzeRequest}
      />
    )
  }

  if (activePage === 'notes') {
    return (
      <NotesPage
        onNavigate={handleNavigate}
        onGenerateQuiz={handleGenerateQuiz}
        quizUnlocked={quizUnlocked}
        analysisData={analysisData}
      />
    )
  }

  if (activePage === 'quiz') {
    return (
      <QuizPage
        onNavigate={handleNavigate}
        onQuizComplete={handleQuizComplete}
        analysisData={analysisData}
      />
    )
  }

  if (activePage === 'results') {
    return (
      <ResultsPage
        onNavigate={handleNavigate}
        latestAttempt={quizAttempts[0] || null}
        attempts={quizAttempts}
        userQuizPoints={totalQuizPoints}
      />
    )
  }

  return <ProfilePage onNavigate={handleNavigate} />
}

export default App
