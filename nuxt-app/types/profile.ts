export interface HistoryEntry {
  id: string
  fileName: string
  language: string
  wpm: number
  rawWpm: number
  cpm: number
  accuracy: number
  elapsedSeconds: number
  time: string
  chars: number
  errors: number
  date: string
}

export interface LanguageStat {
  id: string
  sessions: number
  avgWpm: number
  bestWpm: number
  avgAccuracy: number
  totalChars: number
}
