<template>
  <div class="results-card">
    <div class="results-badge">COMPLETED</div>
    <div class="results-header">
      <h2>Session Report</h2>
      <p class="results-file">{{ fileName }}</p>
    </div>
    <div class="results-hero">
      <div class="hero-wpm">
        <span class="hero-value">{{ wpm }}</span>
        <span class="hero-unit">WPM</span>
      </div>
    </div>
    <div class="results-grid">
      <ResultsResultItem icon="⏱" :value="time" label="Time" />
      <ResultsResultItem icon="⚪" :value="accuracy + '%'" label="Accuracy" />
      <ResultsResultItem icon="✏" :value="chars" label="Characters" />
      <ResultsResultItem icon="❌" :value="errors" label="Errors" />
      <ResultsResultItem icon="⚡" :value="cpm" label="CPM" />
      <ResultsResultItem icon="📈" :value="rawWpm" label="Raw WPM" />
    </div>
    <div class="results-actions">
      <UiBaseButton variant="glow" @click="$emit('retry')">Retry Same</UiBaseButton>
      <UiBaseButton variant="dim" @click="$emit('newFile')">New File</UiBaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  wpm: number
  rawWpm: number
  cpm: number
  accuracy: number
  time: string
  chars: number
  errors: number
  fileName: string
}>()

defineEmits<{
  retry: []
  newFile: []
}>()
</script>

<style scoped>
.results-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-lit);
  border-radius: 16px;
  padding: 36px 44px 32px;
  max-width: 520px;
  width: 92%;
  position: relative;
  overflow: hidden;
}
.results-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--purple), var(--green));
}
.results-badge {
  display: inline-block;
  font-family: var(--font-code);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--green);
  background: rgba(var(--green-rgb), 0.1);
  border: 1px solid rgba(var(--green-rgb), 0.2);
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}
.results-header { margin-bottom: 24px; }
.results-header h2 {
  font-family: var(--font-ui);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
}
.results-file {
  font-family: var(--font-code);
  font-size: 0.72rem;
  color: var(--text-faint);
}
.results-hero {
  text-align: center;
  padding: 24px 0;
  margin-bottom: 20px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.hero-wpm {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}
.hero-value {
  font-family: var(--font-code);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  text-shadow: 0 0 40px rgba(var(--accent-rgb), 0.3);
}
.hero-unit {
  font-family: var(--font-code);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dim);
  letter-spacing: 0.08em;
}
.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 28px;
}
.results-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.results-actions :deep(.btn) { padding: 10px 28px; }

@media (max-width: 768px) {
  .results-card { padding: 24px 20px; }
  .hero-value { font-size: 2.5rem; }
  .results-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .results-grid { grid-template-columns: 1fr 1fr; }
}
</style>
