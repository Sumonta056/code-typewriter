<template>
  <div ref="containerEl" class="code-display">
    <EditorLineNumbers :line-count="lineCount" :visible="showLineNumbers" />
    <pre class="code-area"><span
      v-for="(ch, i) in chars"
      :key="i"
      ref="charEls"
      v-memo="[charStates[i], tokens[i], i === currentIndex]"
      :class="charClass(charStates[i], i === currentIndex)"
      :style="tokens[i] ? { color: tokens[i] } : undefined"
    >{{ ch }}</span></pre>
  </div>
</template>

<script setup lang="ts">
  import type { CharState, TokenType } from '~/types'

  const props = defineProps<{
    code: string
    charStates: CharState[]
    tokens: TokenType[]
    currentIndex: number
    showLineNumbers: boolean
  }>()

  const containerEl = ref<HTMLElement | null>(null)
  const charEls = ref<HTMLElement[]>([])

  const chars = computed(() => props.code.split(''))
  const lineCount = computed(() => props.code.split('\n').length)

  function charClass(state: CharState | undefined, isCurrent: boolean): string {
    let cls = `char ${state || 'pending'}`
    if (isCurrent) cls += ' current'
    return cls
  }

  defineExpose({ containerEl, charEls })
</script>
