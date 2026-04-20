<template>
  <div :class="['header-stats', { visible }]" role="status" aria-live="polite">
    <StatsStatBlock
      :value="wpm"
      label="WPM"
      :show-bar="true"
      :bar-percent="Math.min(wpm / 1.5, 100)"
      bar-color="accent"
    />
    <div class="stat-divider" />
    <StatsStatBlock
      :value="accuracy"
      label="ACCURACY"
      unit="%"
      :show-bar="true"
      :bar-percent="accuracy"
      bar-color="green"
    />
    <div class="stat-divider" />
    <StatsStatBlock :value="elapsed" label="ELAPSED" />
    <div class="stat-divider" />
    <StatsStatBlock
      :value="progress"
      label="PROGRESS"
      unit="%"
      :show-bar="true"
      :bar-percent="progress"
      bar-color="purple"
    />
  </div>
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
