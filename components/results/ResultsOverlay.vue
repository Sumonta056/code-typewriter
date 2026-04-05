<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        ref="overlayRef"
        class="results-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Session results"
        tabindex="-1"
        @keydown="onKeyDown"
      >
        <Transition name="scale-fade">
          <ResultsCard
            v-if="visible"
            :wpm="wpm"
            :raw-wpm="rawWpm"
            :cpm="cpm"
            :accuracy="accuracy"
            :time="time"
            :chars="chars"
            :errors="errors"
            :file-name="fileName"
            @retry="$emit('retry')"
            @new-file="$emit('newFile')"
          />
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  const props = defineProps<{
    visible: boolean
    wpm: number
    rawWpm: number
    cpm: number
    accuracy: number
    time: string
    chars: number
    errors: number
    fileName: string
  }>()

  const emit = defineEmits<{
    retry: []
    newFile: []
  }>()

  const overlayRef = ref<HTMLElement | null>(null)

  watch(
    () => props.visible,
    (v) => {
      if (v) {
        nextTick(() => {
          const firstBtn = overlayRef.value?.querySelector<HTMLElement>('button')
          firstBtn?.focus()
        })
      }
    },
  )

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      emit('retry')
      return
    }

    // Trap Tab focus within the overlay
    if (e.key === 'Tab') {
      const focusable = overlayRef.value?.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }
</script>

<style scoped>
  .results-overlay {
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    outline: none;
  }
</style>
