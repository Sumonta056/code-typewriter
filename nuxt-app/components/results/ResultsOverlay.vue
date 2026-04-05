<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="results-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Session results"
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
defineProps<{
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

defineEmits<{
  retry: []
  newFile: []
}>()
</script>

<style scoped>
.results-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 8, 15, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
</style>
