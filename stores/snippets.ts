import { defineStore } from 'pinia'
import type { Language, SnippetFile, SnippetsData } from '~/types'

export const useSnippetsStore = defineStore('snippets', () => {
  const languages = ref<Language[]>([])
  const selectedLanguageId = ref<string>('')
  const isLoaded = ref(false)

  const selectedLanguage = computed(
    () => languages.value.find((l) => l.id === selectedLanguageId.value) ?? null,
  )

  function getRandomFile(): SnippetFile | null {
    const lang = selectedLanguage.value
    if (!lang || lang.files.length === 0) return null
    return lang.files[Math.floor(Math.random() * lang.files.length)]
  }

  async function loadSnippets() {
    try {
      const data: SnippetsData = await $fetch('/snippets.json')
      languages.value = data.languages
      if (data.languages.length > 0) {
        selectedLanguageId.value = data.languages[0].id
      }
      isLoaded.value = true
    } catch (e) {
      console.error('Failed to load snippets.json:', e)
    }
  }

  function selectLanguage(id: string) {
    selectedLanguageId.value = id
  }

  return {
    languages,
    selectedLanguageId,
    isLoaded,
    selectedLanguage,
    getRandomFile,
    loadSnippets,
    selectLanguage,
  }
})
