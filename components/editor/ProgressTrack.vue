<template>
  <div
    :class="[
      'progress-track h-[3px] bg-bg-surface rounded-b-base overflow-hidden transition-opacity duration-300',
      visible ? 'opacity-100' : 'opacity-0',
    ]"
    role="progressbar"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="progress-fill h-full w-full bg-gradient-to-r from-c-accent to-c-purple rounded-[2px] origin-left [will-change:transform] transition-transform duration-150"
      :style="{ transform: `scaleX(${percent / 100})` }"
    />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    percent: number
    visible: boolean
  }>()
</script>
