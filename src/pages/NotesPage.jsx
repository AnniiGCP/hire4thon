import { useMemo, useState } from 'react'
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

const defaultGeneratedNotes = {
  title: 'Photosynthesis Explained',
  overview:
    'Photosynthesis is the process by which plants use sunlight to synthesize nutrients from carbon dioxide and water. This process is essential for producing oxygen and energy in the form of glucose.',
  keyPoints: [
    'Light Reactions: Occur in thylakoid membranes where light energy is converted into ATP and NADPH.',
    'Calvin Cycle: Takes place in the stroma, where CO2 is fixed into glucose.',
  ],
  additionalNotes: [
    'Chlorophyll in the chloroplasts absorbs sunlight.',
    'Oxygen is released as a byproduct.',
    'Photosynthesis is crucial for life on Earth.',
  ],
  insights: {
    strengths: ['Strong conceptual extraction from source content'],
    weaknesses: ['Requires repeated practice on advanced-level questions'],
    recommendations: ['Revise notes once, then attempt all difficulty levels'],
  },
}

function NotesPage({ onNavigate, onGenerateQuiz = () => {}, quizUnlocked = false, analysisData = null }) {
  const [showPreview, setShowPreview] = useState(false)
  const hasGeneratedOutput = Boolean(analysisData)

  const generatedNotes = useMemo(() => {
    if (!analysisData?.notes) {
      return defaultGeneratedNotes
    }

    return {
      title: analysisData.notes.title || defaultGeneratedNotes.title,
      overview: analysisData.notes.overview || defaultGeneratedNotes.overview,
      keyPoints: Array.isArray(analysisData.notes.keyPoints) && analysisData.notes.keyPoints.length > 0
        ? analysisData.notes.keyPoints
        : defaultGeneratedNotes.keyPoints,
      additionalNotes:
        Array.isArray(analysisData.notes.additionalNotes) && analysisData.notes.additionalNotes.length > 0
          ? analysisData.notes.additionalNotes
          : defaultGeneratedNotes.additionalNotes,
      insights: {
        strengths: Array.isArray(analysisData.notes.insights?.strengths)
          ? analysisData.notes.insights.strengths
          : defaultGeneratedNotes.insights.strengths,
        weaknesses: Array.isArray(analysisData.notes.insights?.weaknesses)
          ? analysisData.notes.insights.weaknesses
          : defaultGeneratedNotes.insights.weaknesses,
        recommendations: Array.isArray(analysisData.notes.insights?.recommendations)
          ? analysisData.notes.insights.recommendations
          : defaultGeneratedNotes.insights.recommendations,
      },
    }
  }, [analysisData])

  const generatedTopicTitle = analysisData?.topic || generatedNotes.title
  const attachedFileName = analysisData?.sourceFileName || 'No file uploaded'

  return (
    <div className="notes-page">
      <SharedSidebar active="notes" onNavigate={onNavigate} />

      <main className="notes-main">
        <h1 className="notes-title">📋 Notes &amp; Quiz History</h1>

        <div className="notes-grid">
          <section className="notes-card">
            <h2 className="notes-card-header">📗 Study Notes ✏️</h2>
            <hr className="notes-divider" />

            <h3 className="notes-section-title">{generatedTopicTitle}</h3>

            <hr className="notes-divider" />
            <p className="notes-label">Overview:</p>
            <p className="notes-paragraph">
              {generatedNotes.overview}
            </p>

            <hr className="notes-divider" />
            <p className="notes-label">Key Learning Points:</p>
            <ul className="notes-list">
              {generatedNotes.keyPoints.map((point, index) => (
                <li key={`${point}-${index}`}>
                  <span className="notes-inline-strong">{index + 1}.</span> {point}
                </li>
              ))}
            </ul>

            <hr className="notes-divider" />
            <p className="notes-label">Additional Notes:</p>
            <ul className="notes-list">
              {generatedNotes.additionalNotes.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>

            <hr className="notes-divider" />
            <p className="notes-label">AI Insights:</p>
            <div className="notes-insights-grid">
              <div className="notes-insight-card notes-insight-good">
                <p className="notes-insight-title">Strengths</p>
                <ul className="notes-insight-list">
                  {generatedNotes.insights.strengths.map((item, index) => (
                    <li key={`strength-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="notes-insight-card notes-insight-warn">
                <p className="notes-insight-title">Weaknesses</p>
                <ul className="notes-insight-list">
                  {generatedNotes.insights.weaknesses.map((item, index) => (
                    <li key={`weakness-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="notes-insight-card notes-insight-info">
                <p className="notes-insight-title">Recommendations</p>
                <ul className="notes-insight-list">
                  {generatedNotes.insights.recommendations.map((item, index) => (
                    <li key={`recommendation-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <hr className="notes-divider" />
            <div className="notes-file-row">
              <span className="notes-file-label">Analyzed Module:</span>
              <a href="#" className="notes-file-link">
                {attachedFileName}
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
            disabled={!hasGeneratedOutput}
          >
            Open Generated Quiz
          </button>
          <p className="notes-generate-note">
            {quizUnlocked && hasGeneratedOutput
              ? 'LLM generated notes, insights, and quiz levels. You can now start the quiz.'
              : 'Run Analyze from Study page to generate notes, insights, and the quiz.'}
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
