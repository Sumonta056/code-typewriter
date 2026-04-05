<template>
  <div class="stat-block">
    <div class="stat-value">
      {{ value }}<span v-if="unit" class="stat-unit">{{ unit }}</span>
    </div>
    <div class="stat-label">{{ label }}</div>
    <div v-if="showBar" class="stat-bar">
      <div :class="['stat-bar-fill', barColorClass]" :style="{ width: barPercent + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: string | number
  label: string
  unit?: string
  showBar?: boolean
  barPercent?: number
  barColor?: 'accent' | 'green' | 'purple'
}>(), {
  showBar: false,
  barPercent: 0,
  barColor: 'accent',
})

const barColorClass = computed(() => {
  if (props.barColor === 'green') return 'accent-green'
  if (props.barColor === 'purple') return 'accent-purple'
  return ''
})
</script>

<style scoped>
.stat-block { text-align: center; min-width: 60px; }
.stat-value {
  font-family: var(--font-code);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.stat-unit {
  font-size: 0.7em;
  color: var(--text-dim);
}
.stat-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-faint);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 4px;
}
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
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.3s var(--ease);
}
.stat-bar-fill.accent-green  { background: var(--green); }
.stat-bar-fill.accent-purple { background: var(--purple); }
</style>
