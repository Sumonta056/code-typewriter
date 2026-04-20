<template>
  <Transition name="nav-stats">
    <div v-if="isVisible" class="nav-stats" role="status" aria-live="polite">
      <!-- WPM -->
      <div class="nav-stat nav-stat--wpm">
        <span class="nav-stat-lbl">WPM</span>
        <span class="nav-stat-val">{{ stats.wpm }}</span>
      </div>

      <span class="nav-stat-sep" aria-hidden="true" />

      <!-- ACCURACY -->
      <div class="nav-stat nav-stat--acc">
        <span class="nav-stat-lbl">ACC</span>
        <span class="nav-stat-val">{{ stats.accuracy }}<span class="nav-stat-unit">%</span></span>
      </div>

      <span class="nav-stat-sep" aria-hidden="true" />

      <!-- TIME -->
      <div class="nav-stat nav-stat--time">
        <span class="nav-stat-lbl">TIME</span>
        <span class="nav-stat-val">{{ stats.elapsed }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { useLiveStatsStore } from '~/stores/liveStats'
  import { useTypingStore } from '~/stores/typing'
  const stats = useLiveStatsStore()
  const typing = useTypingStore()
  const isVisible = computed(() => typing.isActive || typing.isComplete)
</script>
