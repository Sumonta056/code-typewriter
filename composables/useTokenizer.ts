import type { TokenType } from '~/types'

const KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'class',
  'import',
  'export',
  'from',
  'default',
  'new',
  'this',
  'typeof',
  'instanceof',
  'async',
  'await',
  'try',
  'catch',
  'finally',
  'throw',
  'switch',
  'case',
  'break',
  'continue',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'in',
  'of',
  'extends',
  'implements',
  'interface',
  'type',
  'enum',
  'readonly',
  'abstract',
  'static',
  'super',
  'yield',
  'delete',
  'as',
  'is',
  'public',
  'private',
  'protected',
  'module',
  'require',
  'declare',
  'namespace',
  'keyof',
  'infer',
  'satisfies',
])

const CONTROL = new Set([
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'return',
  'throw',
  'try',
  'catch',
  'finally',
  'yield',
  'await',
])

const BUILTIN = new Set([
  'console',
  'window',
  'document',
  'Math',
  'JSON',
  'Object',
  'Array',
  'String',
  'Number',
  'Boolean',
  'Promise',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'Symbol',
  'RegExp',
  'Error',
  'TypeError',
  'RangeError',
  'Date',
  'parseInt',
  'parseFloat',
  'setTimeout',
  'setInterval',
  'clearTimeout',
  'clearInterval',
  'fetch',
  'process',
  'global',
  'globalThis',
  'Proxy',
  'Reflect',
])

function isWordChar(c: string | undefined): boolean {
  return /[\w$]/.test(c || '')
}

export function useTokenizer() {
  function tokenize(code: string): TokenType[] {
    const tokens: TokenType[] = new Array(code.length).fill('plain')
    let i = 0
    const len = code.length

    function peek(offset: number): string {
      return code[i + offset] || ''
    }

    function mark(from: number, to: number, type: TokenType) {
      for (let j = from; j < to && j < len; j++) tokens[j] = type
    }

    while (i < len) {
      const ch = code[i]

      if (ch === '/' && peek(1) === '/') {
        const start = i
        while (i < len && code[i] !== '\n') i++
        mark(start, i, 'comment')
        continue
      }

      if (ch === '/' && peek(1) === '*') {
        const start = i
        i += 2
        while (i < len && !(code[i] === '*' && peek(1) === '/')) i++
        i += 2
        mark(start, i, 'comment')
        continue
      }

      if (ch === "'" || ch === '"' || ch === '`') {
        const quote = ch
        const start = i
        i++
        while (i < len) {
          if (code[i] === '\\') {
            i += 2
            continue
          }
          if (code[i] === quote) {
            i++
            break
          }
          if (quote !== '`' && code[i] === '\n') break
          i++
        }
        mark(start, i, 'string')
        continue
      }

      if (/\d/.test(ch) || (ch === '.' && /\d/.test(peek(1)))) {
        const start = i
        if (ch === '0' && (peek(1) === 'x' || peek(1) === 'X')) {
          i += 2
          while (i < len && /[\da-fA-F_]/.test(code[i])) i++
        } else if (ch === '0' && (peek(1) === 'b' || peek(1) === 'B')) {
          i += 2
          while (i < len && /[01_]/.test(code[i])) i++
        } else {
          while (i < len && /[\d._eE]/.test(code[i])) i++
          if (code[i] === 'n') i++
        }
        mark(start, i, 'number')
        continue
      }

      if (ch === '<' && (peek(1) === '/' || /[a-zA-Z!]/.test(peek(1)))) {
        const start = i
        const rest = code.slice(i, i + 40)
        if (/^<\/?[a-zA-Z!]/.test(rest)) {
          i++
          if (code[i] === '/') i++
          const nameStart = i
          while (i < len && /[\w\-.]/.test(code[i])) i++
          mark(start, nameStart, 'tag-bracket')
          mark(nameStart, i, 'tag-name')
          while (i < len && code[i] !== '>') {
            if (code[i] === '=' || code[i] === ' ' || code[i] === '\n' || code[i] === '\t') {
              i++
            } else if (code[i] === '"' || code[i] === "'") {
              const qs = i
              const q = code[i]
              i++
              while (i < len && code[i] !== q) i++
              i++
              mark(qs, i, 'string')
            } else if (code[i] === ':' || code[i] === '@' || (code[i] === 'v' && peek(1) === '-')) {
              const ds = i
              while (i < len && /[\w\-:@.]/.test(code[i])) i++
              mark(ds, i, 'tag-attr-special')
            } else if (/[\w\-]/.test(code[i])) {
              const as = i
              while (i < len && /[\w\-]/.test(code[i])) i++
              mark(as, i, 'tag-attr')
            } else if (code[i] === '/') {
              tokens[i] = 'tag-bracket'
              i++
            } else {
              i++
            }
          }
          if (i < len && code[i] === '>') {
            tokens[i] = 'tag-bracket'
            i++
          }
          continue
        }
      }

      if (ch === '@' && /[a-zA-Z]/.test(peek(1))) {
        const start = i
        i++
        while (i < len && isWordChar(code[i])) i++
        mark(start, i, 'decorator')
        continue
      }

      if (/[a-zA-Z_$]/.test(ch)) {
        const start = i
        while (i < len && isWordChar(code[i])) i++
        const word = code.slice(start, i)

        if (CONTROL.has(word)) {
          mark(start, i, 'control')
        } else if (word === 'true' || word === 'false') {
          mark(start, i, 'boolean')
        } else if (word === 'null' || word === 'undefined' || word === 'void') {
          mark(start, i, 'null')
        } else if (
          word === 'import' ||
          word === 'export' ||
          word === 'from' ||
          word === 'as' ||
          word === 'default'
        ) {
          mark(start, i, 'import')
        } else if (KEYWORDS.has(word)) {
          mark(start, i, 'keyword')
        } else if (BUILTIN.has(word)) {
          mark(start, i, 'builtin')
        } else if (/^[A-Z]/.test(word) && word.length > 1) {
          mark(start, i, 'type')
        } else if (i < len && code[i] === '(') {
          mark(start, i, 'func-call')
        } else {
          let prevNonSpace = start - 1
          while (prevNonSpace >= 0 && code[prevNonSpace] === ' ') prevNonSpace--
          if (prevNonSpace >= 0 && code[prevNonSpace] === '.') {
            mark(start, i, 'property')
          }
        }
        continue
      }

      if ('=+-*/<>!&|?:^%~'.includes(ch)) {
        tokens[i] = 'operator'
        i++
        continue
      }

      if ('()[]'.includes(ch)) {
        tokens[i] = 'bracket'
        i++
        continue
      }

      if ('{}'.includes(ch)) {
        tokens[i] = 'brace'
        i++
        continue
      }

      if (';,.'.includes(ch)) {
        tokens[i] = 'punctuation'
        i++
        continue
      }

      i++
    }

    return tokens
  }

  return { tokenize }
}
