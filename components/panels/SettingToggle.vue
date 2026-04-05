<template>
  <div class="setting-item">
    <label class="setting-label">{{ label }}</label>
    <div class="setting-control">
      <button
        :class="['toggle-btn', { active: modelValue }]"
        role="switch"
        :aria-checked="modelValue"
        @click="$emit('toggle')"
      >
        {{ modelValue ? 'ON' : 'OFF' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label: string
    modelValue: boolean
  }>()

  defineEmits<{ toggle: [] }>()
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
  .toggle-btn {
    padding: 5px 14px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--bg-raised);
    color: var(--text-faint);
    font-family: var(--font-code);
    font-size: 0.7rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s var(--ease);
  }
  .toggle-btn.active {
    background: rgba(var(--green-rgb), 0.12);
    color: var(--green);
    border-color: rgba(var(--green-rgb), 0.25);
  }
</style>
