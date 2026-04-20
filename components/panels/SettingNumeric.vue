<template>
  <div class="setting-item">
    <label class="setting-label">{{ label }}</label>
    <div class="setting-control">
      <button class="setting-btn" @click="$emit('change', -step)">-</button>
      <span class="setting-value">{{ modelValue }}</span>
      <button class="setting-btn" @click="$emit('change', step)">+</button>
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
