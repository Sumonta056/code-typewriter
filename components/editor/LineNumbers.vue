<template>
  <div :class="['line-numbers', { hidden: !visible }]">
    <div v-for="n in lineCount" :key="n">
      {{ n }}
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    lineCount: number
    visible: boolean
  }>()
</script>
