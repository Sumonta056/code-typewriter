<template>
  <div ref="containerEl" class="code-display">
    <EditorLineNumbers :line-count="lineCount" :visible="showLineNumbers" />
    <pre class="code-area"><span
      v-for="(ch, i) in chars"
      :key="i"
      ref="charEls"
      v-memo="[charStates[i], tokens[i], i === currentIndex]"
      :class="charClass(charStates[i], tokens[i], i === currentIndex)"
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

  function charClass(
    state: CharState | undefined,
    token: TokenType | undefined,
    isCurrent: boolean,
  ): string {
    let cls = `char ${state || 'pending'} syn-${token || 'plain'}`
    if (isCurrent) cls += ' current'
    return cls
  }

  defineExpose({ containerEl, charEls })
</script>

<style scoped>
  .code-display {
    display: flex;
    height: 100%;
    overflow: auto;
    padding: 14px 0;
    will-change: scroll-position;
  }

  .code-display::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .code-display::-webkit-scrollbar-track {
    background: transparent;
  }
  .code-display::-webkit-scrollbar-thumb {
    background: var(--bg-raised);
    border-radius: 3px;
  }
  .code-display::-webkit-scrollbar-thumb:hover {
    background: var(--text-faint);
  }

  .code-area {
    font-family: var(--font-code);
    font-size: var(--code-font-size);
    line-height: var(--code-line-height);
    white-space: pre;
    padding-right: 24px;
    flex: 1;
    outline: none;
    tab-size: var(--code-tab-size);
    position: relative;
  }

  /* ── Character base ── */
  :deep(.char) {
    position: relative;
    border-radius: 2px;
    contain: layout style;
  }

  /* ── States ── */
  :deep(.char.pending) {
    opacity: 0.3;
  }
  :deep(.char.correct) {
    opacity: 1;
  }

  /* Word-level error: softer amber highlight instead of bright red */
  :deep(.char.incorrect) {
    color: var(--orange) !important;
    opacity: 1;
    background: rgba(var(--red-rgb), 0.12);
    border-bottom: 2px solid rgba(var(--red-rgb), 0.45);
  }

  /* ── Syntax colors (shared for pending + correct) ── */
  :deep(.char.syn-plain) {
    color: var(--syn-plain);
  }
  :deep(.char.syn-keyword) {
    color: var(--syn-keyword);
  }
  :deep(.char.syn-control) {
    color: var(--syn-control);
  }
  :deep(.char.syn-string) {
    color: var(--syn-string);
  }
  :deep(.char.syn-number) {
    color: var(--syn-number);
  }
  :deep(.char.syn-comment) {
    color: var(--syn-comment);
    font-style: italic;
  }
  :deep(.char.syn-func-call) {
    color: var(--syn-func-call);
  }
  :deep(.char.syn-type) {
    color: var(--syn-type);
  }
  :deep(.char.syn-builtin) {
    color: var(--syn-builtin);
  }
  :deep(.char.syn-operator) {
    color: var(--syn-operator);
  }
  :deep(.char.syn-bracket) {
    color: var(--syn-bracket);
  }
  :deep(.char.syn-brace) {
    color: var(--syn-brace);
  }
  :deep(.char.syn-punctuation) {
    color: var(--syn-punctuation);
  }
  :deep(.char.syn-property) {
    color: var(--syn-property);
  }
  :deep(.char.syn-boolean) {
    color: var(--syn-boolean);
  }
  :deep(.char.syn-null) {
    color: var(--syn-null);
  }
  :deep(.char.syn-import) {
    color: var(--syn-import);
  }
  :deep(.char.syn-decorator) {
    color: var(--syn-decorator);
  }
  :deep(.char.syn-tag-bracket) {
    color: var(--syn-tag-bracket);
  }
  :deep(.char.syn-tag-name) {
    color: var(--syn-tag-name);
  }
  :deep(.char.syn-tag-attr) {
    color: var(--syn-tag-attr);
  }
  :deep(.char.syn-tag-attr-special) {
    color: var(--syn-tag-attr-special);
  }

  /* ── Cursor ── */
  :deep(.char.current::before) {
    content: '';
    position: absolute;
    left: -1px;
    top: 2px;
    bottom: 2px;
    width: 2.5px;
    background: var(--accent);
    border-radius: 2px;
    animation: cursorBlink 1.1s step-end infinite;
    box-shadow:
      0 0 10px rgba(var(--accent-rgb), 0.5),
      0 0 2px rgba(var(--accent-rgb), 0.8);
  }
</style>
