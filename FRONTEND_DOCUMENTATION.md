# QuizGen AI Frontend Documentation

## 1. Purpose and Scope
This document explains the frontend implementation in this repository, including:
- App architecture and navigation model
- State ownership and data flow
- Detailed behavior of each active page
- Shared components and service layer
- Styling strategy and file organization
- Current limitations and extension guidance

This documentation reflects the current codebase under src and the Vite setup in the project root.

## 2. Tech Stack
- React 19 for UI and component state
- Vite 8 for development/build tooling
- Plain CSS and CSS Modules for page styling
- Tailwind dependency exists, but active page screens are primarily custom CSS-driven
- Native fetch for API integration in service and legacy result component

## 3. Project Entry and Runtime
### 3.1 Entry Point
- src/main.jsx mounts App into root with React StrictMode.

### 3.2 Top-Level Orchestration
- src/App.jsx is the application controller.
- Navigation is state-based, not route-based (no react-router).
- The active page is controlled by activePage state.

### 3.3 Main Scripts
- npm run dev: start development server
- npm run build: production build
- npm run preview: preview production build
- npm run lint: run ESLint

## 4. Frontend Architecture
The app uses a single-controller pattern:
1. App keeps shared cross-page state.
2. App renders one page component conditionally.
3. Pages receive callbacks/props to navigate or mutate shared state.
4. SharedSidebar is reused by active pages for left navigation.

### 4.1 Global State in App
In src/App.jsx:
- activePage: current rendered screen
- quizUnlocked: guards quiz access until Generate Quiz is clicked in Analyze
- quizAttempts: list of completed quiz attempts (latest at index 0)
- totalQuizPoints: computed sum of all attempt.scoreNumber values

### 4.2 Navigation Guard
In handleNavigate(nextPage):
- If nextPage is quiz and quizUnlocked is false, user is redirected to notes.
- Otherwise page switches normally.

### 4.3 Session Reset Behavior
On login (handleLogin):
- quizUnlocked resets to false
- quizAttempts resets to empty array
- activePage becomes home

## 5. Active Screen Documentation

## 5.1 Login Screen
File: src/pages/LoginPage.jsx
Style: src/pages/LoginPage.css

### Responsibilities
- Login, signup, and forgot-password UI states
- Minimal local validation for signup password match
- Triggers onLogin callback to enter app

### Local State
- mode: login | signup | forgot
- email, password, fullName, confirmPassword
- message for user feedback

### Behavior Notes
- Login button directly calls onLogin (no backend auth request yet).
- Signup validates password == confirmPassword and then switches to login mode.
- Forgot password shows a simulated reset message.

## 5.2 Home (Dashboard) Screen
File: src/pages/HomePage.jsx
Style: src/pages/HomePage.css

### Responsibilities
- Displays sponsored hero carousel
- Shows drives/progress cards
- Displays leaderboard preview and personal rank points
- Renders submission streak heatmap via API-ready service

### Props
- onNavigate(pageId)
- userQuizPoints (aggregated from App quizAttempts)

### Local State
- leaderboardFilter
- activeSlide (auto-rotates)
- submissionStreak (loaded from service)
- showAllDriveRows
- showAllLeaderboardRows

### Data Sources
- Static arrays for hero slides, rank rows, drive rows
- fetchSubmissionStreak for heatmap payload (with fallback handling)

### Important Behavior
- Carousel auto-advances every 3.6 seconds.
- Heatmap fetch uses async effect and cancellation guard.
- Personal rank display uses real points via userQuizPoints.

## 5.3 Study Screen
File: src/pages/DashboardPage.jsx
Style: src/pages/DashboardPage.css

### Responsibilities
- Collect topic text and optional file upload
- Simulate analysis progress and transition to Analyze page
- Show weekly leaderboard preview and personal points

### Props
- onNavigate(pageId)
- userQuizPoints

### Local State
- topic
- file
- showProgress
- analysisProgress

### Important Behavior
- Clicking Analyze starts progress animation from 0 to 100.
- On completion, page auto-navigates to notes after short delay.
- Personal rank points use userQuizPoints.

