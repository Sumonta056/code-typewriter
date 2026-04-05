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

<style scoped>
.editor-frame {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-main);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 var(--radius) var(--radius);
  overflow: hidden;
  min-height: 420px;
  position: relative;
  cursor: text;
  contain: layout style;
  box-shadow:
    0 4px 32px rgba(0,0,0,0.3),
    inset 0 0 60px rgba(0,0,0,0.15);
}
</style>
