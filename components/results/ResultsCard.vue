<template>
  <div
    class="results-card bg-bg-surface border border-c-border-lit rounded-[16px] px-[44px] py-[36px] pb-[32px] max-w-[520px] w-[92%] relative overflow-hidden max-[768px]:px-[20px] max-[768px]:py-[24px]"
  >
    <div
      class="inline-block font-code text-[0.6rem] font-bold tracking-[0.15em] text-c-green bg-[rgba(var(--green-rgb),0.1)] border border-[rgba(var(--green-rgb),0.2)] px-[12px] py-[4px] rounded-[4px] mb-[8px]"
    >
      COMPLETED
    </div>
    <div
      v-if="isNewPB"
      class="pb-badge inline-flex items-center gap-[6px] font-code text-[0.72rem] font-bold tracking-[0.05em] text-c-yellow bg-[rgba(210,153,34,0.12)] border border-[rgba(210,153,34,0.3)] px-[14px] py-[5px] rounded-[6px] mb-[14px]"
    >
      <span class="text-[0.85rem]">★</span> New Personal Best!
    </div>
    <div class="mb-[24px]">
      <h2 class="font-ui text-[1.4rem] font-bold text-c-text mb-[6px]">Session Report</h2>
      <p class="font-code text-[0.72rem] text-c-text-faint">{{ fileName }}</p>
    </div>
    <div
      class="text-center py-[24px] mb-[20px] border-t border-c-border border-b border-b-c-border"
    >
      <div class="flex items-baseline justify-center gap-[8px]">
        <span
          :key="'wpm-' + animatedWpm"
          class="font-code text-[3.5rem] font-bold text-c-accent leading-none [text-shadow:0_0_40px_rgba(var(--accent-rgb),0.3)] [animation:countUp_0.5s_ease] max-[768px]:text-[2.5rem]"
          >{{ animatedWpm }}</span
        >
        <span class="font-code text-[1rem] font-semibold text-c-text-dim tracking-[0.08em]"
          >WPM</span
        >
      </div>
    </div>
    <div class="grid grid-cols-3 gap-[10px] mb-[28px] max-[480px]:grid-cols-2">
      <ResultsResultItem icon="⏱" :value="time" label="Time" />
      <ResultsResultItem icon="⚪" :value="animatedAccuracy + '%'" label="Accuracy" />
      <ResultsResultItem icon="✏" :value="animatedChars" label="Characters" />
      <ResultsResultItem icon="❌" :value="animatedErrors" label="Errors" />
      <ResultsResultItem icon="⚡" :value="animatedCpm" label="CPM" />
      <ResultsResultItem icon="📈" :value="animatedRawWpm" label="Raw WPM" />
    </div>
    <div class="flex gap-[10px] justify-center">
      <UiBaseButton variant="glow" class="!px-[28px] !py-[10px]" @click="$emit('retry')">
        Retry Same
      </UiBaseButton>
      <UiBaseButton variant="dim" class="!px-[28px] !py-[10px]" @click="$emit('newFile')">
        New File
      </UiBaseButton>
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
