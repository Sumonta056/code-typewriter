<template>
  <div class="file-tab-bar">
    <div class="file-tab active">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
      <span>{{ fileName }}</span>
      <span v-if="progress" class="file-tab-badge">{{ progress }}</span>
    </div>
    <div class="file-tab-filler" />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    fileName: string
    progress?: string
  }>()
</script>
