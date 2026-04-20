<template>
  <Teleport to="body">
    <Transition name="url-modal">
      <div
        v-if="open"
        class="fixed inset-0 bg-bg-overlay flex items-start justify-center pt-[100px] z-[200]"
        @click.self="$emit('close')"
      >
        <div
          class="bg-bg-surface border border-c-border-lit rounded-lg p-[24px] w-full max-w-[620px] relative [box-shadow:0_24px_64px_rgba(0,0,0,0.6),0_0_0_1px_rgba(var(--accent-rgb),0.08)]"
          role="dialog"
          aria-modal="true"
          aria-label="Load from GitHub"
        >
          <div class="flex items-center justify-between mb-[18px]">
            <div class="flex items-center gap-[10px]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-c-accent flex-shrink-0"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span class="font-code text-[0.85rem] font-bold text-c-text tracking-[0.01em]"
                >Load from GitHub</span
              >
            </div>
            <button
              class="flex items-center justify-center w-[30px] h-[30px] rounded-[6px] border border-c-border bg-transparent text-c-text-faint cursor-pointer transition-all duration-150 flex-shrink-0 hover:bg-bg-hover hover:text-c-text hover:border-c-border-lit"
              title="Close"
              @click="$emit('close')"
            >
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

          <div class="flex items-center gap-[8px]">
            <span class="font-code text-[0.78rem] text-c-text-faint whitespace-nowrap"
              >github.com/</span
            >
            <input
              ref="inputEl"
              type="text"
              :class="[
                'flex-1 bg-bg-main border rounded-[5px] px-[12px] py-[8px] font-code text-[0.78rem] text-c-text outline-none transition-all duration-200 placeholder:text-c-text-faint focus:border-c-accent focus:[box-shadow:0_0_0_2px_rgba(var(--accent-rgb),0.1)]',
                error ? 'border-c-red' : 'border-c-border',
              ]"
              placeholder="owner/repo/blob/main/path/to/file.ts"
              spellcheck="false"
              autocomplete="off"
              @keydown.enter="emitFetch"
              @keydown.esc="$emit('close')"
            />
            <UiBaseButton variant="glow" :small="true" @click="emitFetch"> Fetch </UiBaseButton>
          </div>

          <p class="text-[0.7rem] text-c-text-faint mt-[8px]">
            Paste any GitHub file URL or path — e.g.
            <code
              class="font-code text-c-text-dim bg-bg-raised px-[5px] py-[1px] rounded-[3px] text-[0.68rem]"
              >vuejs/core/blob/main/packages/reactivity/src/ref.ts</code
            >
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
