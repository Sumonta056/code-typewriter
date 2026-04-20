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
