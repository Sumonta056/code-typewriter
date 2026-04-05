export interface AppSettings {
  fontSize: number
  tabSize: number
  maxLines: number
  sound: boolean
  lineNumbers: boolean
  smoothCaret: boolean
}

export type NumericSettingKey = 'fontSize' | 'tabSize' | 'maxLines'
export type BooleanSettingKey = 'sound' | 'lineNumbers' | 'smoothCaret'
