import type { HistoryEntry, LanguageStat } from '~/types'
import {
  CALENDAR_WEEKS,
  ERROR_HEATMAP_TOP_N,
  MS_PER_DAY,
  WPM_TREND_WINDOW,
} from '~/utils/constants'

export interface CalendarCell {
  date: string
  count: number
  isToday: boolean
}

export interface WpmTrendPoint {
  wpm: number
  accuracy: number
  percent: number
  date: string
  fileName: string
}

export interface ErrorHeatmapEntry {
  char: string
  count: number
}

export function computeAverageWpm(entries: HistoryEntry[]): number {
  if (entries.length === 0) return 0
  const sum = entries.reduce((acc, e) => acc + e.wpm, 0)
  return Math.round(sum / entries.length)
}

export function computeBestWpm(entries: HistoryEntry[]): number {
  if (entries.length === 0) return 0
  return Math.max(...entries.map((e) => e.wpm))
}

export function computeAverageAccuracy(entries: HistoryEntry[]): number {
  if (entries.length === 0) return 0
  const sum = entries.reduce((acc, e) => acc + e.accuracy, 0)
  return Math.round(sum / entries.length)
}

export function computeBestAccuracy(entries: HistoryEntry[]): number {
  if (entries.length === 0) return 0
  return Math.max(...entries.map((e) => e.accuracy))
}

export function computeTotalPracticeSeconds(entries: HistoryEntry[]): number {
  return entries.reduce((acc, e) => acc + e.elapsedSeconds, 0)
}

export function formatPracticeDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

export function computeTotalCharsTyped(entries: HistoryEntry[]): number {
  return entries.reduce((acc, e) => acc + e.chars, 0)
}

export function computeTotalErrors(entries: HistoryEntry[]): number {
  return entries.reduce((acc, e) => acc + e.errors, 0)
}

export function computeWpmTrend(entries: HistoryEntry[]): WpmTrendPoint[] {
  const recent = entries.slice(-WPM_TREND_WINDOW)
  if (recent.length === 0) return []
  const max = Math.max(...recent.map((e) => e.wpm), 1)
  return recent.map((e) => ({
    wpm: e.wpm,
    accuracy: e.accuracy,
    percent: Math.round((e.wpm / max) * 100),
    date: e.date,
    fileName: e.fileName,
  }))
}

export function computeLanguageStats(entries: HistoryEntry[]): LanguageStat[] {
  const map = new Map<string, { wpm: number[]; acc: number[]; best: number; chars: number }>()
  for (const e of entries) {
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
}

export function computeCalendarData(entries: HistoryEntry[]): CalendarCell[][] {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const dayMap = new Map<string, number>()
  for (const e of entries) {
    const d = e.date.slice(0, 10)
    dayMap.set(d, (dayMap.get(d) || 0) + 1)
  }

  const todayMs = today.getTime()
  const dayOfWeek = (today.getDay() + 6) % 7 // 0=Mon, 6=Sun
  const thisMonday = new Date(todayMs - dayOfWeek * MS_PER_DAY)
  thisMonday.setHours(0, 0, 0, 0)
  const startMs = thisMonday.getTime() - (CALENDAR_WEEKS - 1) * 7 * MS_PER_DAY

  const weeks: CalendarCell[][] = []
  const todayStr = today.toISOString().slice(0, 10)

  for (let w = 0; w < CALENDAR_WEEKS; w++) {
    const week: CalendarCell[] = []
    for (let d = 0; d < 7; d++) {
      const ms = startMs + (w * 7 + d) * MS_PER_DAY
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
}

export function computeErrorHeatmap(entries: HistoryEntry[]): ErrorHeatmapEntry[] {
  const map = new Map<string, number>()
  for (const e of entries) {
    if (!e.errorMap) continue
    for (const [ch, count] of Object.entries(e.errorMap)) {
      map.set(ch, (map.get(ch) || 0) + count)
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, ERROR_HEATMAP_TOP_N)
    .map(([char, count]) => ({ char, count }))
}

function uniqueDays(entries: HistoryEntry[]): string[] {
  const set = new Set<string>()
  for (const e of entries) set.add(e.date.slice(0, 10))
  return [...set].sort()
}

function dayDiff(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / MS_PER_DAY)
}

export function computeCurrentStreak(entries: HistoryEntry[]): number {
  if (entries.length === 0) return 0
  const days = uniqueDays(entries)
  if (days.length === 0) return 0
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - MS_PER_DAY).toISOString().slice(0, 10)
  if (days[days.length - 1] !== today && days[days.length - 1] !== yesterday) return 0
  let streak = 1
  for (let i = days.length - 2; i >= 0; i--) {
    if (dayDiff(days[i], days[i + 1]) === 1) streak++
    else break
  }
  return streak
}

export function computeLongestStreak(entries: HistoryEntry[]): number {
  const days = uniqueDays(entries)
  if (days.length === 0) return 0
  let max = 1
  let cur = 1
  for (let i = 1; i < days.length; i++) {
    if (dayDiff(days[i - 1], days[i]) === 1) cur++
    else cur = 1
    max = Math.max(max, cur)
  }
  return max
}
