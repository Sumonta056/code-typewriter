<template>
  <div :class="['line-numbers', { hidden: !visible }]">
    <div v-for="n in lineCount" :key="n">
      {{ n }}
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    lineCount: number
    visible: boolean
  }>()
</script>

<style scoped>
  .line-numbers {
    padding: 0 12px 0 16px;
    text-align: right;
    color: var(--text-faint);
    font-family: var(--font-code);
    font-size: var(--code-font-size);
    line-height: var(--code-line-height);
    user-select: none;
    flex-shrink: 0;
    border-right: 1px solid var(--border);
    margin-right: 14px;
    min-width: 48px;
    transition: opacity 0.2s var(--ease);
  }
  .line-numbers.hidden {
    opacity: 0;
    width: 0;
    min-width: 0;
    padding: 0;
    margin: 0;
    border: none;
  }
</style>
