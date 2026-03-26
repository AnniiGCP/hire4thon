import { useState } from 'react'
import SharedSidebar from '../components/SharedSidebar'
import './NotesPage.css'

const quizRows = [
  {
    id: 1,
    topic: 'Photosynthesis Quiz',
    dateTaken: 'April 20, 2024',
    score: '8 / 10',
    result: 'Passed',
  },
  {
    id: 2,
    topic: 'Cell Structure Quiz',
    dateTaken: 'April 15, 2024',
    score: '7 / 10',
    result: 'Passed',
  },
  {
    id: 3,
    topic: 'Ecology Basics Quiz',
    dateTaken: 'April 10, 2024',
    score: '6 / 10',
    result: 'Retake',
  },
  {
    id: 4,
    topic: 'Genetics Quiz',
    dateTaken: 'April 5, 2024',
    score: '9 / 10',
    result: 'Passed',
  },
]

function NotesPage({ onNavigate, onGenerateQuiz = () => {}, quizUnlocked = false }) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="notes-page">
      <SharedSidebar active="notes" onNavigate={onNavigate} />

      <main className="notes-main">
        <h1 className="notes-title">📋 Notes &amp; Quiz History</h1>

        <div className="notes-grid">
          <section className="notes-card">
            <h2 className="notes-card-header">📗 Study Notes ✏️</h2>
            <hr className="notes-divider" />

            <h3 className="notes-section-title">Photosynthesis Explained</h3>

            <hr className="notes-divider" />
            <p className="notes-label">Overview:</p>
            <p className="notes-paragraph">
              Photosynthesis is the process by which plants use sunlight to synthesize
              nutrients from carbon dioxide and water. This process is essential for producing
              oxygen and energy in the form of glucose.
            </p>

            <hr className="notes-divider" />
            <p className="notes-label">Key Stages of Photosynthesis:</p>
            <ul className="notes-list">
              <li>
                <span className="notes-inline-strong">1. Light Reactions:</span> Occur in thylakoid membranes where light energy
                is converted into chemical energy (ATP and NADPH).
              </li>
              <li>
                <span className="notes-inline-strong">2. Calvin Cycle:</span> Takes place in the stroma, where CO2 is fixed into glucose.
              </li>
            </ul>

            <hr className="notes-divider" />
            <p className="notes-label">Additional Notes:</p>
            <ul className="notes-list">
              <li>Chlorophyll in the chloroplasts absorbs sunlight.</li>
              <li>Oxygen is released as a byproduct.</li>
              <li>Photosynthesis is crucial for life on Earth.</li>
            </ul>

            <hr className="notes-divider" />
            <div className="notes-file-row">
              <span className="notes-file-label">Attached File:</span>
              <a href="#" className="notes-file-link">
                photosynthesis_diagram.jpg
              </a>
            </div>

            <div className="notes-attachment">
              <div className="notes-thumbnail">Thumbnail</div>
              <button type="button" className="notes-view-btn" onClick={() => setShowPreview(true)}>
                View
              </button>
            </div>
          </section>

          <section className="notes-card">
            <h2 className="notes-card-header">📋 Quiz History</h2>
            <hr className="notes-divider" />

            <div className="notes-table-wrap">
              <table className="notes-table">
                <thead>
                  <tr>
                    <th>Quiz Topic</th>
                    <th>Date Taken</th>
                    <th>Score</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {quizRows.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>{quiz.topic}</td>
                      <td>{quiz.dateTaken}</td>
                      <td className="notes-score">{quiz.score}</td>
                      <td>
                        <span
                          className={`notes-pill ${quiz.result === 'Passed' ? 'notes-pill-pass' : 'notes-pill-retake'}`}
                        >
                          {quiz.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="notes-history-cta-wrap">
              <button type="button" className="notes-history-cta">
                View All Quizzes
              </button>
            </div>
          </section>
        </div>

        <section className="notes-generate-wrap">
          <button
            type="button"
            className="notes-generate-btn"
            onClick={onGenerateQuiz}
          >
            Generate Quiz
          </button>
          <p className="notes-generate-note">
            {quizUnlocked
              ? 'Quiz generated. You can now open the Quiz page.'
              : 'Generate a quiz to unlock the Quiz page.'}
          </p>
        </section>

        {showPreview && (
          <div className="notes-modal-overlay" role="dialog" aria-modal="true" aria-label="Document preview">
            <div className="notes-modal">
              <div className="notes-modal-head">
                <h3>photosynthesis_diagram.jpg</h3>
                <button type="button" className="notes-modal-close" onClick={() => setShowPreview(false)}>
                  ✕
                </button>
              </div>
              <div className="notes-modal-body">
                <div className="notes-preview-image" aria-label="Preview placeholder">
                  Image Preview
                </div>
                <p>
                  Preview mode is active. You can replace this placeholder with an actual uploaded image source later.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default NotesPage
