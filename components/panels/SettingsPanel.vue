<template>
  <div :class="['settings-panel', { open }]">
    <div class="settings-grid">
      <PanelsSettingNumeric
        label="Font Size"
        :model-value="settings.fontSize"
        @change="(d) => updateNumeric('fontSize', d)"
      />
      <PanelsSettingNumeric
        label="Tab Size"
        :model-value="settings.tabSize"
        @change="(d) => updateNumeric('tabSize', d)"
      />
      <PanelsSettingNumeric
        label="Max Lines"
        :model-value="settings.maxLines"
        :step="10"
        @change="(d) => updateNumeric('maxLines', d)"
      />
      <PanelsSettingToggle
        label="Sound"
        :model-value="settings.sound"
        @toggle="toggleBoolean('sound')"
      />
      <PanelsSettingToggle
        label="Show Line Numbers"
        :model-value="settings.lineNumbers"
        @toggle="toggleBoolean('lineNumbers')"
      />
      <PanelsSettingToggle
        label="Smooth Caret"
        :model-value="settings.smoothCaret"
        @toggle="toggleBoolean('smoothCaret')"
      />

      <!-- Theme switcher -->
      <div class="theme-setting">
        <span class="theme-label">Theme</span>
        <div class="theme-btns">
          <button
            v-for="t in themes"
            :key="t.id"
            :class="['theme-btn', { active: settings.theme === t.id }]"
            :title="t.label"
            @click="setTheme(t.id as 'dark' | 'monokai' | 'solarized')"
          >
            <span class="theme-dot" :style="{ background: t.color }" />
            {{ t.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useSettingsStore } from '~/stores/settings'

  defineProps<{ open: boolean }>()

  const settingsStore = useSettingsStore()
  const { settings } = settingsStore
  const { updateNumeric, toggleBoolean, setTheme } = settingsStore

  const themes = [
    { id: 'dark', label: 'Dark', color: '#58a6ff' },
    { id: 'monokai', label: 'Monokai', color: '#a6e22e' },
    { id: 'solarized', label: 'Solarized', color: '#268bd2' },
  ]
</script>

<style scoped>
  .settings-panel {
    max-height: 0;
    overflow: hidden;
    transition:
      max-height 0.35s var(--ease),
      margin 0.35s var(--ease);
    margin-bottom: 0;
  }
  .settings-panel.open {
    max-height: 280px;
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

  /* Theme switcher */
  .theme-setting {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .theme-label {
    font-family: var(--font-code);
    font-size: 0.72rem;
    color: var(--text-dim);
    min-width: 48px;
  }
  .theme-btns {
    display: flex;
    gap: 6px;
  }
  .theme-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-dim);
    font-family: var(--font-code);
    font-size: 0.68rem;
    cursor: pointer;
    transition: all 0.2s var(--ease);
  }
  .theme-btn:hover {
    border-color: var(--border-lit);
    color: var(--text);
  }
  .theme-btn.active {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(var(--accent-rgb), 0.08);
  }
  .theme-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .settings-panel.open {
      max-height: 400px;
    }
    .settings-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
