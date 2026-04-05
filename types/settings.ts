export interface AppSettings {
  fontSize: number
  tabSize: number
  maxLines: number
  sound: boolean
  lineNumbers: boolean
  smoothCaret: boolean
  theme: 'dark' | 'monokai' | 'solarized'
}

export type NumericSettingKey = 'fontSize' | 'tabSize' | 'maxLines'
export type BooleanSettingKey = 'sound' | 'lineNumbers' | 'smoothCaret'
export type ThemeKey = 'dark' | 'monokai' | 'solarized'
