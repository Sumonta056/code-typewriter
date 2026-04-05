import { defineStore } from 'pinia'
import type { AppSettings, NumericSettingKey, BooleanSettingKey, ThemeKey } from '~/types'

const STORAGE_KEY = 'codeTypeSettings'

const NUMERIC_LIMITS: Record<NumericSettingKey, { min: number; max: number }> = {
  fontSize: { min: 10, max: 24 },
  tabSize: { min: 1, max: 8 },
  maxLines: { min: 10, max: 200 },
}

const THEME_VARS: Record<ThemeKey, Record<string, string>> = {
  dark: {
    '--bg-root': '#06080f',
    '--bg-main': '#0c1018',
    '--bg-surface': '#111623',
    '--bg-raised': '#161c2e',
    '--bg-hover': '#1b2340',
    '--border': '#1c2438',
    '--border-lit': '#2a3555',
    '--text': '#c9d1d9',
    '--text-dim': '#6e7a91',
    '--text-faint': '#3a4560',
    '--accent': '#58a6ff',
    '--accent-rgb': '88, 166, 255',
    '--green': '#3fb950',
    '--green-rgb': '63, 185, 80',
    '--red': '#f85149',
    '--red-rgb': '248, 81, 73',
    '--purple': '#bc8cff',
    '--purple-rgb': '188, 140, 255',
    '--yellow': '#d29922',
    '--orange': '#db6d28',
    '--syn-keyword': '#c678dd',
    '--syn-control': '#c678dd',
    '--syn-string': '#98c379',
    '--syn-number': '#d19a66',
    '--syn-comment': '#5c6370',
    '--syn-func-call': '#61afef',
    '--syn-type': '#e5c07b',
    '--syn-builtin': '#e5c07b',
    '--syn-operator': '#56b6c2',
    '--syn-bracket': '#abb2bf',
    '--syn-brace': '#d19a66',
    '--syn-punctuation': '#abb2bf',
    '--syn-property': '#e06c75',
    '--syn-boolean': '#d19a66',
    '--syn-null': '#d19a66',
    '--syn-import': '#c678dd',
    '--syn-decorator': '#e5c07b',
    '--syn-tag-bracket': '#abb2bf',
    '--syn-tag-name': '#e06c75',
    '--syn-tag-attr': '#d19a66',
    '--syn-tag-attr-special': '#c678dd',
    '--syn-plain': '#abb2bf',
  },
  monokai: {
    '--bg-root': '#1a1a1a',
    '--bg-main': '#272822',
    '--bg-surface': '#2d2d2d',
    '--bg-raised': '#3e3d32',
    '--bg-hover': '#49483e',
    '--border': '#3e3d32',
    '--border-lit': '#75715e',
    '--text': '#f8f8f2',
    '--text-dim': '#a59f85',
    '--text-faint': '#75715e',
    '--accent': '#66d9e8',
    '--accent-rgb': '102, 217, 232',
    '--green': '#a6e22e',
    '--green-rgb': '166, 226, 46',
    '--red': '#f92672',
    '--red-rgb': '249, 38, 114',
    '--purple': '#ae81ff',
    '--purple-rgb': '174, 129, 255',
    '--yellow': '#e6db74',
    '--orange': '#fd971f',
    '--syn-keyword': '#f92672',
    '--syn-control': '#f92672',
    '--syn-string': '#e6db74',
    '--syn-number': '#ae81ff',
    '--syn-comment': '#75715e',
    '--syn-func-call': '#a6e22e',
    '--syn-type': '#66d9e8',
    '--syn-builtin': '#66d9e8',
    '--syn-operator': '#f92672',
    '--syn-bracket': '#f8f8f2',
    '--syn-brace': '#f8f8f2',
    '--syn-punctuation': '#f8f8f2',
    '--syn-property': '#fd971f',
    '--syn-boolean': '#ae81ff',
    '--syn-null': '#ae81ff',
    '--syn-import': '#f92672',
    '--syn-decorator': '#a6e22e',
    '--syn-tag-bracket': '#f8f8f2',
    '--syn-tag-name': '#f92672',
    '--syn-tag-attr': '#a6e22e',
    '--syn-tag-attr-special': '#66d9e8',
    '--syn-plain': '#f8f8f2',
  },
  solarized: {
    '--bg-root': '#001e26',
    '--bg-main': '#002b36',
    '--bg-surface': '#073642',
    '--bg-raised': '#0d3d4f',
    '--bg-hover': '#124a5c',
    '--border': '#124a5c',
    '--border-lit': '#2a6477',
    '--text': '#839496',
    '--text-dim': '#657b83',
    '--text-faint': '#586e75',
    '--accent': '#268bd2',
    '--accent-rgb': '38, 139, 210',
    '--green': '#859900',
    '--green-rgb': '133, 153, 0',
    '--red': '#dc322f',
    '--red-rgb': '220, 50, 47',
    '--purple': '#6c71c4',
    '--purple-rgb': '108, 113, 196',
    '--yellow': '#b58900',
    '--orange': '#cb4b16',
    '--syn-keyword': '#cb4b16',
    '--syn-control': '#cb4b16',
    '--syn-string': '#2aa198',
    '--syn-number': '#d33682',
    '--syn-comment': '#586e75',
    '--syn-func-call': '#268bd2',
    '--syn-type': '#b58900',
    '--syn-builtin': '#b58900',
    '--syn-operator': '#cb4b16',
    '--syn-bracket': '#839496',
    '--syn-brace': '#839496',
    '--syn-punctuation': '#839496',
    '--syn-property': '#268bd2',
    '--syn-boolean': '#d33682',
    '--syn-null': '#d33682',
    '--syn-import': '#cb4b16',
    '--syn-decorator': '#b58900',
    '--syn-tag-bracket': '#839496',
    '--syn-tag-name': '#cb4b16',
    '--syn-tag-attr': '#b58900',
    '--syn-tag-attr-special': '#268bd2',
    '--syn-plain': '#839496',
  },
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive<AppSettings>({
    fontSize: 14,
    tabSize: 2,
    maxLines: 50,
    sound: false,
    lineNumbers: true,
    smoothCaret: true,
    theme: 'dark',
  })

  function updateNumeric(key: NumericSettingKey, delta: number) {
    const { min, max } = NUMERIC_LIMITS[key]
    settings[key] = Math.max(min, Math.min(max, settings[key] + delta))
    saveToStorage()
    applyCssVariables()
  }

  function toggleBoolean(key: BooleanSettingKey) {
    settings[key] = !settings[key]
    saveToStorage()
    applyCssVariables()
  }

  function setTheme(theme: ThemeKey) {
    settings.theme = theme
    saveToStorage()
    applyTheme(theme)
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (typeof parsed !== 'object' || parsed === null) return

      for (const key of Object.keys(NUMERIC_LIMITS) as NumericSettingKey[]) {
        if (typeof parsed[key] === 'number' && isFinite(parsed[key])) {
          const { min, max } = NUMERIC_LIMITS[key]
          settings[key] = Math.max(min, Math.min(max, parsed[key]))
        }
      }

      const boolKeys: BooleanSettingKey[] = ['sound', 'lineNumbers', 'smoothCaret']
      for (const key of boolKeys) {
        if (typeof parsed[key] === 'boolean') {
          settings[key] = parsed[key]
        }
      }

      if (parsed.theme && ['dark', 'monokai', 'solarized'].includes(parsed.theme)) {
        settings.theme = parsed.theme as ThemeKey
      }
    } catch {
      /* ignore */
    }
    applyCssVariables()
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
  }

  function applyTheme(theme: ThemeKey) {
    if (!import.meta.client) return
    const root = document.documentElement
    const vars = THEME_VARS[theme]
    for (const [key, val] of Object.entries(vars)) {
      root.style.setProperty(key, val)
    }
  }

  function applyCssVariables() {
    if (!import.meta.client) return
    const root = document.documentElement
    root.style.setProperty('--code-font-size', settings.fontSize + 'px')
    root.style.setProperty('--code-tab-size', String(settings.tabSize))
    applyTheme(settings.theme)
  }

  return {
    settings,
    updateNumeric,
    toggleBoolean,
    setTheme,
    loadFromStorage,
    saveToStorage,
    applyCssVariables,
  }
})
