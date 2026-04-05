import { useSettingsStore } from '~/stores/settings'
import { useSnippetsStore } from '~/stores/snippets'
import { useHistoryStore } from '~/stores/history'

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const settingsStore = useSettingsStore()
  const snippetsStore = useSnippetsStore()
  const historyStore = useHistoryStore()

  settingsStore.loadFromStorage()
  historyStore.loadFromStorage()
  // Fire and forget — UI handles loading state via fetcher.isLoading
  snippetsStore.loadSnippets()
})
