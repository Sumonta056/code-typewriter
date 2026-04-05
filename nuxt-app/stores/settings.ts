import { defineStore } from 'pinia'
import type { AppSettings, NumericSettingKey, BooleanSettingKey } from '~/types'

const STORAGE_KEY = 'codeTypeSettings'

const NUMERIC_LIMITS: Record<NumericSettingKey, { min: number; max: number }> = {
  fontSize: { min: 10, max: 24 },
  tabSize: { min: 1, max: 8 },
  maxLines: { min: 10, max: 200 },
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive<AppSettings>({
    fontSize: 14,
    tabSize: 2,
    maxLines: 50,
    sound: false,
    lineNumbers: true,
    smoothCaret: true,
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

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) Object.assign(settings, JSON.parse(saved))
    } catch { /* ignore */ }
    applyCssVariables()
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch { /* ignore */ }
  }

  function applyCssVariables() {
    if (!import.meta.client) return
    const root = document.documentElement
    root.style.setProperty('--code-font-size', settings.fontSize + 'px')
    root.style.setProperty('--code-tab-size', String(settings.tabSize))
  }

  return { settings, updateNumeric, toggleBoolean, loadFromStorage, saveToStorage, applyCssVariables }
})
