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

<style scoped>
  .file-tab-bar {
    display: flex;
    align-items: stretch;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-bottom: none;
    border-radius: var(--radius) var(--radius) 0 0;
    overflow-x: auto;
  }
  .file-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    font-family: var(--font-code);
    font-size: 0.75rem;
    color: var(--text-dim);
    border-right: 1px solid var(--border);
    white-space: nowrap;
    cursor: default;
    transition: all 0.2s var(--ease);
  }
  .file-tab.active {
    color: var(--text);
    background: var(--bg-main);
    border-bottom: 2px solid var(--accent);
    margin-bottom: -1px;
  }
  .file-tab svg {
    opacity: 0.5;
  }
  .file-tab-badge {
    font-size: 0.65rem;
    color: var(--text-faint);
    background: var(--bg-raised);
    padding: 1px 8px;
    border-radius: 10px;
  }
  .file-tab-filler {
    flex: 1;
    border-bottom: 1px solid var(--border);
  }
</style>