## 5.4 Analyze Screen
File: src/pages/NotesPage.jsx
Style: src/pages/NotesPage.css

### Responsibilities
- Show static study note content
- Show static quiz history table
- Offer document preview modal
- Unlock Quiz section via Generate Quiz action

### Props
- onNavigate(pageId)
- onGenerateQuiz()
- quizUnlocked

### Local State
- showPreview for image preview modal

### Important Behavior
- Generate Quiz calls parent callback; App sets quizUnlocked true and navigates to quiz.
- CTA note text changes based on quizUnlocked.

## 5.5 Quiz Screen
File: src/pages/QuizPage.jsx
Style: src/pages/QuizPage.css

### Responsibilities
- Show pre-start quiz overview
- Render one question at a time
- Track selected answers per question
- Manage countdown timer
- Build and submit real attempt payload

### Props
- onNavigate(pageId)
- onQuizComplete(attempt)

### Local State
- currentQuestion
- selectedOption
- hasStarted
- timeLeft
- answersByQuestionId (map of questionId -> selected option id)

### Key Constants
- totalTimeSeconds = 600 (10 minutes)
- pointsPerQuestion = 1
- questions = 5-question static bank (intermediate)

### Submission Payload
On submit, component computes:
- correctCount
- totalQuestions
- accuracy as percent
- timeTakenSeconds
- reviewAnswers array with per-question correctness detail

It sends attempt object:
- id
- topic
- difficulty
- score string (example 4 / 5)
- scoreNumber (numeric correct count)
- totalQuestions
- accuracy
- timeTakenSeconds
- date
- reviewAnswers

### Scoring Rule
- Each correct answer contributes exactly 1 point.
- Current UI now displays 1 pts per question and total points in quiz overview.

## 5.6 Results Screen
File: src/pages/ResultsPage.jsx
Style: src/pages/ResultsPage.css

### Responsibilities
- Show latest quiz summary
- Show progress metrics
- Show leaderboard with user entry
- Show attempt history table
- Show answer review modal for latest attempt

### Props
- onNavigate(pageId)
- latestAttempt
- attempts
- userQuizPoints

### Local State
- showReviewModal
- showAllRows

### Derived Metrics
- activeTopic from latestAttempt.topic
- reviewedAnswers from latestAttempt.reviewAnswers
- totalQuizzes from attempts.length
- accuracy from latestAttempt.accuracy
- bestStreak heuristic: max(1, min(7, totalQuizzes))

### Leaderboard Behavior
- Base leaderboard is static seed data.
- User entry uses userQuizPoints from global attempts.
- Ranking is recalculated after injecting user entry.
- If user is not in top five, list still shows user as final row.

### Table Behavior
- Maps every attempt into table row with date/topic/score/difficulty.
- Shows first three rows by default with View All toggle.

## 5.7 Profile Screen
File: src/pages/ProfilePage.jsx
Style: src/pages/ProfilePage.module.css

### Responsibilities
- Show profile card with edit flow
- Allow profile photo upload/remove during edit
- Show progress overview cards
- Show recent quizzes with View All toggle
- Show topic-based review modal

### Props
- onNavigate(pageId)

### Local State
- profile
- isEditing
- draftProfile
- showAllQuizzes
- showReviewModal
- activeReviewTopic

### Edit Flow
- Edit copies profile into draftProfile.
- Save trims fields and persists to profile state.
- Cancel reverts draftProfile to current profile.
- Photo upload uses FileReader Data URL.

### Review Flow
- Review button on each quiz row opens modal bound to that topic.
- Answers are sourced from local reviewedAnswersByTopic map.

## 6. Shared Navigation and Components

## 6.1 Shared Sidebar
File: src/components/SharedSidebar.jsx
Style: src/components/SharedSidebar.css

### Responsibilities
- Render persistent brand area and navigation actions
- Emit page id through onNavigate callback

### Current Navigation Items
- home (Dashboard)
- dashboard (Study)
- notes (Analyze)
- profile (Profile)

Note:
- Quiz is currently not listed in sidebar navItems, even though a quiz page exists.
- Logout button currently triggers onNavigate('profile'), acting as a placeholder.

