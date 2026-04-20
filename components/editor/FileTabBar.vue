<template>
  <div
    class="flex items-stretch bg-bg-surface border border-c-border border-b-0 rounded-t-base overflow-x-auto"
  >
    <div
      class="flex items-center gap-[8px] px-[18px] py-[10px] font-code text-[0.75rem] text-c-text-dim border-r border-c-border whitespace-nowrap cursor-default border-b-2 border-b-c-accent mb-[-1px] text-c-text bg-bg-main"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
      <span>{{ fileName }}</span>
      <span
        v-if="progress"
        class="text-[0.65rem] text-c-text-faint bg-bg-raised px-[8px] py-[1px] rounded-[10px]"
        >{{ progress }}</span
      >
    </div>
    <div class="flex-1 border-b border-c-border flex items-center justify-end pr-[12px]" />
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    fileName: string
    progress?: string
  }>()
</script>
