<template>
  <div class="flex flex-wrap gap-1" role="radiogroup" aria-label="Select language">
    <button
      v-for="lang in languages"
      :key="lang.id"
      :class="['lang-btn', { active: lang.id === selectedId }]"
      role="radio"
      :aria-checked="lang.id === selectedId"
      @click="$emit('select', lang.id)"
    >
      {{ lang.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { Language } from '~/types'

  defineProps<{
    languages: Language[]
    selectedId: string
  }>()

  defineEmits<{
    select: [id: string]
  }>()
</script>