## 6.2 Legacy Reusable UI Components
Files:
- src/components/ui/Badge.jsx
- src/components/ui/Card.jsx
- src/components/ui/ProgressRing.jsx
- src/components/ui/StatCard.jsx
- src/components/ui/Table.jsx

These components are reusable primitives from an earlier Tailwind-oriented implementation. They are still used by some legacy pages, but active App routing currently uses the plain CSS page set.

## 6.3 Legacy Sidebar Component
File: src/components/layout/Sidebar.jsx

This is an older Tailwind-style sidebar and is not wired into current App flow.

## 7. Service Layer

## 7.1 Submission Streak Service
File: src/services/submissionStreakService.js

### Exported API
- DEFAULT_SUBMISSION_STREAK
- fetchSubmissionStreak()

### Endpoint
- GET /api/submission-streak
- Base URL can be set by VITE_API_BASE_URL

### Resilience Features
- normalizeStreakPayload clamps levels to 0..4.
- Fallback default payload is used by caller if request fails.

## 8. Data Contracts

## 8.1 Attempt Object Contract (Quiz -> App -> Results)
Type shape:
- id: number
- topic: string
- difficulty: string
- score: string (example 3 / 5)
- scoreNumber: number
- totalQuestions: number
- accuracy: number
- timeTakenSeconds: number
- date: string
- reviewAnswers: Array<{ id, question, yourAnswer, correctAnswer, status }>

## 8.2 Submission Streak Payload Contract
Expected shape:
- dayLabels: string[7]
- months: Array<{ label: string, col: number }>
- levels: number[] (0..4)
- streakWeeks: number

## 9. Styling System

## 9.1 Global Styles
- src/index.css contains global resets and root defaults.
- src/App.css contains leftover Vite template/demo styles and is not central to current page styling.

## 9.2 Page-Level Styling
Each primary page has dedicated CSS:
- src/pages/LoginPage.css
- src/pages/HomePage.css
- src/pages/DashboardPage.css
- src/pages/NotesPage.css
- src/pages/QuizPage.css
- src/pages/ResultsPage.css
- src/pages/ProfilePage.module.css

This keeps visual concerns localized by page.

## 10. Active vs Legacy Page Files

### Active in App.jsx
- LoginPage
- HomePage
- DashboardPage
- NotesPage
- QuizPage
- ResultsPage
- ProfilePage

### Present but Not Routed by Current App
- src/pages/Profile.jsx
- src/pages/Notes.jsx
- src/pages/QuizResults.jsx

These files represent an earlier component strategy and can be archived or removed if no longer needed.

## 11. Current Functional Rules
- Quiz access is locked until Generate Quiz is clicked in Analyze.
- Quiz timer starts only when quiz is explicitly started.
- Each correct answer equals 1 point.
- User leaderboard points shown across pages come from sum of scoreNumber across attempts.
- Results page review modal is based on latestAttempt.reviewAnswers.

## 12. Known Limitations
- No persistent storage: state resets on refresh.
- No backend auth integration on login/signup/forgot flows.
- Leaderboard competitor rows are mostly static demo data; only user points are dynamic.
- Profile review data is local topic mock data, independent from attempts history.
- Sidebar logout is placeholder behavior and does not perform session sign-out.

## 13. Suggested Next Improvements
1. Introduce router-based navigation for URL-deep-link support.
2. Persist attempts and profile data (local storage or backend).
3. Replace static leaderboard rows with backend-driven ranking.
4. Unify Profile review source with real attempt history.
5. Add domain models (TypeScript or runtime validation) for stronger data contracts.
6. Remove unused legacy files after migration confirmation.

## 14. Quick File Map
- src/main.jsx: React bootstrap
- src/App.jsx: app controller and shared state
- src/components/SharedSidebar.jsx: main navigation shell
- src/pages/*.jsx: screen-level UI logic
- src/services/submissionStreakService.js: heatmap API and normalization
- src/index.css: global styles
- package.json: scripts and dependencies

---
Last updated: 2026-03-27
