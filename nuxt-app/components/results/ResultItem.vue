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

<style scoped>
.result-item {
  text-align: center;
  padding: 14px 8px;
  background: var(--bg-raised);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
.result-icon {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 6px;
}
.result-value {
  display: block;
  font-family: var(--font-code);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}
.result-label {
  font-size: 0.62rem;
  font-weight: 600;
  color: var(--text-faint);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
