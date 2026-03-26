const DEFAULT_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const DEFAULT_MONTHS = [
  { label: 'Sep', col: 1 },
  { label: 'Oct', col: 6 },
  { label: 'Nov', col: 10 },
  { label: 'Dec', col: 14 },
  { label: 'Jan', col: 19 },
  { label: 'Feb', col: 23 },
  { label: 'Mar', col: 28 },
  { label: 'Apr', col: 32 },
  { label: 'May', col: 36 },
  { label: 'Jun', col: 41 },
  { label: 'Jul', col: 45 },
  { label: 'Aug', col: 49 },
]

function createMockLevels() {
  const levels = Array.from({ length: 364 }, (_, idx) => {
    const seed = (idx * 17 + 13) % 100
    if (seed < 58) return 0
    if (seed < 75) return 1
    if (seed < 89) return 2
    if (seed < 97) return 3
    return 4
  })

  for (let streak = 0; streak < 16; streak += 1) {
    levels[levels.length - 1 - streak] = (streak % 4) + 1
  }

  return levels
}

export const DEFAULT_SUBMISSION_STREAK = {
  dayLabels: DEFAULT_DAY_LABELS,
  months: DEFAULT_MONTHS,
  levels: createMockLevels(),
  streakWeeks: 16,
}

function normalizeStreakPayload(payload = {}) {
  const levels = Array.isArray(payload.levels)
    ? payload.levels.map((level) => {
        const num = Number(level)
        return Number.isNaN(num) ? 0 : Math.max(0, Math.min(4, num))
      })
    : DEFAULT_SUBMISSION_STREAK.levels

  return {
    dayLabels:
      Array.isArray(payload.dayLabels) && payload.dayLabels.length === 7
        ? payload.dayLabels
        : DEFAULT_SUBMISSION_STREAK.dayLabels,
    months:
      Array.isArray(payload.months) && payload.months.length > 0
        ? payload.months
        : DEFAULT_SUBMISSION_STREAK.months,
    levels,
    streakWeeks:
      typeof payload.streakWeeks === 'number' ? payload.streakWeeks : DEFAULT_SUBMISSION_STREAK.streakWeeks,
  }
}

export async function fetchSubmissionStreak() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const response = await fetch(`${baseUrl}/api/submission-streak`)

  if (!response.ok) {
    throw new Error(`Failed to fetch submission streak: ${response.status}`)
  }

  const payload = await response.json()
  return normalizeStreakPayload(payload)
}
