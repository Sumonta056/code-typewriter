<template>
  <div class="text-center py-[14px] px-[8px] bg-bg-raised rounded-base border border-c-border">
    <span class="block text-[0.9rem] mb-[6px]">{{ icon }}</span>
    <span class="block font-code text-[1.15rem] font-bold text-c-text mb-[4px]">{{ value }}</span>
    <span class="text-[0.62rem] font-semibold text-c-text-faint uppercase tracking-[0.08em]">{{
      label
    }}</span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    icon: string
    value: string | number
    label: string
  }>()
</script>
