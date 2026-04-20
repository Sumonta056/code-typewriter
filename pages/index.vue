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
        <StatsAccuracySparkline
          :visible="typingStore.isActive && !typingStore.isComplete"
          :history="engine.stats.accuracyHistory.value"
        />
      </div>

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
  import { useIndexPage } from '~/composables/useIndexPage'

  const {
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
  } = useIndexPage()
</script>
