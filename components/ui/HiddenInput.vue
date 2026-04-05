<template>
  <textarea
    ref="inputEl"
    class="hidden-input"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    aria-label="Type the displayed code here"
    @keydown="onKeyDown"
    @beforeinput.prevent
    @input="onInput"
    @paste.prevent
    @drop.prevent
    @contextmenu.prevent
  />
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    keydown: [e: KeyboardEvent]
  }>()

  const inputEl = ref<HTMLTextAreaElement | null>(null)

  function onKeyDown(e: KeyboardEvent) {
    emit('keydown', e)
  }

  function onInput() {
    if (inputEl.value) inputEl.value.value = ''
  }

  function focus() {
    inputEl.value?.focus()
  }

  function clear() {
    if (inputEl.value) inputEl.value.value = ''
  }

  defineExpose({ focus, clear })
</script>

<style scoped>
  .hidden-input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    pointer-events: none;
  }
</style>
