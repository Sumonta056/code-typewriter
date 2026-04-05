<template>
  <div class="language-selector" role="radiogroup" aria-label="Select language">
    <button
      v-for="lang in languages"
      :key="lang.id"
      :class="['lang-btn', { active: lang.id === selectedId }]"
      role="radio"
      :aria-checked="lang.id === selectedId"
      @click="$emit('select', lang.id)"
    >
      {{ lang.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Language } from '~/types'

defineProps<{
  languages: Language[]
  selectedId: string
}>()

defineEmits<{
  select: [id: string]
}>()
</script>

<style scoped>
.language-selector {
  display: flex;
  gap: 4px;
}

.lang-btn {
  padding: 7px 16px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-dim);
  font-family: var(--font-code);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  white-space: nowrap;
  letter-spacing: 0.02em;
}
.lang-btn:hover {
  background: var(--bg-hover);
  color: var(--text);
  border-color: var(--border-lit);
}
.lang-btn.active {
  background: rgba(var(--accent-rgb), 0.12);
  color: var(--accent);
  border-color: rgba(var(--accent-rgb), 0.3);
}

@media (max-width: 480px) {
  .language-selector { flex-wrap: wrap; }
}
</style>
