import type { Highlighter } from 'shiki'
import { bundledThemesInfo, createHighlighter } from 'shiki'

export { bundledThemesInfo as SHIKI_THEMES }

export const DEFAULT_EDITOR_THEME = 'one-dark-pro'

const EXT_TO_LANG: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  mjs: 'javascript',
  cjs: 'javascript',
  vue: 'vue',
  py: 'python',
  java: 'java',
  go: 'go',
  rs: 'rust',
  css: 'css',
  scss: 'scss',
  less: 'less',
  html: 'html',
  json: 'json',
  jsonc: 'jsonc',
  md: 'markdown',
  mdx: 'mdx',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  c: 'c',
  h: 'c',
  cs: 'csharp',
  rb: 'ruby',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin',
  kts: 'kotlin',
  sh: 'shellscript',
  bash: 'shellscript',
  zsh: 'shellscript',
  sql: 'sql',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  graphql: 'graphql',
  gql: 'graphql',
  xml: 'xml',
  dart: 'dart',
  r: 'r',
  lua: 'lua',
  ex: 'elixir',
  exs: 'elixir',
  hs: 'haskell',
  clj: 'clojure',
  scala: 'scala',
  tf: 'hcl',
  svelte: 'svelte',
  astro: 'astro',
}

let _highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter(): Promise<Highlighter> {
  if (!_highlighterPromise) {
    _highlighterPromise = createHighlighter({ themes: [], langs: [] })
  }
  return _highlighterPromise
}

export function getLangFromUrl(url: string): string {
  const ext = url.split('.').pop()?.split('?')[0].toLowerCase() ?? ''
  return EXT_TO_LANG[ext] ?? ''
}

export async function tokenizeCode(
  code: string,
  fileUrl: string,
  theme: string,
): Promise<string[]> {
  const lang = getLangFromUrl(fileUrl)

  if (!lang) {
    return new Array(code.length).fill('')
  }

  const highlighter = await getHighlighter()

  if (!highlighter.getLoadedThemes().includes(theme)) {
    await highlighter.loadTheme(theme as Parameters<Highlighter['loadTheme']>[0])
  }

  if (!highlighter.getLoadedLanguages().includes(lang)) {
    try {
      await highlighter.loadLanguage(lang as Parameters<Highlighter['loadLanguage']>[0])
    } catch {
      return new Array(code.length).fill('')
    }
  }

  const { tokens: tokenLines } = highlighter.codeToTokens(code, {
    lang: lang as Parameters<Highlighter['codeToTokens']>[1]['lang'],
    theme,
  })

  const charColors: string[] = new Array(code.length).fill('')
  let charIdx = 0

  for (const tokenLine of tokenLines) {
    for (const token of tokenLine) {
      const color = token.color ?? ''
      for (let i = 0; i < token.content.length; i++) {
        if (charIdx < code.length) {
          charColors[charIdx++] = color
        }
      }
    }
    if (charIdx < code.length && code[charIdx] === '\n') {
      charIdx++
    }
  }

  return charColors
}
