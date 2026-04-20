import { onScopeDispose } from 'vue'
import { useGithubFetcher } from '~/composables/useGithubFetcher'
import { useTypingStats } from '~/composables/useTypingStats'
import { useHistoryStore } from '~/stores/history'
import { useSettingsStore } from '~/stores/settings'
import { useSnippetsStore } from '~/stores/snippets'
import { useTypingStore } from '~/stores/typing'
import { RESULTS_SHOW_DELAY_MS, TYPING_ACTIVE_TIMEOUT_MS } from '~/utils/constants'
import { tokenizeCode } from '~/utils/shikiHighlighter'

export function useTypingEngine() {
  const typingStore = useTypingStore()
  const settingsStore = useSettingsStore()
  const snippetsStore = useSnippetsStore()
  const historyStore = useHistoryStore()
  const fetcher = useGithubFetcher()
  const stats = useTypingStats()

  const showResults = ref(false)
  const typingActive = ref(false)
  const isNewPB = ref(false)

  watch(
    () => settingsStore.settings.maxLines,
    async () => {
      const url = typingStore.fileUrl
      const name = typingStore.fileName
      if (!url || typingStore.currentIndex > 0) return
      await loadCode(url, name)
    },
  )

  watch(
    () => settingsStore.settings.editorTheme,
    async (theme) => {
      const code = typingStore.code
      const url = typingStore.fileUrl
      if (!code || !url) return
      const tokens = await tokenizeCode(code, url, theme)
      typingStore.updateTokens(tokens)
    },
  )
  // Track error positions per character during session — plain object, never read reactively
  let sessionErrorMap: Record<string, number> = {}
  let typingTimeout: ReturnType<typeof setTimeout> | null = null
  let resultsTimeout: ReturnType<typeof setTimeout> | null = null

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
    const tokens = await tokenizeCode(code, url, settingsStore.settings.editorTheme)
    typingStore.setupSession(code, tokens, result.fileName || name, url)
    stats.resetStats()
    showResults.value = false
    isNewPB.value = false
    sessionErrorMap = {}
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

    const expected = typingStore.code[typingStore.currentIndex] as string
    if (char === expected) {
      typingStore.advanceCorrect()
    } else {
      typingStore.advanceIncorrect()
      // Track which expected character was missed
      sessionErrorMap[expected] = (sessionErrorMap[expected] || 0) + 1
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
      errorMap: { ...sessionErrorMap },
    })

    resultsTimeout = setTimeout(() => {
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
    sessionErrorMap = {}
  }

  function retrySession() {
    resetSession()
  }

  function cleanup() {
    stats.stopTimer()
    if (typingTimeout) {
      clearTimeout(typingTimeout)
      typingTimeout = null
    }
    if (resultsTimeout) {
      clearTimeout(resultsTimeout)
      resultsTimeout = null
    }
  }

  onScopeDispose(cleanup)

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
