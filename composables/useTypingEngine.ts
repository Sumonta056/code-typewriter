import { useTypingStore } from '~/stores/typing'
import { useSettingsStore } from '~/stores/settings'
import { useSnippetsStore } from '~/stores/snippets'
import { useHistoryStore } from '~/stores/history'
import { useTokenizer } from '~/composables/useTokenizer'
import { useGithubFetcher } from '~/composables/useGithubFetcher'
import { useTypingStats } from '~/composables/useTypingStats'
import { useAudio } from '~/composables/useAudio'

export function useTypingEngine() {
  const typingStore = useTypingStore()
  const settingsStore = useSettingsStore()
  const snippetsStore = useSnippetsStore()
  const historyStore = useHistoryStore()
  const { tokenize } = useTokenizer()
  const fetcher = useGithubFetcher()
  const stats = useTypingStats()
  const { playKeySound } = useAudio()

  const showResults = ref(false)
  const typingActive = ref(false)
  let typingTimeout: ReturnType<typeof setTimeout> | null = null

  const fileProgress = computed(() => {
    if (typingStore.charCount === 0) return ''
    return `${typingStore.currentIndex}/${typingStore.charCount}`
  })

  function setTypingActive() {
    typingActive.value = true
    if (typingTimeout) clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => { typingActive.value = false }, 500)
  }

  async function loadCode(url: string, name: string): Promise<boolean> {
    const result = await fetcher.fetchCode(url, settingsStore.settings.maxLines)
    if (!result) {
      typingStore.fileName = 'Failed to load — check URL & try again'
      return false
    }
    // Expand tabs to spaces so the user can type Space for indentation
    const tabSpaces = ' '.repeat(settingsStore.settings.tabSize)
    const code = result.code.replace(/\t/g, tabSpaces)
    const tokens = tokenize(code)
    typingStore.setupSession(code, tokens, result.fileName || name, url)
    stats.resetStats()
    showResults.value = false
    return true
  }

  async function loadRandomFile(): Promise<boolean> {
    const file = snippetsStore.getRandomFile()
    if (!file) return false
    return loadCode(file.url, file.name)
  }

  /**
   * Returns 'complete' when the session finishes, 'continue' otherwise.
   */
  function processChar(char: string): 'complete' | 'continue' | null {
    if (typingStore.currentIndex >= typingStore.charCount) return null

    if (!typingStore.startTime) {
      typingStore.startTimer()
      stats.startTimer()
    }

    setTypingActive()
    playKeySound(settingsStore.settings.sound)

    const expected = typingStore.code[typingStore.currentIndex]
    if (char === expected) typingStore.advanceCorrect()
    else typingStore.advanceIncorrect()

    if (typingStore.currentIndex >= typingStore.charCount) {
      completeTyping()
      return 'complete'
    }
    return 'continue'
  }

  function processBackspace() {
    if (typingStore.currentIndex <= 0) return
    setTypingActive()
    typingStore.goBack()
  }

  function completeTyping() {
    typingStore.markComplete()
    stats.stopTimer()
    stats.computeFinalStats()

    historyStore.addEntry({
      fileName: typingStore.fileName,
      language: snippetsStore.selectedLanguageId,
      wpm: stats.wpm.value,
      rawWpm: stats.rawWpm.value,
      cpm: stats.cpm.value,
      accuracy: stats.accuracy.value,
      elapsedSeconds: stats.elapsedSeconds.value,
      time: stats.elapsedFormatted.value,
      chars: typingStore.charCount,
      errors: typingStore.totalErrors,
      date: new Date().toISOString(),
    })

    setTimeout(() => { showResults.value = true }, 350)
  }

  function resetSession() {
    if (typingStore.charCount === 0) return
    typingStore.reset()
    stats.stopTimer()
    stats.resetStats()
    showResults.value = false
  }

  function retrySession() {
    showResults.value = false
    typingStore.reset()
    stats.stopTimer()
    stats.resetStats()
  }

  function cleanup() {
    stats.stopTimer()
  }

  return {
    stats, fetcher, typingActive, showResults, fileProgress,
    loadCode, loadRandomFile, processChar, processBackspace,
    resetSession, retrySession, cleanup,
  }
}
