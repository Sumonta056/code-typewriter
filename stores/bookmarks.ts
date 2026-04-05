import { defineStore } from 'pinia'

export interface BookmarkedFile {
  url: string
  name: string
  language: string
}

const STORAGE_KEY = 'codeTypeBookmarks'

export const useBookmarksStore = defineStore('bookmarks', () => {
  const bookmarks = ref<BookmarkedFile[]>([])

  const isBookmarked = computed(() => (url: string) => bookmarks.value.some((b) => b.url === url))

  function toggle(file: BookmarkedFile) {
    const idx = bookmarks.value.findIndex((b) => b.url === file.url)
    if (idx >= 0) {
      bookmarks.value.splice(idx, 1)
    } else {
      bookmarks.value.push(file)
    }
    saveToStorage()
  }

  function remove(url: string) {
    const idx = bookmarks.value.findIndex((b) => b.url === url)
    if (idx >= 0) {
      bookmarks.value.splice(idx, 1)
      saveToStorage()
    }
  }

  function loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        bookmarks.value = JSON.parse(saved) as BookmarkedFile[]
      }
    } catch {
      /* ignore */
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
    } catch {
      /* ignore */
    }
  }

  return {
    bookmarks,
    isBookmarked,
    toggle,
    remove,
    loadFromStorage,
    saveToStorage,
  }
})
