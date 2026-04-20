<template>
  <div class="lang-select-wrap">
    <select
      class="lang-select"
      :value="selectedId"
      aria-label="Select language"
      @change="$emit('select', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="lang in languages" :key="lang.id" :value="lang.id">
        {{ lang.name }}
      </option>
    </select>
    <svg
      class="lang-select-arrow"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
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
