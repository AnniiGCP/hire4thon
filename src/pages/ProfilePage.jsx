import { useState } from 'react'
import SharedSidebar from '../components/SharedSidebar'
import styles from './ProfilePage.module.css'

const quizItems = [
  {
    id: 1,
    topic: 'Photosynthesis in Plants',
    date: 'Apr 22, 2025',
    score: '8 / 10',
    time: '3m 42s',
  },
  {
    id: 2,
    topic: 'Introduction to Cells',
    date: 'Apr 20, 2025',
    score: '7 / 10',
    time: '4m 16s',
  },
  {
    id: 3,
    topic: 'Early Civilizations',
    date: 'Apr 16, 2025',
    score: '9 / 10',
    time: '5m 18s',
  },
  {
    id: 4,
    topic: 'Human Digestive System',
    date: 'Apr 12, 2025',
    score: '8 / 10',
    time: '4m 04s',
  },
  {
    id: 5,
    topic: 'Electric Circuits Basics',
    date: 'Apr 10, 2025',
    score: '6 / 10',
    time: '4m 55s',
  },
]

const INITIAL_VISIBLE_QUIZZES = 3

const reviewedAnswersByTopic = {
  'Photosynthesis in Plants': [
    { id: 1, question: 'Which pigment absorbs sunlight?', yourAnswer: 'Chlorophyll', correctAnswer: 'Chlorophyll', status: 'Correct' },
    { id: 2, question: 'Which gas is absorbed?', yourAnswer: 'Carbon Dioxide', correctAnswer: 'Carbon Dioxide', status: 'Correct' },
    { id: 3, question: 'What is the immediate product of light reactions?', yourAnswer: 'ATP and NADPH', correctAnswer: 'ATP and NADPH', status: 'Correct' },
    { id: 4, question: 'Where does the Calvin cycle occur?', yourAnswer: 'Stroma', correctAnswer: 'Stroma', status: 'Correct' },
    { id: 5, question: 'Which byproduct is released during photosynthesis?', yourAnswer: 'Oxygen', correctAnswer: 'Oxygen', status: 'Correct' },
  ],
  'Introduction to Cells': [
    { id: 1, question: 'What surrounds the cell?', yourAnswer: 'Cell Membrane', correctAnswer: 'Cell Membrane', status: 'Correct' },
    { id: 2, question: 'Powerhouse of the cell?', yourAnswer: 'Mitochondria', correctAnswer: 'Mitochondria', status: 'Correct' },
    { id: 3, question: 'Which organelle stores DNA?', yourAnswer: 'Nucleus', correctAnswer: 'Nucleus', status: 'Correct' },
    { id: 4, question: 'Which structure synthesizes proteins?', yourAnswer: 'Ribosome', correctAnswer: 'Ribosome', status: 'Correct' },
    { id: 5, question: 'Plant cells have which extra protective layer?', yourAnswer: 'Cell wall', correctAnswer: 'Cell wall', status: 'Correct' },
  ],
  'Early Civilizations': [
    { id: 1, question: 'River of Egyptian civilization?', yourAnswer: 'Nile', correctAnswer: 'Nile', status: 'Correct' },
    { id: 2, question: 'Machu Picchu built by?', yourAnswer: 'Inca', correctAnswer: 'Inca', status: 'Correct' },
    { id: 3, question: 'Which script was used in Mesopotamia?', yourAnswer: 'Cuneiform', correctAnswer: 'Cuneiform', status: 'Correct' },
    { id: 4, question: 'The Harappan civilization is known for?', yourAnswer: 'Urban planning', correctAnswer: 'Urban planning', status: 'Correct' },
    { id: 5, question: 'Which civilization built pyramids?', yourAnswer: 'Egyptians', correctAnswer: 'Egyptians', status: 'Correct' },
  ],
  'Human Digestive System': [
    { id: 1, question: 'Most nutrient absorption happens in?', yourAnswer: 'Small intestine', correctAnswer: 'Small intestine', status: 'Correct' },
    { id: 2, question: 'Acid in stomach?', yourAnswer: 'Hydrochloric acid', correctAnswer: 'Hydrochloric acid', status: 'Correct' },
    { id: 3, question: 'Where does digestion begin?', yourAnswer: 'Mouth', correctAnswer: 'Mouth', status: 'Correct' },
    { id: 4, question: 'Which organ produces bile?', yourAnswer: 'Liver', correctAnswer: 'Liver', status: 'Correct' },
    { id: 5, question: 'Main function of large intestine?', yourAnswer: 'Water absorption', correctAnswer: 'Water absorption', status: 'Correct' },
  ],
  'Electric Circuits Basics': [
    { id: 1, question: 'Unit of current?', yourAnswer: 'Ampere', correctAnswer: 'Ampere', status: 'Correct' },
    { id: 2, question: 'Law V=IR is?', yourAnswer: 'Ohm\'s law', correctAnswer: 'Ohm\'s law', status: 'Correct' },
    { id: 3, question: 'SI unit of resistance?', yourAnswer: 'Ohm', correctAnswer: 'Ohm', status: 'Correct' },
    { id: 4, question: 'Current flow in series circuit is?', yourAnswer: 'Same at all points', correctAnswer: 'Same at all points', status: 'Correct' },
    { id: 5, question: 'Device used to measure current?', yourAnswer: 'Ammeter', correctAnswer: 'Ammeter', status: 'Correct' },
  ],
}

