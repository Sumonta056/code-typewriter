<template>
  <div
    class="editor-frame flex-1 flex flex-col bg-bg-main border border-c-border border-t-0 rounded-b-base overflow-hidden min-h-0 relative cursor-text [contain:layout_style] [box-shadow:0_4px_32px_rgba(0,0,0,0.3),inset_0_0_60px_rgba(0,0,0,0.15)]"
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
