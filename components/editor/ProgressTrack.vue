<template>
  <div
    :class="['progress-track', { visible }]"
    role="progressbar"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="progress-fill" :style="{ transform: `scaleX(${percent / 100})` }" />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    percent: number
    visible: boolean
  }>()
</script>

<style scoped>
  .progress-track {
    height: 3px;
    background: var(--bg-surface);
    border-radius: 0 0 var(--radius) var(--radius);
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.3s var(--ease);
  }
  .progress-track.visible {
    opacity: 1;
  }
  .progress-fill {
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, var(--accent), var(--purple));
    border-radius: 2px;
    transform-origin: left center;
    transform: scaleX(0);
    will-change: transform;
    transition: transform 0.15s var(--ease);
  }
</style>
