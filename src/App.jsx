import { useState } from 'react'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import NotesPage from './pages/NotesPage'
import ResultsPage from './pages/ResultsPage'
import QuizPage from './pages/QuizPage'

function App() {
  const [activePage, setActivePage] = useState('login')
  const [quizUnlocked, setQuizUnlocked] = useState(false)
  const [quizAttempts, setQuizAttempts] = useState([])

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
    setActivePage('home')
  }

  const handleGenerateQuiz = () => {
    setQuizUnlocked(true)
    setActivePage('quiz')
  }

  const handleQuizComplete = (attempt) => {
    setQuizAttempts((prev) => [attempt, ...prev])
    setActivePage('results')
  }

  if (activePage === 'login') {
    return <LoginPage onLogin={handleLogin} />
  }

  if (activePage === 'home') {
    return <HomePage onNavigate={handleNavigate} />
  }

  if (activePage === 'dashboard') {
    return <DashboardPage onNavigate={handleNavigate} />
  }

  if (activePage === 'notes') {
    return (
      <NotesPage
        onNavigate={handleNavigate}
        onGenerateQuiz={handleGenerateQuiz}
        quizUnlocked={quizUnlocked}
      />
    )
  }

  if (activePage === 'quiz') {
    return <QuizPage onNavigate={handleNavigate} onQuizComplete={handleQuizComplete} />
  }

  if (activePage === 'results') {
    return (
      <ResultsPage
        onNavigate={handleNavigate}
        latestAttempt={quizAttempts[0] || null}
        attempts={quizAttempts}
      />
    )
  }

  return <ProfilePage onNavigate={handleNavigate} />
}

export default App
