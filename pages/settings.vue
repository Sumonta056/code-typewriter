<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div
    class="flex-1 overflow-y-auto px-[40px] py-[32px] max-w-[820px] mx-auto w-full max-[640px]:px-[16px] max-[640px]:py-[20px]"
  >
    <div class="mb-[36px] border-b border-c-border pb-[24px]">
      <h1 class="font-code text-[1.5rem] font-bold text-c-text tracking-[-0.03em] mb-[6px]">
        Settings
      </h1>
      <p class="text-[0.82rem] text-c-text-dim">Customize your typing experience</p>
    </div>

    <div class="flex flex-col gap-[32px]">
      <!-- Editor section -->
      <section
        class="bg-bg-surface border border-c-border rounded-lg px-[28px] py-[24px] max-[640px]:px-[16px] max-[640px]:py-[18px]"
      >
        <h2
          class="font-code text-[0.7rem] font-bold tracking-[0.1em] uppercase text-c-accent mb-[20px]"
        >
          Editor
        </h2>
        <div
          class="grid [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))] gap-[16px] max-[640px]:grid-cols-1"
        >
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
        </div>
      </section>

      <!-- Theme section -->
      <section
        class="bg-bg-surface border border-c-border rounded-lg px-[28px] py-[24px] max-[640px]:px-[16px] max-[640px]:py-[18px]"
      >
        <h2
          class="font-code text-[0.7rem] font-bold tracking-[0.1em] uppercase text-c-accent mb-[20px]"
        >
          Theme
        </h2>
        <div class="flex flex-col gap-[20px]">
          <div class="flex items-center gap-[16px] flex-wrap">
            <span class="setting-label min-w-[90px] flex-shrink-0">UI Theme</span>
            <div class="flex gap-[6px]">
              <button
                v-for="t in themes"
                :key="t.id"
                :class="[
                  'flex items-center gap-[6px] px-[12px] py-[5px] rounded-[6px] border font-code text-[0.68rem] cursor-pointer transition-all duration-200',
                  settings.theme === t.id
                    ? 'border-c-accent text-c-accent bg-[rgba(var(--accent-rgb),0.08)]'
                    : 'border-c-border bg-transparent text-c-text-dim hover:border-c-border-lit hover:text-c-text',
                ]"
                :title="t.label"
                @click="setTheme(t.id as ThemeKey)"
              >
                <span
                  class="w-[8px] h-[8px] rounded-full flex-shrink-0"
                  :style="{ background: t.color }"
                />
                {{ t.label }}
              </button>
            </div>
          </div>

          <div class="flex items-center gap-[16px] flex-wrap">
            <span class="setting-label min-w-[90px] flex-shrink-0">Editor Theme</span>
            <select
              class="editor-theme-select flex-1 max-w-[320px] px-[10px] py-[5px] pr-[28px] rounded-[6px] border border-c-border bg-bg-surface text-c-text font-code text-[0.68rem] cursor-pointer transition-colors duration-200 hover:border-c-border-lit focus:border-c-border-lit focus:outline-none max-[768px]:max-w-full"
              :value="settings.editorTheme"
              @change="(e) => setEditorTheme((e.target as HTMLSelectElement).value)"
            >
              <optgroup label="Dark">
                <option
                  v-for="t in darkThemes"
                  :key="t.id"
                  :value="t.id"
                  class="bg-bg-surface text-c-text"
                >
                  {{ t.displayName }}
                </option>
              </optgroup>
              <optgroup label="Light">
                <option
                  v-for="t in lightThemes"
                  :key="t.id"
                  :value="t.id"
                  class="bg-bg-surface text-c-text"
                >
                  {{ t.displayName }}
                </option>
              </optgroup>
            </select>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useSettingsStore } from '~/stores/settings'
  import type { ThemeKey } from '~/types'
  import { SHIKI_THEMES } from '~/utils/shikiHighlighter'
  import { THEME_OPTIONS } from '~/utils/themes'

  const settingsStore = useSettingsStore()
  const { settings } = settingsStore
  const { updateNumeric, toggleBoolean, setTheme, setEditorTheme } = settingsStore

  const themes = THEME_OPTIONS
  const darkThemes = computed(() => SHIKI_THEMES.filter((t) => t.type === 'dark'))
  const lightThemes = computed(() => SHIKI_THEMES.filter((t) => t.type === 'light'))
</script>
