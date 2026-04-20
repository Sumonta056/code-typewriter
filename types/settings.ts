export interface AppSettings {
  fontSize: number
  tabSize: number
  maxLines: number
  lineNumbers: boolean
  smoothCaret: boolean
  theme: 'dark' | 'monokai' | 'solarized'
}

export type NumericSettingKey = 'fontSize' | 'tabSize' | 'maxLines'
export type BooleanSettingKey = 'lineNumbers' | 'smoothCaret'
export type ThemeKey = 'dark' | 'monokai' | 'solarized'
