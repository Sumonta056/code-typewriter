import { defineStore } from 'pinia'
import type { HistoryEntry, LanguageStat } from '~/types'

const STORAGE_KEY = 'codeTypeHistory'
const MAX_ENTRIES = 100

export const useHistoryStore = defineStore('history', () => {
  const entries = ref<HistoryEntry[]>([])

  const totalSessions = computed(() => entries.value.length)

  const averageWpm = computed(() => {
    if (entries.value.length === 0) return 0
    const sum = entries.value.reduce((acc, e) => acc + e.wpm, 0)
    return Math.round(sum / entries.value.length)
  })

  const bestWpm = computed(() => {
    if (entries.value.length === 0) return 0
    return Math.max(...entries.value.map((e) => e.wpm))
  })

  const averageAccuracy = computed(() => {
    if (entries.value.length === 0) return 0
    const sum = entries.value.reduce((acc, e) => acc + e.accuracy, 0)
    return Math.round(sum / entries.value.length)
  })

  const bestAccuracy = computed(() => {
    if (entries.value.length === 0) return 0
    return Math.max(...entries.value.map((e) => e.accuracy))
  })

  const totalPracticeSeconds = computed(() =>
    entries.value.reduce((acc, e) => acc + e.elapsedSeconds, 0),
  )

  const totalPracticeFormatted = computed(() => {
    const total = totalPracticeSeconds.value
    if (total < 60) return `${Math.round(total)}s`
    if (total < 3600) return `${Math.floor(total / 60)}m ${Math.floor(total % 60)}s`
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    return `${h}h ${m}m`
  })

  const totalCharsTyped = computed(() => entries.value.reduce((acc, e) => acc + e.chars, 0))

  const totalErrors = computed(() => entries.value.reduce((acc, e) => acc + e.errors, 0))

  const recentEntries = computed(() => [...entries.value].reverse().slice(0, 20))

  const wpmTrend = computed(() => {
    const recent = [...entries.value].slice(-20)
    if (recent.length === 0) return []
    const max = Math.max(...recent.map((e) => e.wpm), 1)
    return recent.map((e) => ({
      wpm: e.wpm,
      accuracy: e.accuracy,
      percent: Math.round((e.wpm / max) * 100),
      date: e.date,
      fileName: e.fileName,
    }))
  })

  const languageStats = computed((): LanguageStat[] => {
    const map = new Map<string, { wpm: number[]; acc: number[]; best: number; chars: number }>()
    for (const e of entries.value) {
      const lang = e.language || 'unknown'
      if (!map.has(lang)) map.set(lang, { wpm: [], acc: [], best: 0, chars: 0 })
      const s = map.get(lang)!
      s.wpm.push(e.wpm)
      s.acc.push(e.accuracy)
      s.best = Math.max(s.best, e.wpm)
      s.chars += e.chars
    }
    return Array.from(map.entries())
      .map(([id, s]) => ({
        id,
        sessions: s.wpm.length,
        avgWpm: Math.round(s.wpm.reduce((a, b) => a + b, 0) / s.wpm.length),
        bestWpm: s.best,
        avgAccuracy: Math.round(s.acc.reduce((a, b) => a + b, 0) / s.acc.length),
        totalChars: s.chars,
      }))
      .sort((a, b) => b.sessions - a.sessions)
  })

  // Calendar heatmap: last 52 weeks of daily session counts
  const calendarData = computed(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    // Build a map of date → count
    const dayMap = new Map<string, number>()
    for (const e of entries.value) {
      const d = e.date.slice(0, 10)
      dayMap.set(d, (dayMap.get(d) || 0) + 1)
    }

    // Generate 52 weeks (364 days) + partial current week
    // Start from Monday 53 weeks ago
    const msPerDay = 86400000
    const todayMs = today.getTime()
    // Find the Monday of the current week
    const dayOfWeek = (today.getDay() + 6) % 7 // 0=Mon, 6=Sun
    const thisMonday = new Date(todayMs - dayOfWeek * msPerDay)
    thisMonday.setHours(0, 0, 0, 0)
    const startMs = thisMonday.getTime() - 51 * 7 * msPerDay

    const weeks: { date: string; count: number; isToday: boolean }[][] = []
    const todayStr = today.toISOString().slice(0, 10)

    for (let w = 0; w < 52; w++) {
      const week: { date: string; count: number; isToday: boolean }[] = []
      for (let d = 0; d < 7; d++) {
        const ms = startMs + (w * 7 + d) * msPerDay
        const dateStr = new Date(ms).toISOString().slice(0, 10)
        week.push({
          date: dateStr,
          count: dayMap.get(dateStr) || 0,
          isToday: dateStr === todayStr,
        })
      }
      weeks.push(week)
    }

    return weeks
  })

  // Aggregate error heatmap across all sessions
  const errorHeatmap = computed(() => {
    const map = new Map<string, number>()
    for (const e of entries.value) {
      if (!e.errorMap) continue
      for (const [ch, count] of Object.entries(e.errorMap)) {
        map.set(ch, (map.get(ch) || 0) + count)
      }
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([char, count]) => ({ char, count }))
  })

  const currentStreak = computed(() => {
    if (entries.value.length === 0) return 0
    const days = getUniqueDays()
    if (days.length === 0) return 0
    const today = todayStr()
    const yesterday = dayStr(Date.now() - 86400000)
    if (days[days.length - 1] !== today && days[days.length - 1] !== yesterday) return 0
    let streak = 1
    for (let i = days.length - 2; i >= 0; i--) {
      const diff = dayDiff(days[i], days[i + 1])
      if (diff === 1) streak++
      else break
    }
    return streak
  })

  const longestStreak = computed(() => {
    const days = getUniqueDays()
    if (days.length === 0) return 0
    let max = 1
    let cur = 1
    for (let i = 1; i < days.length; i++) {
      if (dayDiff(days[i - 1], days[i]) === 1) cur++
      else cur = 1
      max = Math.max(max, cur)
    }
    return max
  })

  function getUniqueDays(): string[] {
    const set = new Set<string>()
    for (const e of entries.value) {
      set.add(e.date.slice(0, 10))
    }
    return [...set].sort()
  }

  function todayStr(): string {
    return new Date().toISOString().slice(0, 10)
  }
  function dayStr(ms: number): string {
    return new Date(ms).toISOString().slice(0, 10)
  }
  function dayDiff(a: string, b: string): number {
    return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
  }

  function addEntry(entry: Omit<HistoryEntry, 'id'>) {
    entries.value.push({ ...entry, id: crypto.randomUUID() })
    if (entries.value.length > MAX_ENTRIES) {
      entries.value = entries.value.slice(-MAX_ENTRIES)
    }
    saveToStorage()
  }

  function clearHistory() {
    entries.value = []
    saveToStorage()
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as HistoryEntry[]
        entries.value = parsed.slice(-MAX_ENTRIES)
      }
    } catch {
      /* ignore */
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
    } catch {
      /* ignore */
    }
  }

  return {
    entries,
    totalSessions,
    averageWpm,
    bestWpm,
    averageAccuracy,
    bestAccuracy,
    totalPracticeSeconds,
    totalPracticeFormatted,
    totalCharsTyped,
    totalErrors,
    recentEntries,
    wpmTrend,
    languageStats,
    calendarData,
    errorHeatmap,
    currentStreak,
    longestStreak,
    addEntry,
    clearHistory,
    loadFromStorage,
    saveToStorage,
  }
})
