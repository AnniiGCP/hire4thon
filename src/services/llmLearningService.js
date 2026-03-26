const difficultyOrder = ['Beginner', 'Intermediate', 'Advanced']

function createFallbackAnalyzeData({ topic, fileName }) {
  const normalizedTopic = topic || 'General Science'

  return {
    topic: normalizedTopic,
    sourceFileName: fileName || '',
    notes: {
      title: `${normalizedTopic} - AI Notes`,
      overview: `${normalizedTopic} has been analyzed to create concise study notes and actionable insights for practice.`,
      keyPoints: [
        'Core concepts were extracted from the provided topic/module.',
        'Key terms and definitions were identified for rapid revision.',
        'Common mistakes and exam-focused areas were highlighted.',
      ],
      additionalNotes: [
        'Review key terms before attempting the quiz.',
        'Use incorrect answers as revision anchors.',
      ],
      insights: {
        strengths: ['Clear concept identification', 'Good topic coverage'],
        weaknesses: ['Needs more advanced-level practice'],
        recommendations: ['Attempt all 3 levels: Beginner, Intermediate, Advanced'],
      },
    },
    quiz: {
      beginner: [
        {
          id: 1,
          difficulty: 'Beginner',
          question: `What best describes ${normalizedTopic}?`,
          correctOption: 'A',
          options: [
            { id: 'A', label: 'A foundational concept set', hint: 'Start with basics' },
            { id: 'B', label: 'Only an advanced topic', hint: 'Too restrictive' },
            { id: 'C', label: 'Not relevant for exams', hint: 'Usually not true' },
            { id: 'D', label: 'A purely historical term', hint: 'Context-dependent' },
          ],
        },
      ],
      intermediate: [
        {
          id: 2,
          difficulty: 'Intermediate',
          question: `Which study strategy is most effective for ${normalizedTopic}?`,
          correctOption: 'B',
          options: [
            { id: 'A', label: 'Memorize without practice', hint: 'Low retention' },
            { id: 'B', label: 'Concept review plus mixed practice', hint: 'Balanced approach' },
            { id: 'C', label: 'Skip revision entirely', hint: 'High risk' },
            { id: 'D', label: 'Only read summaries', hint: 'Missing depth' },
          ],
        },
      ],
      advanced: [
        {
          id: 3,
          difficulty: 'Advanced',
          question: `How should you improve performance on advanced ${normalizedTopic} questions?`,
          correctOption: 'C',
          options: [
            { id: 'A', label: 'Avoid timed practice', hint: 'Timing matters' },
            { id: 'B', label: 'Ignore weak areas', hint: 'Limits improvement' },
            { id: 'C', label: 'Analyze mistakes and retry targeted sets', hint: 'Best improvement loop' },
            { id: 'D', label: 'Use only beginner quizzes', hint: 'Insufficient challenge' },
          ],
        },
      ],
      allQuestions: [],
    },
  }
}

function normalizeOption(option, index) {
  const id = String.fromCharCode(65 + index)

  if (typeof option === 'string') {
    return { id, label: option, hint: '' }
  }

  return {
    id: option?.id || id,
    label: option?.label || option?.text || `Option ${id}`,
    hint: option?.hint || '',
  }
}

function normalizeQuestion(question, index, difficulty) {
  const rawOptions = Array.isArray(question?.options) ? question.options : []
  const options = rawOptions.slice(0, 4).map((option, optionIndex) => normalizeOption(option, optionIndex))
  const safeOptions = options.length > 0 ? options : [
    { id: 'A', label: 'Option A', hint: '' },
    { id: 'B', label: 'Option B', hint: '' },
    { id: 'C', label: 'Option C', hint: '' },
    { id: 'D', label: 'Option D', hint: '' },
  ]

  const fallbackCorrect = safeOptions[0].id
  const incomingCorrect = question?.correctOption || question?.answer || question?.correct
  const normalizedCorrect = safeOptions.some((opt) => opt.id === incomingCorrect) ? incomingCorrect : fallbackCorrect

  return {
    id: question?.id || index + 1,
    difficulty,
    question: question?.question || question?.prompt || `Question ${index + 1}`,
    correctOption: normalizedCorrect,
    options: safeOptions,
  }
}

