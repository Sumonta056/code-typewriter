export type CharState = 'pending' | 'correct' | 'incorrect'

export type TokenType = string

export interface SessionResult {
  wpm: number
  rawWpm: number
  cpm: number
  accuracy: number
  time: string
  elapsedSeconds: number
  chars: number
  errors: number
  fileName: string
  fileUrl: string
  language: string
  date: string
}