function ProfilePage({ onNavigate }) {
  const [profile, setProfile] = useState({
    name: 'Priya Sharma',
    email: 'Priya.sharma@emailapp.com',
    phone: '+91 98765 43210',
    location: 'Pune, India',
    classYear: 'B.Tech CSE - 3rd Year',
    bio: 'Focused on biology and logical reasoning. Preparing daily with adaptive quizzes.',
    photoUrl: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [draftProfile, setDraftProfile] = useState(profile)
  const [showAllQuizzes, setShowAllQuizzes] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [activeReviewTopic, setActiveReviewTopic] = useState('Photosynthesis in Plants')

  const hasMoreQuizzes = quizItems.length > INITIAL_VISIBLE_QUIZZES
  const visibleQuizzes = showAllQuizzes ? quizItems : quizItems.slice(0, INITIAL_VISIBLE_QUIZZES)

  const updateDraft = (key, value) => {
    setDraftProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handleEdit = () => {
    setDraftProfile(profile)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setDraftProfile(profile)
    setIsEditing(false)
  }

  const handleSave = () => {
    setProfile({
      name: draftProfile.name.trim() || profile.name,
      email: draftProfile.email.trim() || profile.email,
      phone: draftProfile.phone.trim() || profile.phone,
      location: draftProfile.location.trim() || profile.location,
      classYear: draftProfile.classYear.trim() || profile.classYear,
      bio: draftProfile.bio.trim() || profile.bio,
      photoUrl: draftProfile.photoUrl,
    })
    setIsEditing(false)
  }

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files && event.target.files[0] ? event.target.files[0] : null
    if (!selectedFile) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      updateDraft('photoUrl', String(reader.result || ''))
    }
    reader.readAsDataURL(selectedFile)
  }

  const handlePhotoRemove = () => {
    updateDraft('photoUrl', '')
  }

  const handleOpenReview = (topic) => {
    setActiveReviewTopic(topic)
    setShowReviewModal(true)
  }

  const reviewAnswers = reviewedAnswersByTopic[activeReviewTopic] || []

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <SharedSidebar active="profile" onNavigate={onNavigate} />

        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>Profile</h1>
            <p className={styles.subtitle}>Manage your account and view your stats</p>
          </header>

          <section className={`${styles.card} ${styles.userCard}`}>
            <div className={styles.userLeft}>
              {isEditing && draftProfile.photoUrl ? (
                <img src={draftProfile.photoUrl} alt={draftProfile.name} className={styles.avatarImage} />
              ) : profile.photoUrl ? (
                <img src={profile.photoUrl} alt={profile.name} className={styles.avatarImage} />
              ) : (
                <div className={styles.avatar}>{profile.name.charAt(0).toUpperCase()}</div>
              )}
              <div>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      className={styles.profileInput}
                      value={draftProfile.name}
                      onChange={(event) => updateDraft('name', event.target.value)}
                      placeholder="Full name"
                    />
                    <input
                      type="email"
                      className={styles.profileInput}
                      value={draftProfile.email}
                      onChange={(event) => updateDraft('email', event.target.value)}
                      placeholder="Email address"
                    />
                    <label className={styles.photoUpload}>
                      <span>Change Photo</span>
                      <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
                    </label>
                    <button
                      type="button"
                      className={styles.photoRemoveBtn}
                      onClick={handlePhotoRemove}
                      disabled={!draftProfile.photoUrl}
                    >
                      Remove Photo
                    </button>
                  </>
                ) : (
                  <>
                    <p className={styles.userName}>{profile.name}</p>
                    <p className={styles.userEmail}>{profile.email}</p>
                  </>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className={styles.editActions}>
                <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
                <button type="button" className={styles.editBtn} onClick={handleSave}>Save</button>
              </div>
            ) : (
              <button type="button" className={styles.editBtn} onClick={handleEdit}>
                <span>✎</span>
                <span>Edit Profile</span>
              </button>
            )}
          </section>

          <section className={`${styles.card} ${styles.sectionCard}`}>
            <h3 className={styles.sectionTitle}>Progress Overview</h3>
            <p className={styles.sectionSub}>Your overall quiz performance</p>

            <div className={styles.statsRow}>
              <article className={`${styles.statBox} ${styles.statBlue}`}>
                <p className={styles.statValue}>9</p>
                <p className={styles.statLabel}>Total Quizzes</p>
              </article>

              <article className={`${styles.statBox} ${styles.statGreen}`}>
                <p className={styles.statValue}>85%</p>
                <p className={styles.statLabel}>Accuracy Rate</p>
              </article>

              <article className={`${styles.statBox} ${styles.statOrange}`}>
                <p className={styles.statValue}>7 days</p>
                <p className={styles.statLabel}>Best Streak</p>
              </article>
            </div>
          </section>

          <section className={`${styles.card} ${styles.quizCard}`}>
            <h3 className={styles.sectionTitle}>Recent Quizzes</h3>

            <div className={styles.quizHead}>
              <span className={styles.quizHeadItem}>Topic</span>
              <span className={styles.quizHeadItem}>Marks</span>
              <span className={styles.quizHeadItem}>Time Taken</span>
              <span className={styles.quizHeadItem}>Review</span>
            </div>

            <div className={styles.quizList}>
              {visibleQuizzes.map((quiz) => (
                <article key={quiz.id} className={styles.quizRow}>
                  <div>
                    <p className={styles.quizTopic}>{quiz.topic}</p>
                    <p className={styles.quizDate}>{quiz.date}</p>
                  </div>
                  <p className={styles.quizScore}>{quiz.score}</p>
                  <p className={styles.quizTime}>{quiz.time}</p>
                  <button
                    type="button"
                    className={styles.quizReviewBtn}
                    onClick={() => handleOpenReview(quiz.topic)}
                  >
                    Review
                  </button>
                </article>
              ))}
            </div>

            {hasMoreQuizzes && (
              <div className={styles.viewAll}>
                <button
                  type="button"
                  className={styles.viewAllBtn}
                  onClick={() => setShowAllQuizzes((prev) => !prev)}
                >
                  {showAllQuizzes ? 'Show Less Topics' : 'View All Topics'}
                </button>
              </div>
            )}
          </section>

          {showReviewModal && (
            <div className={styles.reviewModalOverlay} role="dialog" aria-modal="true" aria-label="Review answers">
              <div className={styles.reviewModal}>
                <div className={styles.reviewModalHead}>
                  <h3>Review Answers</h3>
                  <button type="button" className={styles.reviewModalClose} onClick={() => setShowReviewModal(false)}>
                    ✕
                  </button>
                </div>

                <div className={styles.reviewModalBody}>
                  <p className={styles.reviewTopic}>Topic: {activeReviewTopic}</p>
                  {reviewAnswers.map((item) => (
                    <article key={item.id} className={styles.reviewCard}>
                      <p className={styles.reviewQuestion}>Q{item.id}. {item.question}</p>
                      <p className={styles.reviewLine}><strong>Your Answer:</strong> {item.yourAnswer}</p>
                      <p className={styles.reviewLine}><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                      <span className={`${styles.reviewStatus} ${item.status === 'Correct' ? styles.reviewStatusCorrect : styles.reviewStatusIncorrect}`}>
                        {item.status}
                      </span>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ProfilePage
