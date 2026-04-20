<template>
  <div class="toolbar-actions">
    <!-- GitHub URL -->
    <div class="toolbar-ctrl-card">
      <div class="toolbar-ctrl-card-top">
        <UiIconButton :is-active="urlOpen" title="Load from GitHub URL" @click="$emit('toggleUrl')">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </UiIconButton>
        <div class="toolbar-ctrl-card-text">
          <span class="toolbar-ctrl-card-label">GitHub URL</span>
          <span class="toolbar-ctrl-card-desc">Paste any public file to type it</span>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="toolbar-ctrl-card">
      <div class="toolbar-ctrl-card-top">
        <UiIconButton :is-active="settingsOpen" title="Settings" @click="$emit('toggleSettings')">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
          </svg>
        </UiIconButton>
        <div class="toolbar-ctrl-card-text">
          <span class="toolbar-ctrl-card-label">Settings</span>
          <span class="toolbar-ctrl-card-desc">Font, theme &amp; color options</span>
        </div>
      </div>
    </div>

    <!-- Pause — only visible when session is active -->
    <div v-if="canPause" class="toolbar-ctrl-card">
      <div class="toolbar-ctrl-card-top">
        <UiIconButton
          :is-active="isPaused"
          :title="isPaused ? 'Resume (Space)' : 'Pause (Space)'"
          :class="{ 'pause-btn--paused': isPaused }"
          @click="$emit('togglePause')"
        >
          <svg
            v-if="!isPaused"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </UiIconButton>
        <div class="toolbar-ctrl-card-text">
          <span class="toolbar-ctrl-card-label">{{ isPaused ? 'Resume' : 'Pause' }}</span>
          <span class="toolbar-ctrl-card-desc">Press Space to toggle</span>
        </div>
      </div>
    </div>

    <!-- Reset — always last -->
    <UiBaseButton variant="dim" :small="true" class="toolbar-reset-btn" @click="$emit('reset')">
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
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
      Reset
    </UiBaseButton>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    urlOpen: boolean
    settingsOpen: boolean
    canPause: boolean
    isPaused: boolean
  }>()

  defineEmits<{
    toggleUrl: []
    toggleSettings: []
    togglePause: []
    reset: []
  }>()
</script>
