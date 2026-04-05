export type CharState = 'pending' | 'correct' | 'incorrect'

export type TokenType =
  | 'plain'
  | 'keyword'
  | 'control'
  | 'string'
  | 'number'
  | 'comment'
  | 'func-call'
  | 'type'
  | 'builtin'
  | 'operator'
  | 'bracket'
  | 'brace'
  | 'punctuation'
  | 'property'
  | 'boolean'
  | 'null'
  | 'import'
  | 'decorator'
  | 'tag-bracket'
  | 'tag-name'
  | 'tag-attr'
  | 'tag-attr-special'

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
