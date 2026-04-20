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
