import type { TokenType } from '~/types'
import {
  BOOLEAN_LITERALS,
  BRACE_CHARS,
  BRACKET_CHARS,
  BUILTINS,
  CONTROL,
  IMPORT_KEYWORDS,
  KEYWORDS,
  NULLISH_LITERALS,
  OPERATOR_CHARS,
  PUNCTUATION_CHARS,
} from './keywords'

const TAG_PREVIEW_WINDOW = 40

type Scanner = {
  code: string
  len: number
  tokens: TokenType[]
  i: number
}

function isWordChar(c: string | undefined): boolean {
  return /[\w$]/.test(c || '')
}

function peek(s: Scanner, offset: number): string {
  return s.code[s.i + offset] || ''
}

function mark(s: Scanner, from: number, to: number, type: TokenType) {
  for (let j = from; j < to && j < s.len; j++) s.tokens[j] = type
}

function scanLineComment(s: Scanner) {
  const start = s.i
  while (s.i < s.len && s.code[s.i] !== '\n') s.i++
  mark(s, start, s.i, 'comment')
}

function scanBlockComment(s: Scanner) {
  const start = s.i
  s.i += 2
  while (s.i < s.len && !(s.code[s.i] === '*' && peek(s, 1) === '/')) s.i++
  s.i += 2
  mark(s, start, s.i, 'comment')
}

function scanString(s: Scanner) {
  const quote = s.code[s.i]
  const start = s.i
  s.i++
  while (s.i < s.len) {
    if (s.code[s.i] === '\\') {
      s.i += 2
      continue
    }
    if (s.code[s.i] === quote) {
      s.i++
      break
    }
    if (quote !== '`' && s.code[s.i] === '\n') break
    s.i++
  }
  mark(s, start, s.i, 'string')
}

function scanNumber(s: Scanner) {
  const start = s.i
  const ch = s.code[s.i]
  if (ch === '0' && (peek(s, 1) === 'x' || peek(s, 1) === 'X')) {
    s.i += 2
    while (s.i < s.len && /[\da-fA-F_]/.test(s.code[s.i])) s.i++
  } else if (ch === '0' && (peek(s, 1) === 'b' || peek(s, 1) === 'B')) {
    s.i += 2
    while (s.i < s.len && /[01_]/.test(s.code[s.i])) s.i++
  } else {
    while (s.i < s.len && /[\d._eE]/.test(s.code[s.i])) s.i++
    if (s.code[s.i] === 'n') s.i++
  }
  mark(s, start, s.i, 'number')
}

function scanTag(s: Scanner): boolean {
  const start = s.i
  const rest = s.code.slice(s.i, s.i + TAG_PREVIEW_WINDOW)
  if (!/^<\/?[a-zA-Z!]/.test(rest)) return false

  s.i++
  if (s.code[s.i] === '/') s.i++
  const nameStart = s.i
  while (s.i < s.len && /[\w\-.]/.test(s.code[s.i])) s.i++
  mark(s, start, nameStart, 'tag-bracket')
  mark(s, nameStart, s.i, 'tag-name')

  while (s.i < s.len && s.code[s.i] !== '>') {
    const ch = s.code[s.i]
    if (ch === '=' || ch === ' ' || ch === '\n' || ch === '\t') {
      s.i++
    } else if (ch === '"' || ch === "'") {
      const qs = s.i
      const q = ch
      s.i++
      while (s.i < s.len && s.code[s.i] !== q) s.i++
      s.i++
      mark(s, qs, s.i, 'string')
    } else if (ch === ':' || ch === '@' || (ch === 'v' && peek(s, 1) === '-')) {
      const ds = s.i
      while (s.i < s.len && /[\w\-:@.]/.test(s.code[s.i])) s.i++
      mark(s, ds, s.i, 'tag-attr-special')
    } else if (/[\w\-]/.test(ch)) {
      const as = s.i
      while (s.i < s.len && /[\w\-]/.test(s.code[s.i])) s.i++
      mark(s, as, s.i, 'tag-attr')
    } else if (ch === '/') {
      s.tokens[s.i] = 'tag-bracket'
      s.i++
    } else {
      s.i++
    }
  }
  if (s.i < s.len && s.code[s.i] === '>') {
    s.tokens[s.i] = 'tag-bracket'
    s.i++
  }
  return true
}

function scanDecorator(s: Scanner) {
  const start = s.i
  s.i++
  while (s.i < s.len && isWordChar(s.code[s.i])) s.i++
  mark(s, start, s.i, 'decorator')
}

function classifyIdentifier(s: Scanner, start: number, end: number): TokenType | null {
  const word = s.code.slice(start, end)
  if (CONTROL.has(word)) return 'control'
  if (BOOLEAN_LITERALS.has(word)) return 'boolean'
  if (NULLISH_LITERALS.has(word)) return 'null'
  if (IMPORT_KEYWORDS.has(word)) return 'import'
  if (KEYWORDS.has(word)) return 'keyword'
  if (BUILTINS.has(word)) return 'builtin'
  if (/^[A-Z]/.test(word) && word.length > 1) return 'type'
  if (end < s.len && s.code[end] === '(') return 'func-call'

  let prev = start - 1
  while (prev >= 0 && s.code[prev] === ' ') prev--
  if (prev >= 0 && s.code[prev] === '.') return 'property'

  return null
}

function scanIdentifier(s: Scanner) {
  const start = s.i
  while (s.i < s.len && isWordChar(s.code[s.i])) s.i++
  const type = classifyIdentifier(s, start, s.i)
  if (type) mark(s, start, s.i, type)
}

export function tokenize(code: string): TokenType[] {
  const s: Scanner = {
    code,
    len: code.length,
    tokens: new Array(code.length).fill('plain'),
    i: 0,
  }

  while (s.i < s.len) {
    const ch = s.code[s.i]

    if (ch === '/' && peek(s, 1) === '/') {
      scanLineComment(s)
      continue
    }
    if (ch === '/' && peek(s, 1) === '*') {
      scanBlockComment(s)
      continue
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      scanString(s)
      continue
    }
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(peek(s, 1)))) {
      scanNumber(s)
      continue
    }
    if (ch === '<' && (peek(s, 1) === '/' || /[a-zA-Z!]/.test(peek(s, 1)))) {
      if (scanTag(s)) continue
    }
    if (ch === '@' && /[a-zA-Z]/.test(peek(s, 1))) {
      scanDecorator(s)
      continue
    }
    if (/[a-zA-Z_$]/.test(ch)) {
      scanIdentifier(s)
      continue
    }
    if (OPERATOR_CHARS.includes(ch)) {
      s.tokens[s.i] = 'operator'
      s.i++
      continue
    }
    if (BRACKET_CHARS.includes(ch)) {
      s.tokens[s.i] = 'bracket'
      s.i++
      continue
    }
    if (BRACE_CHARS.includes(ch)) {
      s.tokens[s.i] = 'brace'
      s.i++
      continue
    }
    if (PUNCTUATION_CHARS.includes(ch)) {
      s.tokens[s.i] = 'punctuation'
      s.i++
      continue
    }

    s.i++
  }

  return s.tokens
}
