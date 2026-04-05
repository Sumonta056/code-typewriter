<template>
  <div class="toolbar">
    <div class="toolbar-left">
      <ToolbarLanguageSelector
        :languages="languages"
        :selected-id="selectedId"
        @select="$emit('selectLanguage', $event)"
      />
    </div>
    <ToolbarActions
      :url-open="urlOpen"
      :settings-open="settingsOpen"
      @toggle-url="$emit('toggleUrl')"
      @toggle-settings="$emit('toggleSettings')"
      @random="$emit('random')"
      @reset="$emit('reset')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Language } from '~/types'

defineProps<{
  languages: Language[]
  selectedId: string
  urlOpen: boolean
  settingsOpen: boolean
}>()

defineEmits<{
  selectLanguage: [id: string]
  toggleUrl: []
  toggleSettings: []
  random: []
  reset: []
}>()
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
