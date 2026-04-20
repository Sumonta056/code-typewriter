<template>
  <Teleport to="body">
    <Transition name="url-modal">
      <div v-if="open" class="url-modal-backdrop" @click.self="$emit('close')">
        <div class="url-modal-card" role="dialog" aria-modal="true" aria-label="Load from GitHub">
          <div class="url-modal-header">
            <div class="url-modal-title-row">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="url-modal-icon"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span class="url-modal-title">Load from GitHub</span>
            </div>
            <button class="url-modal-close" title="Close" @click="$emit('close')">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

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
              @keydown.esc="$emit('close')"
            />
            <UiBaseButton variant="glow" :small="true" @click="emitFetch"> Fetch </UiBaseButton>
          </div>

          <p class="url-hint">
            Paste any GitHub file URL or path — e.g.
            <code>vuejs/core/blob/main/packages/reactivity/src/ref.ts</code>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  const props = defineProps<{
    open: boolean
    error?: boolean
  }>()
  const emit = defineEmits<{ fetch: [url: string]; close: [] }>()

  const inputEl = ref<HTMLInputElement | null>(null)

  function emitFetch() {
    if (inputEl.value) emit('fetch', inputEl.value.value)
  }

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        nextTick(() => inputEl.value?.focus())
      } else if (inputEl.value) {
        inputEl.value.value = ''
      }
    },
  )
</script>
