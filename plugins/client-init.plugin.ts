import { useBookmarksStore } from '~/stores/bookmarks'
import { useHistoryStore } from '~/stores/history'
import { useSettingsStore } from '~/stores/settings'
import { useSnippetsStore } from '~/stores/snippets'

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const settingsStore = useSettingsStore()
  const snippetsStore = useSnippetsStore()
  const historyStore = useHistoryStore()
  const bookmarksStore = useBookmarksStore()

  settingsStore.loadFromStorage()
  historyStore.loadFromStorage()
  bookmarksStore.loadFromStorage()
  snippetsStore.loadSnippets()
})
