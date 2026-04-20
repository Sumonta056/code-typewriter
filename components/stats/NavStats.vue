<template>
  <Transition name="nav-stats">
    <div v-if="isVisible" class="nav-stats" role="status" aria-live="polite">
      <!-- WPM -->
      <div class="nav-stat nav-stat--wpm">
        <span class="nav-stat-icon">⚡</span>
        <div class="nav-stat-body">
          <Transition name="nval" mode="out-in">
            <span :key="stats.wpm" class="nav-stat-val">{{ stats.wpm }}</span>
          </Transition>
          <span class="nav-stat-lbl">WPM</span>
        </div>
      </div>

      <span class="nav-stat-sep" aria-hidden="true" />

      <!-- ACCURACY -->
      <div class="nav-stat nav-stat--acc">
        <span class="nav-stat-icon">◎</span>
        <div class="nav-stat-body">
          <Transition name="nval" mode="out-in">
            <span :key="stats.accuracy" class="nav-stat-val"
              >{{ stats.accuracy }}<span class="nav-stat-unit">%</span></span
            >
          </Transition>
          <span class="nav-stat-lbl">ACC</span>
        </div>
      </div>

      <span class="nav-stat-sep" aria-hidden="true" />

      <!-- TIME -->
      <div class="nav-stat nav-stat--time">
        <span class="nav-stat-icon">◷</span>
        <div class="nav-stat-body">
          <span class="nav-stat-val">{{ stats.elapsed }}</span>
          <span class="nav-stat-lbl">TIME</span>
        </div>
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
