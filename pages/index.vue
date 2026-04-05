<template>
  <div class="practice-page">
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
          @toggle-url="toggleUrl"
          @toggle-settings="toggleSettings"
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
      </div>
    </aside>

    <!-- Editor column -->
    <div class="pp-editor">
      <PanelsUrlPanel :open="urlOpen" :error="urlError" @fetch="onLoadFromUrl" />
      <PanelsSettingsPanel :open="settingsOpen" />

      <EditorFileTabBar
        :file-name="typingStore.fileName || 'untitled'"
        :progress="engine.fileProgress.value"
      />

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
      @retry="onRetry"
      @new-file="onNewFile"
    />

    <OverlayLoadingOverlay :visible="engine.fetcher.isLoading.value" />
  </div>
</template>

<script setup lang="ts">
  import { useTypingStore } from '~/stores/typing'
  import { useSettingsStore } from '~/stores/settings'
  import { useSnippetsStore } from '~/stores/snippets'
  import { useTypingEngine } from '~/composables/useTypingEngine'
  import { useKeyboardHandler } from '~/composables/useKeyboardHandler'
  import { useScrollTracker } from '~/composables/useScrollTracker'

  const typingStore = useTypingStore()
  const settingsStore = useSettingsStore()
  const snippetsStore = useSnippetsStore()

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
    if (typingStore.isSessionReady) hiddenInputRef.value?.focus()
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
    handleKeyDown(e, {
      onChar(char: string) {
        const result = engine.processChar(char)
        if (result === 'continue') scrollToCurrent()
      },
      onBackspace() {
        engine.processBackspace()
        scrollToCurrent()
      },
      isDisabled: () => typingStore.isComplete || typingStore.charCount === 0,
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

<style scoped>
  /* ══════════════════════════════════
   Narrow (< 1200px): stacked layout
   ══════════════════════════════════ */
  .practice-page {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }

  .pp-sidebar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .sb-section {
    display: contents;
  }
  .sb-label {
    display: none;
  }
  .sb-stats {
    margin-left: auto;
  }

  .pp-editor {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  /* ══════════════════════════════════
   Wide (≥ 1200px): editor + sidebar
   ══════════════════════════════════ */
  @media (min-width: 1200px) {
    .practice-page {
      flex-direction: row;
      gap: 20px;
    }

    .pp-editor {
      order: 1;
      flex: 1;
    }

    .pp-sidebar {
      order: 2;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: stretch;
      width: 140px;
      flex-shrink: 0;
      gap: 0;
      padding-bottom: 0;
      border-bottom: none;
      position: sticky;
      top: 30px;
      align-self: flex-start;
    }

    .sb-section {
      display: flex;
      flex-direction: column;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
    }
    .sb-section:last-child {
      border-bottom: none;
    }

    .sb-label {
      display: block;
      font-family: var(--font-code);
      font-size: 0.58rem;
      font-weight: 600;
      color: var(--text-faint);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }

    .sb-stats {
      margin-left: 0;
    }

    /* ── Logo compact ── */
    .pp-sidebar :deep(.logo) {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    .pp-sidebar :deep(.logo-terminal) {
      display: none;
    }
    .pp-sidebar :deep(.logo-text) {
      font-size: 0.95rem;
    }
    .pp-sidebar :deep(.logo-version) {
      align-self: flex-start;
    }

    /* ── Language buttons vertical ── */
    .pp-sidebar :deep(.language-selector) {
      flex-direction: column;
      gap: 3px;
    }
    .pp-sidebar :deep(.lang-btn) {
      width: 100%;
      text-align: center;
      justify-content: center;
      padding: 7px 10px;
      font-size: 0.72rem;
    }

    /* ── Action buttons vertical ── */
    .pp-sidebar :deep(.toolbar-actions) {
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }
    .pp-sidebar :deep(.toolbar-separator) {
      width: 100%;
      height: 1px;
      margin: 2px 0;
    }
    .pp-sidebar :deep(.icon-btn) {
      width: 100%;
    }
    .pp-sidebar :deep(.btn) {
      width: 100%;
      justify-content: center;
      padding: 8px 10px;
      font-size: 0.75rem;
    }

    /* ── Live stats vertical ── */
    .pp-sidebar :deep(.header-stats) {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
      padding: 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .pp-sidebar :deep(.header-stats.visible) {
      transform: none;
    }
    .pp-sidebar :deep(.stat-divider) {
      width: 100%;
      height: 1px;
    }
    .pp-sidebar :deep(.stat-block) {
      text-align: left;
      min-width: 0;
    }
    .pp-sidebar :deep(.stat-value) {
      font-size: 1rem;
    }
    .pp-sidebar :deep(.stat-bar) {
      margin-top: 4px;
    }
  }

  /* ══════════════════════════════════
   Mobile (< 768px)
   ══════════════════════════════════ */
  @media (max-width: 768px) {
    .pp-sidebar {
      gap: 8px;
    }
  }
</style>
