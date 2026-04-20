import { defineStore } from 'pinia'
import type { HistoryEntry } from '~/types'
import { HISTORY_MAX_ENTRIES, RECENT_ENTRIES_WINDOW } from '~/utils/constants'
import {
  computeAverageAccuracy,
  computeAverageWpm,
  computeBestAccuracy,
  computeBestWpm,
  computeCalendarData,
  computeCurrentStreak,
  computeErrorHeatmap,
  computeLanguageStats,
  computeLongestStreak,
  computeTotalCharsTyped,
  computeTotalErrors,
  computeTotalPracticeSeconds,
  computeWpmTrend,
  formatPracticeDuration,
} from '~/utils/historyAnalytics'

const STORAGE_KEY = 'codeTypeHistory'

export const useHistoryStore = defineStore('history', () => {
  const entries = ref<HistoryEntry[]>([])

  const totalSessions = computed(() => entries.value.length)
  const averageWpm = computed(() => computeAverageWpm(entries.value))
  const bestWpm = computed(() => computeBestWpm(entries.value))
  const averageAccuracy = computed(() => computeAverageAccuracy(entries.value))
  const bestAccuracy = computed(() => computeBestAccuracy(entries.value))
  const totalPracticeSeconds = computed(() => computeTotalPracticeSeconds(entries.value))
  const totalPracticeFormatted = computed(() => formatPracticeDuration(totalPracticeSeconds.value))
  const totalCharsTyped = computed(() => computeTotalCharsTyped(entries.value))
  const totalErrors = computed(() => computeTotalErrors(entries.value))
  const recentEntries = computed(() => [...entries.value].reverse().slice(0, RECENT_ENTRIES_WINDOW))
  const wpmTrend = computed(() => computeWpmTrend(entries.value))
  const languageStats = computed(() => computeLanguageStats(entries.value))
  const calendarData = computed(() => computeCalendarData(entries.value))
  const errorHeatmap = computed(() => computeErrorHeatmap(entries.value))
  const currentStreak = computed(() => computeCurrentStreak(entries.value))
  const longestStreak = computed(() => computeLongestStreak(entries.value))

  function addEntry(entry: Omit<HistoryEntry, 'id'>) {
    entries.value.push({ ...entry, id: crypto.randomUUID() })
    if (entries.value.length > HISTORY_MAX_ENTRIES) {
      entries.value = entries.value.slice(-HISTORY_MAX_ENTRIES)
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
        entries.value = parsed.slice(-HISTORY_MAX_ENTRIES)
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
