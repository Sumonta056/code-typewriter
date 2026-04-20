<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div class="toolbar-actions flex flex-col items-stretch gap-[4px]">
    <!-- GitHub URL -->
    <button
      :class="[
        'toolbar-btn flex items-center gap-[10px] w-full px-[10px] py-[7px] rounded-[8px] border cursor-pointer text-left transition-colors duration-200',
        urlOpen
          ? 'border-[rgba(var(--accent-rgb),0.5)] bg-[rgba(var(--accent-rgb),0.08)]'
          : 'border-c-border bg-bg-surface hover:bg-bg-hover hover:border-[rgba(var(--accent-rgb),0.3)]',
      ]"
      title="Load from GitHub URL"
      @click="$emit('toggleUrl')"
    >
      <span
        :class="[
          'flex-shrink-0 flex items-center justify-center w-[28px] h-[28px] rounded-[6px] bg-bg-root transition-colors duration-200',
          urlOpen ? 'text-c-accent' : 'text-c-text-dim',
        ]"
      >
        <Icon name="ph:link-bold" size="18" />
      </span>
      <span class="toolbar-btn-text flex flex-col gap-[1px] min-w-0">
        <span
          :class="[
            'font-code text-[0.72rem] font-semibold leading-[1.2] transition-colors duration-200',
            urlOpen ? 'text-c-accent' : 'text-c-text-dim',
          ]"
          >GitHub URL</span
        >
        <span class="font-ui text-[0.62rem] text-c-text-faint leading-[1.3]"
          >Paste any public file to type it</span
        >
      </span>
    </button>

    <!-- Pause — only visible when session is active -->
    <button
      v-if="canPause"
      :class="[
        'toolbar-btn flex items-center gap-[10px] w-full px-[10px] py-[7px] rounded-[8px] border cursor-pointer text-left transition-colors duration-200',
        isPaused
          ? 'border-[rgba(var(--accent-rgb),0.5)] bg-[rgba(var(--accent-rgb),0.08)]'
          : 'border-c-border bg-bg-surface hover:bg-bg-hover hover:border-[rgba(var(--accent-rgb),0.3)]',
      ]"
      :title="isPaused ? 'Resume (Space)' : 'Pause (Space)'"
      @click="$emit('togglePause')"
    >
      <span
        :class="[
          'flex-shrink-0 flex items-center justify-center w-[28px] h-[28px] rounded-[6px] bg-bg-root transition-colors duration-200',
          isPaused ? 'text-c-accent' : 'text-c-text-dim',
        ]"
      >
        <Icon :name="isPaused ? 'ph:play-bold' : 'ph:pause-bold'" size="18" />
      </span>
      <span class="toolbar-btn-text flex flex-col gap-[1px] min-w-0">
        <span
          :class="[
            'font-code text-[0.72rem] font-semibold leading-[1.2] transition-colors duration-200',
            isPaused ? 'text-c-accent' : 'text-c-text-dim',
          ]"
          >{{ isPaused ? 'Resume' : 'Pause' }}</span
        >
        <span class="font-ui text-[0.62rem] text-c-text-faint leading-[1.3]"
          >Press Space to toggle</span
        >
      </span>
    </button>

    <!-- Reset — always last -->
    <button
      class="toolbar-btn flex items-center gap-[10px] w-full px-[10px] py-[7px] rounded-[8px] border border-[rgba(var(--red-rgb),0.2)] bg-bg-surface cursor-pointer text-left transition-colors duration-200 hover:bg-[rgba(var(--red-rgb),0.07)] hover:border-[rgba(var(--red-rgb),0.4)]"
      title="Reset session"
      @click="$emit('reset')"
    >
      <span
        class="flex-shrink-0 flex items-center justify-center w-[28px] h-[28px] rounded-[6px] bg-bg-root text-c-red"
      >
        <Icon name="ph:arrow-counter-clockwise-bold" size="16" />
      </span>
      <span class="toolbar-btn-text flex flex-col gap-[1px] min-w-0">
        <span class="font-code text-[0.72rem] font-semibold leading-[1.2] text-c-red">Reset</span>
        <span class="font-ui text-[0.62rem] text-c-text-faint leading-[1.3]"
          >Start over from scratch</span
        >
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    urlOpen: boolean
    canPause: boolean
    isPaused: boolean
  }>()

  defineEmits<{
    toggleUrl: []
    togglePause: []
    reset: []
  }>()
</script>
