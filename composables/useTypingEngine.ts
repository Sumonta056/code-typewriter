import { useGithubFetcher } from '~/composables/useGithubFetcher'
import { useTokenizer } from '~/composables/useTokenizer'
import { useTypingStats } from '~/composables/useTypingStats'
import { useHistoryStore } from '~/stores/history'
import { useSettingsStore } from '~/stores/settings'
import { useSnippetsStore } from '~/stores/snippets'
import { useTypingStore } from '~/stores/typing'
import { RESULTS_SHOW_DELAY_MS, TYPING_ACTIVE_TIMEOUT_MS } from '~/utils/constants'

export function useTypingEngine() {
  const typingStore = useTypingStore()
  const settingsStore = useSettingsStore()
  const snippetsStore = useSnippetsStore()
  const historyStore = useHistoryStore()
  const { tokenize } = useTokenizer()
  const fetcher = useGithubFetcher()
  const stats = useTypingStats()

  const showResults = ref(false)
  const typingActive = ref(false)
  const isNewPB = ref(false)
  // Track error positions per character during session
  const sessionErrorMap = ref<Record<string, number>>({})
  let typingTimeout: ReturnType<typeof setTimeout> | null = null

  const fileProgress = computed(() => {
    if (typingStore.charCount === 0) return ''
    return `${typingStore.currentIndex}/${typingStore.charCount}`
  })

  function setTypingActive() {
    typingActive.value = true
    if (typingTimeout) clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      typingActive.value = false
    }, TYPING_ACTIVE_TIMEOUT_MS)
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
    isNewPB.value = false
    sessionErrorMap.value = {}
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
    if (typingStore.isPaused) return null
    if (typingStore.currentIndex >= typingStore.charCount) return null

    if (!typingStore.startTime) {
      typingStore.startTimer()
      stats.startTimer()
    }

    setTypingActive()

    const expected = typingStore.code[typingStore.currentIndex]
    if (char === expected) {
      typingStore.advanceCorrect()
    } else {
      typingStore.advanceIncorrect()
      // Track which expected character was missed
      sessionErrorMap.value[expected] = (sessionErrorMap.value[expected] || 0) + 1
    }

    if (typingStore.currentIndex >= typingStore.charCount) {
      completeTyping()
      return 'complete'
    }
    return 'continue'
  }

  function processBackspace() {
    if (typingStore.isPaused) return
    if (typingStore.currentIndex <= 0) return
    setTypingActive()
    typingStore.goBack()
  }

  function togglePause() {
    if (!typingStore.isActive || typingStore.isComplete) return
    if (typingStore.isPaused) {
      typingStore.resume()
    } else {
      typingStore.pause()
    }
  }

  function completeTyping() {
    typingStore.markComplete()
    stats.stopTimer()
    stats.computeFinalStats()

    const prevBest = historyStore.bestWpm
    isNewPB.value = stats.wpm.value > prevBest

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
      errorMap: { ...sessionErrorMap.value },
    })

    setTimeout(() => {
      showResults.value = true
    }, RESULTS_SHOW_DELAY_MS)
  }

  function resetSession() {
    if (typingStore.charCount === 0) return
    typingStore.reset()
    stats.stopTimer()
    stats.resetStats()
    showResults.value = false
    isNewPB.value = false
    sessionErrorMap.value = {}
  }

  function retrySession() {
    showResults.value = false
    typingStore.reset()
    stats.stopTimer()
    stats.resetStats()
    isNewPB.value = false
    sessionErrorMap.value = {}
  }

  function cleanup() {
    stats.stopTimer()
  }

  return {
    stats,
    fetcher,
    typingActive,
    showResults,
    fileProgress,
    isNewPB,
    loadCode,
    loadRandomFile,
    processChar,
    processBackspace,
    togglePause,
    resetSession,
    retrySession,
    cleanup,
  }
}
