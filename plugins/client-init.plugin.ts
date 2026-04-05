import { useSettingsStore } from '~/stores/settings'
import { useSnippetsStore } from '~/stores/snippets'
import { useHistoryStore } from '~/stores/history'
import { useBookmarksStore } from '~/stores/bookmarks'

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const settingsStore = useSettingsStore()
  const snippetsStore = useSnippetsStore()
  const historyStore = useHistoryStore()
  const bookmarksStore = useBookmarksStore()

  settingsStore.loadFromStorage()
  historyStore.loadFromStorage()
  bookmarksStore.loadFromStorage()
  // Fire and forget — UI handles loading state via fetcher.isLoading
  snippetsStore.loadSnippets()
})
