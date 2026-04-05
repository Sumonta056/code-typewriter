<template>
  <div :class="['settings-panel', { open }]">
    <div class="settings-grid">
      <PanelsSettingNumeric label="Font Size" :model-value="settings.fontSize" @change="d => updateNumeric('fontSize', d)" />
      <PanelsSettingNumeric label="Tab Size" :model-value="settings.tabSize" @change="d => updateNumeric('tabSize', d)" />
      <PanelsSettingNumeric label="Max Lines" :model-value="settings.maxLines" :step="10" @change="d => updateNumeric('maxLines', d)" />
      <PanelsSettingToggle label="Sound" :model-value="settings.sound" @toggle="toggleBoolean('sound')" />
      <PanelsSettingToggle label="Show Line Numbers" :model-value="settings.lineNumbers" @toggle="toggleBoolean('lineNumbers')" />
      <PanelsSettingToggle label="Smooth Caret" :model-value="settings.smoothCaret" @toggle="toggleBoolean('smoothCaret')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings'

defineProps<{ open: boolean }>()

const settingsStore = useSettingsStore()
const { settings } = settingsStore
const { updateNumeric, toggleBoolean } = settingsStore
</script>

<style scoped>
.settings-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s var(--ease), margin 0.35s var(--ease);
  margin-bottom: 0;
}
.settings-panel.open {
  max-height: 200px;
  margin-bottom: 12px;
}
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
}

@media (max-width: 768px) {
  .settings-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
