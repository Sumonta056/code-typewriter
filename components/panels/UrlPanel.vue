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
        />
        <UiBaseButton variant="glow" :small="true" @click="emitFetch"> Fetch </UiBaseButton>
      </div>
      <p class="url-hint">
        Paste any GitHub file URL or path — e.g.
        <code>vuejs/core/blob/main/packages/reactivity/src/ref.ts</code>
      </p>
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

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        nextTick(() => inputEl.value?.focus())
      }
    },
  )
</script>
