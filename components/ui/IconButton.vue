<template>
  <button
    :class="[
      'flex items-center justify-center w-[36px] h-[36px] rounded-[6px] border border-c-border bg-transparent text-c-text-dim cursor-pointer transition-all duration-200 hover:bg-bg-hover hover:text-c-text hover:border-c-border-lit',
      {
        'bg-[rgba(var(--accent-rgb),0.1)] text-c-accent border-[rgba(var(--accent-rgb),0.25)]':
          isActive,
      },
    ]"
    v-bind="$attrs"
  >
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
