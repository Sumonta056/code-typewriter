import { defineStore } from 'pinia'
import type { Language, SnippetFile } from '~/types'

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
    return lang.files[Math.floor(Math.random() * lang.files.length)] ?? null
  }

  async function loadSnippets() {
    try {
      const ids: string[] = await $fetch('/languages/index.json')
      const langs = await Promise.all(ids.map((id) => $fetch<Language>(`/languages/${id}.json`)))
      languages.value = langs
      if (langs.length > 0 && langs[0]) {
        selectedLanguageId.value = langs[0].id
      }
      isLoaded.value = true
    } catch (e) {
      console.error('Failed to load language files:', e)
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
