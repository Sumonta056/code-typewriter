<template>
  <div class="stat-bar">
    <div :class="['stat-bar-fill', barClass]" :style="{ width: percent + '%' }" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      percent: number
      color?: 'accent' | 'green' | 'purple'
    }>(),
    {
      color: 'accent',
    },
  )

  const barClass = computed(() => {
    if (props.color === 'green') return 'accent-green'
    if (props.color === 'purple') return 'accent-purple'
    return ''
  })
</script>

<style scoped>
  .stat-bar {
    width: 100%;
    height: 3px;
    background: var(--bg-surface);
    border-radius: 2px;
    margin-top: 6px;
    overflow: hidden;
  }
  .stat-bar-fill {
    height: 100%;
    width: 0%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.3s var(--ease);
  }
  .stat-bar-fill.accent-green {
    background: var(--green);
  }
  .stat-bar-fill.accent-purple {
    background: var(--purple);
  }
</style>
