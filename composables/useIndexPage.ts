import { onMounted, onUnmounted, ref } from 'vue'
import type HiddenInput from '~/components/ui/HiddenInput.vue'
import type TypingContainer from '~/components/editor/TypingContainer.vue'
import { useKeyboardHandler } from '~/composables/useKeyboardHandler'
import { useScrollTracker } from '~/composables/useScrollTracker'
import { useTypingEngine } from '~/composables/useTypingEngine'
import type { BookmarkedFile } from '~/stores/bookmarks'
import { useBookmarksStore } from '~/stores/bookmarks'
import { useSettingsStore } from '~/stores/settings'
import { useSnippetsStore } from '~/stores/snippets'
import { useTypingStore } from '~/stores/typing'
import { URL_ERROR_RESET_MS } from '~/utils/constants'

type HiddenInputRef = InstanceType<typeof HiddenInput>
type TypingContainerRef = InstanceType<typeof TypingContainer>

export function useIndexPage() {
  const typingStore = useTypingStore()
  const settingsStore = useSettingsStore()
  const snippetsStore = useSnippetsStore()
  const bookmarksStore = useBookmarksStore()

  const engine = useTypingEngine()
  const { handleKeyDown } = useKeyboardHandler(() => settingsStore.settings.tabSize)
  const { scrollToIndex } = useScrollTracker()

  const urlOpen = ref(false)
  const settingsOpen = ref(false)
  const urlError = ref(false)

  const hiddenInputRef = ref<HiddenInputRef | null>(null)
  const typingContainerRef = ref<TypingContainerRef | null>(null)

  function toggleUrl() {
    urlOpen.value = !urlOpen.value
    settingsOpen.value = false
  }

  function toggleSettings() {
    settingsOpen.value = !settingsOpen.value
    urlOpen.value = false
  }

  function focusInput() {
    if (typingStore.isSessionReady && !typingStore.isPaused) hiddenInputRef.value?.focus()
  }

  function focusAndClear() {
    nextTick(() => {
      hiddenInputRef.value?.clear()
      hiddenInputRef.value?.focus()
    })
  }

  async function onLoadRandom() {
    const ok = await engine.loadRandomFile()
    if (ok) focusAndClear()
  }

  async function onLoadFromUrl(input: string) {
    const trimmed = input.trim()
    if (!trimmed) return

    const parsed = engine.fetcher.parseGitHubUrl(trimmed)
    if (!parsed) {
      urlError.value = true
      setTimeout(() => {
        urlError.value = false
      }, URL_ERROR_RESET_MS)
      return
    }

    const ok = await engine.loadCode(trimmed, parsed.path.split('/').pop() || 'file')
    if (ok) focusAndClear()
  }

  async function onLoadBookmark(bm: BookmarkedFile) {
    const ok = await engine.loadCode(bm.url, bm.name)
    if (ok) focusAndClear()
  }

  function toggleBookmark() {
    if (!typingStore.fileUrl || !typingStore.fileName) return
    bookmarksStore.toggle({
      url: typingStore.fileUrl,
      name: typingStore.fileName,
      language: snippetsStore.selectedLanguageId,
    })
  }

  function onReset() {
    engine.resetSession()
    focusAndClear()
  }

  function onRetry() {
    engine.retrySession()
    focusAndClear()
  }

  function onNewFile() {
    engine.showResults.value = false
    onLoadRandom()
  }

  function scrollToCurrent() {
    const codeDisplay = typingContainerRef.value?.codeDisplayRef
    if (!codeDisplay) return
    const container = codeDisplay.containerEl
    const charEls = codeDisplay.charEls
    if (container && charEls) {
      scrollToIndex(container, charEls, typingStore.currentIndex)
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space' && typingStore.isPaused) {
      e.preventDefault()
      engine.togglePause()
      return
    }

    handleKeyDown(e, {
      onChar(char: string) {
        const result = engine.processChar(char)
        if (result === 'continue') scrollToCurrent()
      },
      onBackspace() {
        engine.processBackspace()
        scrollToCurrent()
      },
      isDisabled: () =>
        typingStore.isComplete || typingStore.charCount === 0 || typingStore.isPaused,
    })
  }

  function globalClickHandler(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input') || target.closest('.lang-btn')) return
    focusInput()
  }

  onMounted(() => {
    document.addEventListener('click', globalClickHandler)
    window.addEventListener('focus', focusInput)
  })

  onUnmounted(() => {
    engine.cleanup()
    document.removeEventListener('click', globalClickHandler)
    window.removeEventListener('focus', focusInput)
  })

  return {
    typingStore,
    settingsStore,
    snippetsStore,
    bookmarksStore,
    engine,
    urlOpen,
    settingsOpen,
    urlError,
    hiddenInputRef,
    typingContainerRef,
    toggleUrl,
    toggleSettings,
    focusInput,
    onLoadRandom,
    onLoadFromUrl,
    onLoadBookmark,
    toggleBookmark,
    onReset,
    onRetry,
    onNewFile,
    onKeyDown,
  }
}
