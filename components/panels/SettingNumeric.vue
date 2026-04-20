<template>
  <div class="setting-item">
    <label class="setting-label">{{ label }}</label>
    <div class="setting-control">
      <button
        class="w-[28px] h-[28px] rounded-[5px] border border-c-border bg-bg-raised text-c-text-dim text-[0.85rem] font-bold cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-bg-hover hover:text-c-text hover:border-c-border-lit"
        @click="$emit('change', -step)"
      >
        -
      </button>
      <span class="font-code text-[0.8rem] text-c-accent font-semibold min-w-[24px] text-center">{{
        modelValue
      }}</span>
      <button
        class="w-[28px] h-[28px] rounded-[5px] border border-c-border bg-bg-raised text-c-text-dim text-[0.85rem] font-bold cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-bg-hover hover:text-c-text hover:border-c-border-lit"
        @click="$emit('change', step)"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      label: string
      modelValue: number
      step?: number
    }>(),
    {
      step: 1,
    },
  )

  defineEmits<{ change: [delta: number] }>()
</script>
