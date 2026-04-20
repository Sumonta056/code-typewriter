<template>
  <div class="practice-page">
    <!-- Pause overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="typingStore.isPaused" class="pause-overlay" @click="engine.togglePause()">
          <div class="pause-card">
            <div class="pause-icon">⏸</div>
            <div class="pause-title">Paused</div>
            <div class="pause-hint">Click or press Space to resume</div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Right sidebar: logo, languages, actions, live stats -->
    <aside class="pp-sidebar">
      <div class="sb-section">
        <AppLogo />
      </div>

      <div class="sb-section">
        <div class="sb-label">Language</div>
        <ToolbarLanguageSelector
          :languages="snippetsStore.languages"
          :selected-id="snippetsStore.selectedLanguageId"
          @select="snippetsStore.selectLanguage"
        />
      </div>

      <div class="sb-section">
        <div class="sb-label">Controls</div>
        <ToolbarActions
          :url-open="urlOpen"
          :settings-open="settingsOpen"
          :can-pause="typingStore.isActive && !typingStore.isComplete"
          :is-paused="typingStore.isPaused"
          @toggle-url="toggleUrl"
          @toggle-settings="toggleSettings"
          @toggle-pause="engine.togglePause()"
          @random="onLoadRandom"
          @reset="onReset"
        />
      </div>

      <div class="sb-section sb-stats">
        <StatsLiveStats
          :visible="typingStore.isActive || typingStore.isComplete"
          :wpm="engine.stats.wpm.value"
          :accuracy="engine.stats.accuracy.value"
          :elapsed="engine.stats.elapsedFormatted.value"
          :progress="engine.stats.progress.value"
        />
        <!-- Live accuracy sparkline -->
        <StatsAccuracySparkline
          :visible="typingStore.isActive && !typingStore.isComplete"
          :history="engine.stats.accuracyHistory.value"
        />
      </div>

      <!-- Bookmarks section -->
      <div v-if="bookmarksStore.bookmarks.length > 0" class="sb-section sb-bookmarks">
        <div class="sb-label">Bookmarks</div>
        <div class="bookmark-list">
          <button
            v-for="bm in bookmarksStore.bookmarks"
            :key="bm.url"
            class="bookmark-item"
            :title="bm.name"
            @click="onLoadBookmark(bm)"
          >
            <span class="bookmark-star">★</span>
            <span class="bookmark-name">{{ bm.name }}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Editor column -->
    <div class="pp-editor">
      <PanelsUrlPanel :open="urlOpen" :error="urlError" @fetch="onLoadFromUrl" />
      <PanelsSettingsPanel :open="settingsOpen" />

      <div class="file-tab-row">
        <EditorFileTabBar
          :file-name="typingStore.fileName || 'untitled'"
          :progress="engine.fileProgress.value"
          :stats-visible="typingStore.isActive || typingStore.isComplete"
          :wpm="engine.stats.wpm.value"
          :accuracy="engine.stats.accuracy.value"
          :elapsed="engine.stats.elapsedFormatted.value"
        />
        <!-- Bookmark toggle button -->
        <button
          v-if="typingStore.fileUrl"
          :class="['bookmark-toggle', { active: bookmarksStore.isBookmarked(typingStore.fileUrl) }]"
          :title="
            bookmarksStore.isBookmarked(typingStore.fileUrl)
              ? 'Remove bookmark'
              : 'Bookmark this file'
          "
          @click="toggleBookmark"
        >
          {{ bookmarksStore.isBookmarked(typingStore.fileUrl) ? '★' : '☆' }}
        </button>
      </div>

      <EditorFrame @click="focusInput">
        <EditorTypingContainer
          ref="typingContainerRef"
          :has-code="typingStore.charCount > 0"
          :code="typingStore.code"
          :char-states="typingStore.charStates"
          :tokens="typingStore.tokens"
          :current-index="typingStore.currentIndex"
          :show-line-numbers="settingsStore.settings.lineNumbers"
          :smooth-caret="settingsStore.settings.smoothCaret"
          :typing-active="engine.typingActive.value"
        />
      </EditorFrame>

      <EditorProgressTrack
        :percent="typingStore.progressPercent"
        :visible="typingStore.isActive || typingStore.isComplete"
      />
    </div>

    <UiHiddenInput ref="hiddenInputRef" @keydown="onKeyDown" />

    <ResultsOverlay
      :visible="engine.showResults.value"
      :wpm="engine.stats.wpm.value"
      :raw-wpm="engine.stats.rawWpm.value"
      :cpm="engine.stats.cpm.value"
      :accuracy="engine.stats.accuracy.value"
      :time="engine.stats.elapsedFormatted.value"
      :chars="typingStore.charCount"
      :errors="typingStore.totalErrors"
      :file-name="typingStore.fileName"
      :is-new-p-b="engine.isNewPB.value"
      @retry="onRetry"
      @new-file="onNewFile"
    />

    <OverlayLoadingOverlay :visible="engine.fetcher.isLoading.value" />
  </div>
</template>

<script setup lang="ts">
  import { useKeyboardHandler } from '~/composables/useKeyboardHandler'
  import { useScrollTracker } from '~/composables/useScrollTracker'
  import { useTypingEngine } from '~/composables/useTypingEngine'
  import type { BookmarkedFile } from '~/stores/bookmarks'
  import { useBookmarksStore } from '~/stores/bookmarks'
  import { useSettingsStore } from '~/stores/settings'
  import { useSnippetsStore } from '~/stores/snippets'
  import { useTypingStore } from '~/stores/typing'

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

  const hiddenInputRef = ref<InstanceType<any> | null>(null)
  const typingContainerRef = ref<InstanceType<any> | null>(null)

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
      }, 1500)
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
    // Space toggles pause when session is active (not during typing start)
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
</script>
