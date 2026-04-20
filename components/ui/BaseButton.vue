<template>
  <button
    :class="[baseClass, variantClass, { 'px-[14px] py-[6px] text-[0.75rem]': small }]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      variant?: 'glow' | 'dim'
      small?: boolean
    }>(),
    {
      variant: 'glow',
      small: false,
    },
  )

  const baseClass =
    'inline-flex items-center gap-[7px] px-[18px] py-[8px] rounded-[6px] font-ui text-[0.8rem] font-semibold cursor-pointer transition-all duration-200 border border-transparent whitespace-nowrap'

  const variantClass = computed(() =>
    props.variant === 'glow'
      ? 'bg-[rgba(var(--accent-rgb),0.15)] text-c-accent border-[rgba(var(--accent-rgb),0.25)] hover:bg-[rgba(var(--accent-rgb),0.25)] hover:shadow-[0_0_24px_rgba(var(--accent-rgb),0.15)]'
      : 'bg-bg-surface text-c-text-dim border-c-border hover:bg-bg-hover hover:text-c-text hover:border-c-border-lit',
  )
</script>
