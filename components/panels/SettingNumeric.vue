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

<style scoped>
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .setting-label {
    font-size: 0.75rem;
    color: var(--text-dim);
    font-weight: 500;
    white-space: nowrap;
  }
  .setting-control {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .setting-btn {
    width: 28px;
    height: 28px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--bg-raised);
    color: var(--text-dim);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s var(--ease);
  }
  .setting-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--border-lit);
  }
  .setting-value {
    font-family: var(--font-code);
    font-size: 0.8rem;
    color: var(--accent);
    font-weight: 600;
    min-width: 24px;
    text-align: center;
  }
</style>
