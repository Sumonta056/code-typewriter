<template>
  <div class="flex items-center gap-2">
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

    <!-- Pause button — only visible when session is active -->
    <UiIconButton
      v-if="canPause"
      :is-active="isPaused"
      :title="isPaused ? 'Resume (Space)' : 'Pause (Space)'"
      :class="{ 'pause-btn--paused': isPaused }"
      @click="$emit('togglePause')"
    >
      <!-- Pause icon -->
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
      <!-- Play icon -->
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    </UiIconButton>

    <div class="w-px h-6 bg-c-border mx-1" />
    <UiBaseButton variant="glow" @click="$emit('random')">
      <svg
        width="16"
        height="16"
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
      Random File
    </UiBaseButton>
    <UiBaseButton variant="dim" @click="$emit('reset')">
      <svg
        width="16"
        height="16"
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
    random: []
    reset: []
  }>()
</script>