function normalizeDifficultyQuestions(questions, difficulty) {
  if (!Array.isArray(questions)) {
    return []
  }

  return questions.map((question, index) => normalizeQuestion(question, index, difficulty))
}

function buildQuestionPlan({ topic = '', fileSizeBytes = 0 }) {
  const topicWordCount = topic.trim() ? topic.trim().split(/\s+/).length : 0
  const fileWeight = Math.floor(fileSizeBytes / 9000)
  const signal = topicWordCount + fileWeight

  let totalQuestions = 6
  if (signal >= 80) {
    totalQuestions = 15
  } else if (signal >= 45) {
    totalQuestions = 12
  } else if (signal >= 20) {
    totalQuestions = 9
  }

  const beginner = Math.max(1, Math.round(totalQuestions * 0.33))
  const intermediate = Math.max(1, Math.round(totalQuestions * 0.34))
  const advanced = Math.max(1, totalQuestions - beginner - intermediate)

  return {
    totalQuestions,
    beginner,
    intermediate,
    advanced,
  }
}

function createDefaultQuestion(topic, difficulty, id, sequence = 1) {
  const normalizedTopic = topic || 'General Science'

  if (difficulty === 'Beginner') {
    return {
      id,
      difficulty,
      question: `Beginner ${sequence}: Which statement best introduces ${normalizedTopic}?`,
      correctOption: 'A',
      options: [
        { id: 'A', label: 'It starts from core foundational concepts', hint: 'Begin with basics' },
        { id: 'B', label: 'Only experts can understand it', hint: 'Not always true' },
        { id: 'C', label: 'It has no practical use', hint: 'Incorrect in most cases' },
        { id: 'D', label: 'It should be skipped in revision', hint: 'Not recommended' },
      ],
    }
  }

  if (difficulty === 'Advanced') {
    return {
      id,
      difficulty,
      question: `Advanced ${sequence}: What is the best way to improve advanced ${normalizedTopic} performance?`,
      correctOption: 'C',
      options: [
        { id: 'A', label: 'Avoid timed questions', hint: 'Timing is important' },
        { id: 'B', label: 'Ignore analysis of mistakes', hint: 'Weak strategy' },
        { id: 'C', label: 'Review mistakes and practice targeted advanced sets', hint: 'Best approach' },
        { id: 'D', label: 'Practice only beginner questions', hint: 'Insufficient challenge' },
      ],
    }
  }

  return {
    id,
    difficulty,
    question: `Intermediate ${sequence}: Which method is effective for learning ${normalizedTopic} at intermediate level?`,
    correctOption: 'B',
    options: [
      { id: 'A', label: 'Read once without revision', hint: 'Low retention' },
      { id: 'B', label: 'Mix concept review with practice questions', hint: 'Balanced learning' },
      { id: 'C', label: 'Skip difficult subtopics', hint: 'Leaves gaps' },
      { id: 'D', label: 'Memorize only definitions', hint: 'Lacks depth' },
    ],
  }
}

function fitDifficultyQuestions(questions, requiredCount, topic, difficulty) {
  const trimmed = questions.slice(0, requiredCount)

  if (trimmed.length >= requiredCount) {
    return trimmed.map((question, index) => ({ ...question, id: index + 1 }))
  }

  const filled = [...trimmed]
  while (filled.length < requiredCount) {
    const nextSequence = filled.length + 1
    filled.push(createDefaultQuestion(topic, difficulty, nextSequence, nextSequence))
  }

  return filled.map((question, index) => ({ ...question, id: index + 1 }))
}

function buildCompulsoryThreeLevelQuiz(quizByDifficulty, topic, questionPlan) {
  return {
    beginner: fitDifficultyQuestions(quizByDifficulty.beginner, questionPlan.beginner, topic, 'Beginner'),
    intermediate: fitDifficultyQuestions(quizByDifficulty.intermediate, questionPlan.intermediate, topic, 'Intermediate'),
    advanced: fitDifficultyQuestions(quizByDifficulty.advanced, questionPlan.advanced, topic, 'Advanced'),
  }
}

