<template>
  <div
    class="practice-page flex flex-col gap-[12px] flex-1 min-h-0 min-[1200px]:flex-row min-[1200px]:gap-[20px]"
  >
    <!-- Pause overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="typingStore.isPaused"
          class="fixed inset-0 bg-bg-overlay flex items-center justify-center z-[90] cursor-pointer"
          @click="engine.togglePause()"
        >
          <div
            class="text-center bg-bg-surface border border-c-border-lit rounded-[16px] px-[60px] py-[40px]"
          >
            <div class="text-[2.5rem] mb-[12px]">⏸</div>
            <div class="font-code text-[1.4rem] font-bold text-c-text mb-[8px]">Paused</div>
            <div class="text-[0.78rem] text-c-text-faint">Click or press Space to resume</div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Sidebar: logo, languages, actions, live stats -->
    <aside
      class="pp-sidebar flex flex-wrap items-center gap-[12px] pb-[12px] border-b border-c-border min-[1200px]:order-2 min-[1200px]:flex-col min-[1200px]:flex-nowrap min-[1200px]:items-stretch min-[1200px]:w-[220px] min-[1200px]:min-w-[220px] min-[1200px]:flex-shrink-0 min-[1200px]:gap-0 min-[1200px]:pb-0 min-[1200px]:border-b-0 min-[1200px]:h-full min-[1200px]:overflow-y-auto min-[1200px]:overflow-x-clip max-[768px]:gap-[8px]"
    >
      <div
        class="contents min-[1200px]:flex min-[1200px]:flex-col min-[1200px]:py-[10px] min-[1200px]:border-b min-[1200px]:border-c-border"
      >
        <AppLogo />
      </div>

      <div
        class="contents min-[1200px]:flex min-[1200px]:flex-col min-[1200px]:py-[10px] min-[1200px]:border-b min-[1200px]:border-c-border"
      >
        <div
          class="hidden min-[1200px]:block font-code text-[0.58rem] font-semibold text-c-text-faint uppercase tracking-[0.1em] mb-[4px]"
        >
          Language
        </div>
        <p
          class="hidden min-[1200px]:block text-[0.65rem] text-c-text-faint leading-[1.4] mb-[6px]"
        >
          Pick the language you want to practice
        </p>
        <ToolbarLanguageSelector
          :languages="snippetsStore.languages"
          :selected-id="snippetsStore.selectedLanguageId"
          @select="onLanguageSelect"
        />
        <UiBaseButton
          variant="glow"
          :small="true"
          class="flex-shrink-0 min-[1200px]:mt-[6px] min-[1200px]:w-full min-[1200px]:justify-center"
          @click="onLoadRandom"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
          Start
        </UiBaseButton>
      </div>

      <div
        class="contents min-[1200px]:flex min-[1200px]:flex-col min-[1200px]:py-[10px] min-[1200px]:border-b min-[1200px]:border-c-border"
      >
        <div
          class="hidden min-[1200px]:block font-code text-[0.58rem] font-semibold text-c-text-faint uppercase tracking-[0.1em] mb-[4px]"
        >
          Controls
        </div>
        <ToolbarActions
          :url-open="urlOpen"
          :can-pause="typingStore.isActive && !typingStore.isComplete"
          :is-paused="typingStore.isPaused"
          @toggle-url="toggleUrl"
          @toggle-pause="engine.togglePause()"
          @reset="onReset"
        />
      </div>

      <div
        v-if="bookmarksStore.bookmarks.length > 0"
        class="contents min-[1200px]:flex min-[1200px]:flex-col min-[1200px]:py-[10px] min-[1200px]:border-b min-[1200px]:border-c-border"
      >
        <div
          class="hidden min-[1200px]:block font-code text-[0.58rem] font-semibold text-c-text-faint uppercase tracking-[0.1em] mb-[4px]"
        >
          Bookmarks
        </div>
        <div class="hidden min-[1200px]:flex flex-col gap-[3px]">
          <button
            v-for="bm in bookmarksStore.bookmarks"
            :key="bm.url"
            class="flex items-center gap-[5px] bg-transparent border-none cursor-pointer px-0 py-[4px] text-c-text-dim font-code text-[0.65rem] text-left rounded-[4px] transition-colors duration-150 overflow-hidden hover:text-c-accent"
            :title="bm.name"
            @click="onLoadBookmark(bm)"
          >
            <span class="text-c-yellow flex-shrink-0 text-[0.7rem]">★</span>
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ bm.name }}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Editor column -->
    <div class="pp-editor flex flex-col min-w-0 flex-1 min-h-0 min-[1200px]:order-1">
      <div class="flex items-center gap-[8px]">
        <div class="flex-1 min-w-0">
          <EditorFileTabBar
            :file-name="typingStore.fileName || 'untitled'"
            :progress="engine.fileProgress.value"
          />
        </div>
        <button
          v-if="typingStore.fileUrl"
          :class="[
            'flex-shrink-0 bg-transparent border rounded-[6px] text-[0.9rem] cursor-pointer px-[8px] py-[4px] transition-all duration-200 leading-none hover:border-c-border-lit hover:text-c-yellow',
            bookmarksStore.isBookmarked(typingStore.fileUrl)
              ? 'text-c-yellow border-[rgba(210,153,34,0.3)] bg-[rgba(210,153,34,0.08)]'
              : 'text-c-text-faint border-c-border',
          ]"
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

    <PanelsUrlPanel :open="urlOpen" :error="urlError" @fetch="onLoadFromUrl" @close="closeUrl" />
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
    urlError,
    hiddenInputRef,
    typingContainerRef,
    toggleUrl,
    closeUrl,
    focusInput,
    onLoadRandom,
    onLanguageSelect,
    onLoadFromUrl,
    onLoadBookmark,
    toggleBookmark,
    onReset,
    onRetry,
    onNewFile,
    onKeyDown,
  } = useIndexPage()
</script>
