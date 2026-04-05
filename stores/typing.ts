import { defineStore } from 'pinia'
import { triggerRef } from 'vue'
import type { CharState, TokenType } from '~/types'

export const useTypingStore = defineStore('typing', () => {
  const code = ref('')
  const fileName = ref('')
  const fileUrl = ref('')
  const tokens = shallowRef<TokenType[]>([])
  const charStates = shallowRef<CharState[]>([])
  const currentIndex = ref(0)
  const totalErrors = ref(0)
  const totalKeystrokes = ref(0)
  const startTime = ref<number | null>(null)
  const isComplete = ref(false)
  const isActive = ref(false)

  const progressPercent = computed(() =>
    code.value.length > 0 ? Math.round((currentIndex.value / code.value.length) * 100) : 0,
  )

  const charCount = computed(() => code.value.length)
  const isSessionReady = computed(() => code.value.length > 0 && !isComplete.value)

  function setupSession(newCode: string, newTokens: TokenType[], name: string, url: string) {
    code.value = newCode
    tokens.value = newTokens
    charStates.value = new Array(newCode.length).fill('pending')
    fileName.value = name
    fileUrl.value = url
    currentIndex.value = 0
    totalErrors.value = 0
    totalKeystrokes.value = 0
    startTime.value = null
    isComplete.value = false
    isActive.value = true
  }

  function advanceCorrect() {
    if (currentIndex.value >= code.value.length) return
    charStates.value[currentIndex.value] = 'correct'
    triggerRef(charStates)
    totalKeystrokes.value++
    currentIndex.value++
  }

  function advanceIncorrect() {
    if (currentIndex.value >= code.value.length) return
    charStates.value[currentIndex.value] = 'incorrect'
    triggerRef(charStates)
    totalErrors.value++
    totalKeystrokes.value++
    currentIndex.value++
  }

  function goBack() {
    if (currentIndex.value <= 0) return
    if (charStates.value[currentIndex.value - 1] === 'incorrect') {
      totalErrors.value = Math.max(0, totalErrors.value - 1)
    }
    currentIndex.value--
    charStates.value[currentIndex.value] = 'pending'
    triggerRef(charStates)
  }

  function markComplete() {
    isComplete.value = true
    isActive.value = false
  }

  function reset() {
    if (code.value.length === 0) return
    charStates.value = new Array(code.value.length).fill('pending')
    currentIndex.value = 0
    totalErrors.value = 0
    totalKeystrokes.value = 0
    startTime.value = null
    isComplete.value = false
    isActive.value = true
  }

  function startTimer() {
    if (!startTime.value) {
      startTime.value = Date.now()
    }
  }

  return {
    code, fileName, fileUrl, tokens, charStates,
    currentIndex, totalErrors, totalKeystrokes, startTime,
    isComplete, isActive,
    progressPercent, charCount, isSessionReady,
    setupSession, advanceCorrect, advanceIncorrect, goBack,
    markComplete, reset, startTimer,
  }
})
