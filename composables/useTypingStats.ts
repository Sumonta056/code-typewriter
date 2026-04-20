import { onScopeDispose } from 'vue'
import { useTypingStore } from '~/stores/typing'
import { useLiveStatsStore } from '~/stores/liveStats'
import {
  ACCURACY_SAMPLE_INTERVAL_S,
  MAX_ACCURACY_SAMPLES,
  STATS_UPDATE_INTERVAL_MS,
} from '~/utils/constants'

export function useTypingStats() {
  const store = useTypingStore()
  const liveStats = useLiveStatsStore()

  const wpm = ref(0)
  const rawWpm = ref(0)
  const cpm = ref(0)
  const accuracy = ref(100)
  const elapsedFormatted = ref('0:00')
  const elapsedSeconds = ref(0)
  const progress = ref(0)

  // Accuracy history for live sparkline — array of [elapsed, accuracy]
  const accuracyHistory = ref<{ t: number; v: number }[]>([])

  let intervalId: ReturnType<typeof setInterval> | null = null

  function getEffectiveElapsed(): number {
    if (!store.startTime) return 0
    const pausedNow = store.isPaused && store.pausedAt ? Date.now() - store.pausedAt : 0
    return (Date.now() - store.startTime - store.totalPausedMs - pausedNow) / 1000
  }

  function update() {
    if (!store.startTime || store.isComplete || store.isPaused) return

    const elapsed = getEffectiveElapsed()
    const minutes = elapsed / 60

    wpm.value = minutes > 0 ? Math.round(store.currentIndex / 5 / minutes) : 0
    rawWpm.value = minutes > 0 ? Math.round(store.totalKeystrokes / 5 / minutes) : 0
    cpm.value = minutes > 0 ? Math.round(store.currentIndex / minutes) : 0
    accuracy.value =
      store.totalKeystrokes > 0
        ? Math.round(((store.totalKeystrokes - store.totalErrors) / store.totalKeystrokes) * 100)
        : 100
    progress.value =
      store.charCount > 0 ? Math.round((store.currentIndex / store.charCount) * 100) : 0
    elapsedSeconds.value = elapsed

    const mins = Math.floor(elapsed / 60)
    const secs = Math.floor(elapsed % 60)
    elapsedFormatted.value = `${mins}:${secs.toString().padStart(2, '0')}`
    liveStats.set(wpm.value, accuracy.value, elapsedFormatted.value, progress.value)

    if (elapsed > 0 && accuracyHistory.value.length < MAX_ACCURACY_SAMPLES) {
      const last = accuracyHistory.value[accuracyHistory.value.length - 1]
      if (!last || elapsed - last.t >= ACCURACY_SAMPLE_INTERVAL_S) {
        accuracyHistory.value.push({ t: Math.round(elapsed), v: accuracy.value })
      }
    }
  }

  function startTimer() {
    stopTimer()
    intervalId = setInterval(update, STATS_UPDATE_INTERVAL_MS)
  }

  function stopTimer() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function computeFinalStats() {
    if (!store.startTime) return
    const elapsed = getEffectiveElapsed()
    const minutes = elapsed / 60
    wpm.value = minutes > 0 ? Math.round(store.charCount / 5 / minutes) : 0
    rawWpm.value = minutes > 0 ? Math.round(store.totalKeystrokes / 5 / minutes) : 0
    cpm.value = minutes > 0 ? Math.round(store.charCount / minutes) : 0
    accuracy.value =
      store.totalKeystrokes > 0
        ? Math.round(((store.totalKeystrokes - store.totalErrors) / store.totalKeystrokes) * 100)
        : 100
    progress.value = 100
    elapsedSeconds.value = elapsed

    const mins = Math.floor(elapsed / 60)
    const secs = Math.floor(elapsed % 60)
    elapsedFormatted.value = `${mins}:${secs.toString().padStart(2, '0')}`
    liveStats.set(wpm.value, accuracy.value, elapsedFormatted.value, progress.value)
  }

  function resetStats() {
    wpm.value = 0
    rawWpm.value = 0
    cpm.value = 0
    accuracy.value = 100
    elapsedFormatted.value = '0:00'
    elapsedSeconds.value = 0
    progress.value = 0
    accuracyHistory.value = []
    liveStats.reset()
  }

  onScopeDispose(() => {
    stopTimer()
  })

  return {
    wpm,
    rawWpm,
    cpm,
    accuracy,
    elapsedFormatted,
    elapsedSeconds,
    progress,
    accuracyHistory,
    startTimer,
    stopTimer,
    computeFinalStats,
    resetStats,
  }
}
