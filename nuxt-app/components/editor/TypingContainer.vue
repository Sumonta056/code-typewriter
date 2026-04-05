<template>
  <div :class="['typing-container', { 'typing-active': typingActive, 'smooth-caret': smoothCaret }]">
    <EditorTypingPlaceholder v-if="!hasCode" />
    <EditorCodeDisplay
      v-else
      ref="codeDisplayRef"
      :code="code"
      :char-states="charStates"
      :tokens="tokens"
      :current-index="currentIndex"
      :show-line-numbers="showLineNumbers"
    />
  </div>
</template>

<script setup lang="ts">
import type { CharState, TokenType } from '~/types'

defineProps<{
  hasCode: boolean
  code: string
  charStates: CharState[]
  tokens: TokenType[]
  currentIndex: number
  showLineNumbers: boolean
  smoothCaret: boolean
  typingActive: boolean
}>()

const codeDisplayRef = ref<InstanceType<any> | null>(null)

defineExpose({ codeDisplayRef })
</script>

<style scoped>
.typing-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.typing-active :deep(.char.current::before) {
  animation: none;
  opacity: 1;
}

.smooth-caret :deep(.char.current::before) {
  transition: left 50ms var(--ease), top 50ms var(--ease);
}
</style>
