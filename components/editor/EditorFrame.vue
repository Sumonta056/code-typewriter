<template>
  <div
    class="editor-frame"
    role="application"
    aria-label="Code typing practice area"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  defineEmits<{ click: [] }>()
</script>
