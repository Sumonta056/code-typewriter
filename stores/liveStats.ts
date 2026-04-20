import { defineStore } from 'pinia'

/**
 * Thin data bucket — written by useTypingStats on every 200 ms tick.
 * Read by any component that needs live stats (e.g. the navbar).
 * No computation lives here; all math stays in useTypingStats.
 */
export const useLiveStatsStore = defineStore('liveStats', () => {
  const wpm = ref(0)
  const accuracy = ref(100)
  const elapsed = ref('0:00')
  const progress = ref(0)

  function set(newWpm: number, newAccuracy: number, newElapsed: string, newProgress: number) {
    wpm.value = newWpm
    accuracy.value = newAccuracy
    elapsed.value = newElapsed
    progress.value = newProgress
  }

  function reset() {
    wpm.value = 0
    accuracy.value = 100
    elapsed.value = '0:00'
    progress.value = 0
  }

  return { wpm, accuracy, elapsed, progress, set, reset }
})
