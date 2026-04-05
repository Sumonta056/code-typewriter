<template>
  <header class="header">
    <AppLogo />
    <StatsLiveStats
      :visible="visible"
      :wpm="wpm"
      :accuracy="accuracy"
      :elapsed="elapsed"
      :progress="progress"
    />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  wpm: number
  accuracy: number
  elapsed: string
  progress: number
}>()
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
