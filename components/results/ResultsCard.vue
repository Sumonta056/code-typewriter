<template>
  <div class="results-card">
    <div class="results-badge">COMPLETED</div>
    <div v-if="isNewPB" class="pb-badge"><span class="pb-star">★</span> New Personal Best!</div>
    <div class="results-header">
      <h2>Session Report</h2>
      <p class="results-file">
        {{ fileName }}
      </p>
    </div>
    <div class="results-hero">
      <div class="hero-wpm">
        <span :key="'wpm-' + animatedWpm" class="hero-value">{{ animatedWpm }}</span>
        <span class="hero-unit">WPM</span>
      </div>
    </div>
    <div class="results-grid">
      <ResultsResultItem icon="⏱" :value="time" label="Time" />
      <ResultsResultItem icon="⚪" :value="animatedAccuracy + '%'" label="Accuracy" />
      <ResultsResultItem icon="✏" :value="animatedChars" label="Characters" />
      <ResultsResultItem icon="❌" :value="animatedErrors" label="Errors" />
      <ResultsResultItem icon="⚡" :value="animatedCpm" label="CPM" />
      <ResultsResultItem icon="📈" :value="animatedRawWpm" label="Raw WPM" />
    </div>
    <div class="results-actions">
      <UiBaseButton variant="glow" @click="$emit('retry')"> Retry Same </UiBaseButton>
      <UiBaseButton variant="dim" @click="$emit('newFile')"> New File </UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    wpm: number
    rawWpm: number
    cpm: number
    accuracy: number
    time: string
    chars: number
    errors: number
    fileName: string
    isNewPB?: boolean
  }>()

  defineEmits<{
    retry: []
    newFile: []
  }>()

  // Animated counters
  const animatedWpm = ref(0)
  const animatedRawWpm = ref(0)
  const animatedCpm = ref(0)
  const animatedAccuracy = ref(0)
  const animatedChars = ref(0)
  const animatedErrors = ref(0)

  function animateValue(setter: (v: number) => void, target: number, duration = 900, delay = 0) {
    setTimeout(() => {
      const start = performance.now()
      function tick(now: number) {
        const t = Math.min((now - start) / duration, 1)
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3)
        setter(Math.round(eased * target))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
  }

  onMounted(() => {
    animateValue(
      (v) => {
        animatedWpm.value = v
      },
      props.wpm,
      1000,
      100,
    )
    animateValue(
      (v) => {
        animatedRawWpm.value = v
      },
      props.rawWpm,
      900,
      200,
    )
    animateValue(
      (v) => {
        animatedCpm.value = v
      },
      props.cpm,
      900,
      250,
    )
    animateValue(
      (v) => {
        animatedAccuracy.value = v
      },
      props.accuracy,
      800,
      300,
    )
    animateValue(
      (v) => {
        animatedChars.value = v
      },
      props.chars,
      700,
      150,
    )
    animateValue(
      (v) => {
        animatedErrors.value = v
      },
      props.errors,
      600,
      350,
    )
  })
</script>
