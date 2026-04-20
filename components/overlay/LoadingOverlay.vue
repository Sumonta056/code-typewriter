<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 bg-bg-overlay flex flex-col items-center justify-center gap-[24px] z-[200]"
        role="alert"
        aria-live="assertive"
      >
        <div class="w-[44px] h-[44px] relative">
          <div
            class="absolute w-[36px] h-[36px] border-[3px] border-transparent border-t-c-accent rounded-full [animation:loaderSpin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite] [-animation-delay:-0.45s]"
          />
          <div
            class="absolute w-[36px] h-[36px] border-[3px] border-transparent border-t-c-purple rounded-full [animation:loaderSpin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite] [-animation-delay:-0.3s]"
          />
          <div
            class="absolute w-[36px] h-[36px] border-[3px] border-transparent border-t-c-green rounded-full [animation:loaderSpin_1.2s_cubic-bezier(0.5,0,0.5,1)_infinite] [-animation-delay:-0.15s]"
          />
        </div>
        <p class="font-code text-[0.8rem] text-c-text-dim">
          Fetching from GitHub<span class="loading-dots" />
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  defineProps<{ visible: boolean }>()
</script>