function flattenQuiz(quizByDifficulty) {
  let runningId = 1
  const mixed = []

  difficultyOrder.forEach((difficulty) => {
    const key = difficulty.toLowerCase()
    const group = Array.isArray(quizByDifficulty[key]) ? quizByDifficulty[key] : []

    group.forEach((question) => {
      mixed.push({ ...question, id: runningId })
      runningId += 1
    })
  })

  return mixed
}

function normalizeAnalyzeResponse(payload, context) {
  const fallback = createFallbackAnalyzeData(context)
  const resolvedTopic = payload?.topic || context.topic || fallback.topic
  const questionPlan = buildQuestionPlan({ topic: resolvedTopic, fileSizeBytes: context.fileSizeBytes || 0 })
  const notes = payload?.notes || {}
  const insights = notes?.insights || payload?.insights || {}

  const rawQuiz = {
    beginner: normalizeDifficultyQuestions(payload?.quiz?.beginner, 'Beginner'),
    intermediate: normalizeDifficultyQuestions(payload?.quiz?.intermediate, 'Intermediate'),
    advanced: normalizeDifficultyQuestions(payload?.quiz?.advanced, 'Advanced'),
  }

  const completedQuiz = buildCompulsoryThreeLevelQuiz(rawQuiz, resolvedTopic, questionPlan)

  const quiz = {
    beginner: completedQuiz.beginner,
    intermediate: completedQuiz.intermediate,
    advanced: completedQuiz.advanced,
    allQuestions: flattenQuiz(completedQuiz),
  }

  return {
    topic: resolvedTopic,
    sourceFileName: payload?.sourceFileName || context.fileName || fallback.sourceFileName,
    notes: {
      title: notes?.title || fallback.notes.title,
      overview: notes?.overview || fallback.notes.overview,
      keyPoints: Array.isArray(notes?.keyPoints) && notes.keyPoints.length > 0 ? notes.keyPoints : fallback.notes.keyPoints,
      additionalNotes: Array.isArray(notes?.additionalNotes) && notes.additionalNotes.length > 0 ? notes.additionalNotes : fallback.notes.additionalNotes,
      insights: {
        strengths: Array.isArray(insights?.strengths) ? insights.strengths : fallback.notes.insights.strengths,
        weaknesses: Array.isArray(insights?.weaknesses) ? insights.weaknesses : fallback.notes.insights.weaknesses,
        recommendations: Array.isArray(insights?.recommendations) ? insights.recommendations : fallback.notes.insights.recommendations,
      },
    },
    quiz,
  }
}

export async function analyzeStudyContent({ topic = '', file = null }) {
  const trimmedTopic = topic.trim()
  if (!trimmedTopic && !file) {
    throw new Error('Please enter a topic or upload a file before analyzing.')
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const endpoint = `${baseUrl}/api/llm/analyze`

  const formData = new FormData()
  const questionPlan = buildQuestionPlan({ topic: trimmedTopic, fileSizeBytes: file?.size || 0 })

  if (trimmedTopic) {
    formData.append('topic', trimmedTopic)
  }
  if (file) {
    formData.append('file', file)
  }
  formData.append('targetTotalQuestions', String(questionPlan.totalQuestions))
  formData.append('targetBeginnerQuestions', String(questionPlan.beginner))
  formData.append('targetIntermediateQuestions', String(questionPlan.intermediate))
  formData.append('targetAdvancedQuestions', String(questionPlan.advanced))

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Analyze request failed with status ${response.status}`)
    }

    const payload = await response.json()
    return normalizeAnalyzeResponse(payload, {
      topic: trimmedTopic,
      fileName: file?.name || '',
      fileSizeBytes: file?.size || 0,
    })
  } catch {
    return normalizeAnalyzeResponse({}, {
      topic: trimmedTopic,
      fileName: file?.name || '',
      fileSizeBytes: file?.size || 0,
    })
  }
}
