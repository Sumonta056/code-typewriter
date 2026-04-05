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

<style scoped>
  .results-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-lit);
    border-radius: 16px;
    padding: 36px 44px 32px;
    max-width: 520px;
    width: 92%;
    position: relative;
    overflow: hidden;
  }
  .results-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--purple), var(--green));
  }
  .results-badge {
    display: inline-block;
    font-family: var(--font-code);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: var(--green);
    background: rgba(var(--green-rgb), 0.1);
    border: 1px solid rgba(var(--green-rgb), 0.2);
    padding: 4px 12px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .pb-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-code);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--yellow);
    background: rgba(210, 153, 34, 0.12);
    border: 1px solid rgba(210, 153, 34, 0.3);
    padding: 5px 14px;
    border-radius: 6px;
    margin-bottom: 14px;
    animation: pbPulse 1.5s ease-in-out 3;
  }
  .pb-star {
    font-size: 0.85rem;
  }

  .results-header {
    margin-bottom: 24px;
  }
  .results-header h2 {
    font-family: var(--font-ui);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
  }
  .results-file {
    font-family: var(--font-code);
    font-size: 0.72rem;
    color: var(--text-faint);
  }
  .results-hero {
    text-align: center;
    padding: 24px 0;
    margin-bottom: 20px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .hero-wpm {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
  }
  .hero-value {
    font-family: var(--font-code);
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
    text-shadow: 0 0 40px rgba(var(--accent-rgb), 0.3);
    animation: countUp 0.5s ease;
  }
  .hero-unit {
    font-family: var(--font-code);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dim);
    letter-spacing: 0.08em;
  }
  .results-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 28px;
  }
  .results-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  .results-actions :deep(.btn) {
    padding: 10px 28px;
  }

  @media (max-width: 768px) {
    .results-card {
      padding: 24px 20px;
    }
    .hero-value {
      font-size: 2.5rem;
    }
    .results-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .results-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
