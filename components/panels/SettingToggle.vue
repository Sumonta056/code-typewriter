<template>
  <div class="setting-item">
    <label class="setting-label">{{ label }}</label>
    <div class="setting-control">
      <button
        :class="['toggle-btn', { active: modelValue }]"
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
