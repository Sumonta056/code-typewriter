<template>
  <button :class="['btn', `btn-${variant}`, { 'btn-sm': small }]" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      variant?: 'glow' | 'dim'
      small?: boolean
    }>(),
    {
      variant: 'glow',
      small: false,
    },
  )
</script>

<style scoped>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 18px;
    border-radius: 6px;
    font-family: var(--font-ui);
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s var(--ease);
    border: 1px solid transparent;
    white-space: nowrap;
  }

  .btn-sm {
    padding: 6px 14px;
    font-size: 0.75rem;
  }

  .btn-glow {
    background: rgba(var(--accent-rgb), 0.15);
    color: var(--accent);
    border-color: rgba(var(--accent-rgb), 0.25);
  }
  .btn-glow:hover {
    background: rgba(var(--accent-rgb), 0.25);
    box-shadow: 0 0 24px rgba(var(--accent-rgb), 0.15);
  }

  .btn-dim {
    background: var(--bg-surface);
    color: var(--text-dim);
    border-color: var(--border);
  }
  .btn-dim:hover {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--border-lit);
  }
</style>
