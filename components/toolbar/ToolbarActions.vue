<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div class="toolbar-actions">
    <!-- GitHub URL -->
    <button
      class="toolbar-btn"
      :class="{ 'toolbar-btn--active': urlOpen }"
      title="Load from GitHub URL"
      @click="$emit('toggleUrl')"
    >
      <span class="toolbar-btn-icon">
        <Icon name="ph:link-bold" size="18" />
      </span>
      <span class="toolbar-btn-text">
        <span class="toolbar-btn-label">GitHub URL</span>
        <span class="toolbar-btn-desc">Paste any public file to type it</span>
      </span>
    </button>

    <!-- Pause — only visible when session is active -->
    <button
      v-if="canPause"
      class="toolbar-btn"
      :class="{ 'toolbar-btn--active': isPaused }"
      :title="isPaused ? 'Resume (Space)' : 'Pause (Space)'"
      @click="$emit('togglePause')"
    >
      <span class="toolbar-btn-icon">
        <Icon :name="isPaused ? 'ph:play-bold' : 'ph:pause-bold'" size="18" />
      </span>
      <span class="toolbar-btn-text">
        <span class="toolbar-btn-label">{{ isPaused ? 'Resume' : 'Pause' }}</span>
        <span class="toolbar-btn-desc">Press Space to toggle</span>
      </span>
    </button>

    <!-- Reset — always last -->
    <button class="toolbar-btn toolbar-btn--reset" title="Reset session" @click="$emit('reset')">
      <span class="toolbar-btn-icon">
        <Icon name="ph:arrow-counter-clockwise-bold" size="16" />
      </span>
      <span class="toolbar-btn-text">
        <span class="toolbar-btn-label">Reset</span>
        <span class="toolbar-btn-desc">Start over from scratch</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    urlOpen: boolean
    canPause: boolean
    isPaused: boolean
  }>()

  defineEmits<{
    toggleUrl: []
    togglePause: []
    reset: []
  }>()
</script>
