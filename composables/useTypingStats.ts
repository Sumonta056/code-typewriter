import { onScopeDispose } from 'vue'
import { useTypingStore } from '~/stores/typing'

export function useTypingStats() {
  const store = useTypingStore()

  const wpm = ref(0)
  const rawWpm = ref(0)
  const cpm = ref(0)
  const accuracy = ref(100)
  const elapsedFormatted = ref('0:00')
  const elapsedSeconds = ref(0)
  const progress = ref(0)

  let intervalId: ReturnType<typeof setInterval> | null = null

  function update() {
    if (!store.startTime || store.isComplete) return

    const elapsed = (Date.now() - store.startTime) / 1000
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
  }

  function startTimer() {
    stopTimer()
    intervalId = setInterval(update, 200)
  }

  function stopTimer() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function computeFinalStats() {
    if (!store.startTime) return
    const elapsed = (Date.now() - store.startTime) / 1000
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
  }

  function resetStats() {
    wpm.value = 0
    rawWpm.value = 0
    cpm.value = 0
    accuracy.value = 100
    elapsedFormatted.value = '0:00'
    elapsedSeconds.value = 0
    progress.value = 0
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
    startTimer,
    stopTimer,
    computeFinalStats,
    resetStats,
  }
}
