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
        label="Show Line Numbers"
        :model-value="settings.lineNumbers"
        @toggle="toggleBoolean('lineNumbers')"
      />
      <PanelsSettingToggle
        label="Smooth Caret"
        :model-value="settings.smoothCaret"
        @toggle="toggleBoolean('smoothCaret')"
      />

      <!-- UI Theme switcher -->
      <div class="theme-setting">
        <span class="theme-label">UI Theme</span>
        <div class="theme-btns">
          <button
            v-for="t in themes"
            :key="t.id"
            :class="['theme-btn', { active: settings.theme === t.id }]"
            :title="t.label"
            @click="setTheme(t.id as ThemeKey)"
          >
            <span class="theme-dot" :style="{ background: t.color }" />
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- Editor syntax theme -->
      <div class="theme-setting">
        <span class="theme-label">Editor Theme</span>
        <select
          class="editor-theme-select"
          :value="settings.editorTheme"
          @change="(e) => setEditorTheme((e.target as HTMLSelectElement).value)"
        >
          <optgroup label="Dark">
            <option v-for="t in darkThemes" :key="t.id" :value="t.id">
              {{ t.displayName }}
            </option>
          </optgroup>
          <optgroup label="Light">
            <option v-for="t in lightThemes" :key="t.id" :value="t.id">
              {{ t.displayName }}
            </option>
          </optgroup>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useSettingsStore } from '~/stores/settings'
  import type { ThemeKey } from '~/types'
  import { SHIKI_THEMES } from '~/utils/shikiHighlighter'
  import { THEME_OPTIONS } from '~/utils/themes'

  defineProps<{ open: boolean }>()

  const settingsStore = useSettingsStore()
  const { settings } = settingsStore
  const { updateNumeric, toggleBoolean, setTheme, setEditorTheme } = settingsStore

  const themes = THEME_OPTIONS

  const darkThemes = computed(() => SHIKI_THEMES.filter((t) => t.type === 'dark'))
  const lightThemes = computed(() => SHIKI_THEMES.filter((t) => t.type === 'light'))
</script>
