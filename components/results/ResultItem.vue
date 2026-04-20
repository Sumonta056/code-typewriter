<template>
  <div class="result-item">
    <span class="result-icon">{{ icon }}</span>
    <span class="result-value">{{ value }}</span>
    <span class="result-label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    icon: string
    value: string | number
    label: string
  }>()
</script>
