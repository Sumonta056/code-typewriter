<template>
  <div class="setting-item">
    <label class="setting-label">{{ label }}</label>
    <div class="setting-control">
      <button
        :class="[
          'px-[14px] py-[5px] rounded-[5px] border font-code text-[0.7rem] font-semibold cursor-pointer transition-all duration-200',
          modelValue
            ? 'bg-[rgba(var(--green-rgb),0.12)] text-c-green border-[rgba(var(--green-rgb),0.25)]'
            : 'border-c-border bg-bg-raised text-c-text-faint',
        ]"
        role="switch"
        :aria-checked="modelValue"
        @click="$emit('toggle')"
      >
        {{ modelValue ? 'ON' : 'OFF' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    label: string
    modelValue: boolean
  }>()

  defineEmits<{ toggle: [] }>()
</script>
