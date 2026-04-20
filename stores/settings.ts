import { defineStore } from 'pinia'
import type { AppSettings, BooleanSettingKey, NumericSettingKey, ThemeKey } from '~/types'
import { DEFAULT_EDITOR_THEME } from '~/utils/shikiHighlighter'
import { THEME_KEYS, THEME_VARS } from '~/utils/themes'

const STORAGE_KEY = 'codeTypeSettings'
const SETTINGS_VERSION = 2

const NUMERIC_LIMITS: Record<NumericSettingKey, { min: number; max: number }> = {
  fontSize: { min: 10, max: 24 },
  tabSize: { min: 1, max: 8 },
  maxLines: { min: 10, max: 500 },
}

const BOOLEAN_KEYS: BooleanSettingKey[] = ['lineNumbers', 'smoothCaret']

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive<AppSettings>({
    fontSize: 15,
    tabSize: 2,
    maxLines: 200,
    lineNumbers: true,
    smoothCaret: true,
    theme: 'dark',
    editorTheme: DEFAULT_EDITOR_THEME,
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

  function setEditorTheme(theme: string) {
    settings.editorTheme = theme
    saveToStorage()
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved)
      if (typeof parsed !== 'object' || parsed === null) return

      const storedVersion = typeof parsed._version === 'number' ? parsed._version : 1

      for (const key of Object.keys(NUMERIC_LIMITS) as NumericSettingKey[]) {
        // v1→v2 migration: maxLines default was 50, skip to let new default (200) stand
        if (key === 'maxLines' && storedVersion < 2 && parsed[key] === 50) continue
        if (typeof parsed[key] === 'number' && isFinite(parsed[key])) {
          const { min, max } = NUMERIC_LIMITS[key]
          settings[key] = Math.max(min, Math.min(max, parsed[key]))
        }
      }

      for (const key of BOOLEAN_KEYS) {
        if (typeof parsed[key] === 'boolean') {
          settings[key] = parsed[key]
        }
      }

      if (parsed.theme && THEME_KEYS.includes(parsed.theme)) {
        settings.theme = parsed.theme as ThemeKey
      }

      if (typeof parsed.editorTheme === 'string' && parsed.editorTheme) {
        settings.editorTheme = parsed.editorTheme
      }
    } catch {
      /* ignore */
    }
    applyCssVariables()
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, _version: SETTINGS_VERSION }))
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
    setEditorTheme,
    loadFromStorage,
    saveToStorage,
    applyCssVariables,
  }
})
