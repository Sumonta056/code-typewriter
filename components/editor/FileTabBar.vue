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
    <div class="file-tab-filler">
      <Transition name="stats-fade">
        <div v-if="statsVisible" class="tab-stats">
          <span class="tab-stat tab-stat--wpm">
            <span class="tab-stat-icon">⚡</span>
            <span class="tab-stat-value">{{ wpm }}</span>
            <span class="tab-stat-label">wpm</span>
          </span>
          <span class="tab-stat tab-stat--acc">
            <span class="tab-stat-icon">◎</span>
            <span class="tab-stat-value">{{ accuracy }}%</span>
            <span class="tab-stat-label">acc</span>
          </span>
          <span class="tab-stat tab-stat--time">
            <span class="tab-stat-icon">◷</span>
            <span class="tab-stat-value">{{ elapsed }}</span>
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    fileName: string
    progress?: string
    statsVisible?: boolean
    wpm?: number
    accuracy?: number
    elapsed?: string
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
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 12px;
  }
  .tab-stats {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .tab-stat {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 6px;
    background: var(--bg-raised);
    border: 1px solid var(--border-lit);
  }
  .tab-stat-icon {
    font-size: 0.65rem;
    line-height: 1;
    opacity: 0.75;
  }
  .tab-stat-value {
    font-family: var(--font-code);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1;
  }
  .tab-stat-label {
    font-family: var(--font-code);
    font-size: 0.6rem;
    color: var(--text-faint);
    text-transform: lowercase;
    line-height: 1;
  }
  .tab-stat--wpm .tab-stat-value {
    color: var(--accent);
  }
  .tab-stat--acc .tab-stat-value {
    color: var(--green);
  }
  .tab-stat--time .tab-stat-value {
    color: var(--purple);
  }

  /* Transition */
  .stats-fade-enter-active,
  .stats-fade-leave-active {
    transition:
      opacity 0.35s var(--ease),
      transform 0.35s var(--ease);
  }
  .stats-fade-enter-from,
  .stats-fade-leave-to {
    opacity: 0;
    transform: translateX(8px);
  }
</style>
