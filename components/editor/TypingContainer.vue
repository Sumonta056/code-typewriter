<template>
  <div
    :class="[
      'flex-1 overflow-hidden relative min-h-0',
      { 'typing-active': typingActive, 'smooth-caret': smoothCaret },
    ]"
  >
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
  import type CodeDisplay from '~/components/editor/CodeDisplay.vue'
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

  const codeDisplayRef = ref<InstanceType<typeof CodeDisplay> | null>(null)

  defineExpose({ codeDisplayRef })
</script>
