<template>
  <button :class="['icon-btn', { active: isActive }]" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      isActive?: boolean
    }>(),
    {
      isActive: false,
    },
  )
</script>

<style scoped>
  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.2s var(--ease);
  }
  .icon-btn:hover {
    background: var(--bg-hover);
    color: var(--text);
    border-color: var(--border-lit);
  }
  .icon-btn.active {
    background: rgba(var(--accent-rgb), 0.1);
    color: var(--accent);
    border-color: rgba(var(--accent-rgb), 0.25);
  }
</style>
