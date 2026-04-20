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
