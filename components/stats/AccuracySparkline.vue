<template>
  <div v-if="visible && history.length > 1" class="sparkline-wrap">
    <div class="sparkline-label">Accuracy</div>
    <svg class="sparkline" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" aria-hidden="true">
      <!-- Reference lines at 100% and 80% -->
      <line
        :x1="0"
        :y1="yFor(100)"
        :x2="W"
        :y2="yFor(100)"
        stroke="var(--border)"
        stroke-width="0.5"
      />
      <line
        :x1="0"
        :y1="yFor(80)"
        :x2="W"
        :y2="yFor(80)"
        stroke="var(--border)"
        stroke-width="0.5"
        stroke-dasharray="2 2"
      />
      <!-- Area fill -->
      <path :d="areaPath" class="spark-area" />
      <!-- Line -->
      <polyline :points="linePoints" class="spark-line" />
    </svg>
    <div class="sparkline-val">{{ latestVal }}%</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    visible: boolean
    history: { t: number; v: number }[]
  }>()

  const W = 80
  const H = 32

  const MIN_ACC = 60
  const MAX_ACC = 100

  function yFor(val: number): number {
    const clamped = Math.max(MIN_ACC, Math.min(MAX_ACC, val))
    return H - ((clamped - MIN_ACC) / (MAX_ACC - MIN_ACC)) * H
  }

  const linePoints = computed(() => {
    const pts = props.history
    if (pts.length < 2) return ''
    return pts
      .map((p, i) => {
        const x = (i / (pts.length - 1)) * W
        const y = yFor(p.v)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(' ')
  })

  const areaPath = computed(() => {
    const pts = props.history
    if (pts.length < 2) return ''
    const coords = pts.map((p, i) => {
      const x = (i / (pts.length - 1)) * W
      const y = yFor(p.v)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    return `M0,${H} L${coords.join(' L')} L${W},${H} Z`
  })

  const latestVal = computed(() => {
    if (props.history.length === 0) return 100
    return props.history[props.history.length - 1].v
  })
</script>
