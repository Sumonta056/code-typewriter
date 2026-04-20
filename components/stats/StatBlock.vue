<template>
  <div class="stat-block">
    <div class="stat-value">
      {{ value }}<span v-if="unit" class="stat-unit">{{ unit }}</span>
    </div>
    <div class="stat-label">
      {{ label }}
    </div>
    <div v-if="showBar" class="stat-bar">
      <div :class="['stat-bar-fill', barColorClass]" :style="{ width: barPercent + '%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      value: string | number
      label: string
      unit?: string
      showBar?: boolean
      barPercent?: number
      barColor?: 'accent' | 'green' | 'purple'
    }>(),
    {
      unit: undefined,
      showBar: false,
      barPercent: 0,
      barColor: 'accent',
    },
  )

  const barColorClass = computed(() => {
    if (props.barColor === 'green') return 'accent-green'
    if (props.barColor === 'purple') return 'accent-purple'
    return ''
  })
</script>
