<template>
  <div :class="['url-panel', { open }]">
    <div class="url-panel-inner">
      <div class="url-input-row">
        <span class="url-prefix">github.com/</span>
        <input
          ref="inputEl"
          type="text"
          :class="['url-input', { 'url-input-error': error }]"
          placeholder="owner/repo/blob/main/path/to/file.ts"
          spellcheck="false"
          autocomplete="off"
          @keydown.enter="emitFetch"
        >
        <UiBaseButton variant="glow" :small="true" @click="emitFetch">Fetch</UiBaseButton>
      </div>
      <p class="url-hint">Paste any GitHub file URL or path — e.g. <code>vuejs/core/blob/main/packages/reactivity/src/ref.ts</code></p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  error?: boolean
}>()
const emit = defineEmits<{ fetch: [url: string] }>()

const inputEl = ref<HTMLInputElement | null>(null)

function emitFetch() {
  if (inputEl.value) emit('fetch', inputEl.value.value)
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    nextTick(() => inputEl.value?.focus())
  }
})
</script>

<style scoped>
.url-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s var(--ease), margin 0.35s var(--ease);
  margin-bottom: 0;
}
.url-panel.open {
  max-height: 120px;
  margin-bottom: 12px;
}
.url-panel-inner {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 18px;
}
.url-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.url-prefix {
  font-family: var(--font-code);
  font-size: 0.78rem;
  color: var(--text-faint);
  white-space: nowrap;
}
.url-input {
  flex: 1;
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 8px 12px;
  font-family: var(--font-code);
  font-size: 0.78rem;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s var(--ease);
}
.url-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.1);
}
.url-input::placeholder { color: var(--text-faint); }
.url-input-error { border-color: var(--red) !important; }
.url-hint {
  font-size: 0.7rem;
  color: var(--text-faint);
  margin-top: 8px;
}
.url-hint code {
  font-family: var(--font-code);
  color: var(--text-dim);
  background: var(--bg-raised);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 0.68rem;
}
</style>
