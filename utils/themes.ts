import type { ThemeKey } from '~/types'

export const THEME_VARS: Record<ThemeKey, Record<string, string>> = {
  dark: {
    '--bg-root': '#06080f',
    '--bg-main': '#0c1018',
    '--bg-surface': '#111623',
    '--bg-raised': '#161c2e',
    '--bg-hover': '#1b2340',
    '--border': '#1c2438',
    '--border-lit': '#2a3555',
    '--text': '#c9d1d9',
    '--text-dim': '#6e7a91',
    '--text-faint': '#3a4560',
    '--accent': '#58a6ff',
    '--accent-rgb': '88, 166, 255',
    '--green': '#3fb950',
    '--green-rgb': '63, 185, 80',
    '--red': '#f85149',
    '--red-rgb': '248, 81, 73',
    '--purple': '#bc8cff',
    '--purple-rgb': '188, 140, 255',
    '--yellow': '#d29922',
    '--orange': '#db6d28',
  },
  monokai: {
    '--bg-root': '#1a1a1a',
    '--bg-main': '#272822',
    '--bg-surface': '#2d2d2d',
    '--bg-raised': '#3e3d32',
    '--bg-hover': '#49483e',
    '--border': '#3e3d32',
    '--border-lit': '#75715e',
    '--text': '#f8f8f2',
    '--text-dim': '#a59f85',
    '--text-faint': '#75715e',
    '--accent': '#66d9e8',
    '--accent-rgb': '102, 217, 232',
    '--green': '#a6e22e',
    '--green-rgb': '166, 226, 46',
    '--red': '#f92672',
    '--red-rgb': '249, 38, 114',
    '--purple': '#ae81ff',
    '--purple-rgb': '174, 129, 255',
    '--yellow': '#e6db74',
    '--orange': '#fd971f',
  },
  solarized: {
    '--bg-root': '#001e26',
    '--bg-main': '#002b36',
    '--bg-surface': '#073642',
    '--bg-raised': '#0d3d4f',
    '--bg-hover': '#124a5c',
    '--border': '#124a5c',
    '--border-lit': '#2a6477',
    '--text': '#839496',
    '--text-dim': '#657b83',
    '--text-faint': '#586e75',
    '--accent': '#268bd2',
    '--accent-rgb': '38, 139, 210',
    '--green': '#859900',
    '--green-rgb': '133, 153, 0',
    '--red': '#dc322f',
    '--red-rgb': '220, 50, 47',
    '--purple': '#6c71c4',
    '--purple-rgb': '108, 113, 196',
    '--yellow': '#b58900',
    '--orange': '#cb4b16',
  },
}

export const THEME_KEYS: ThemeKey[] = ['dark', 'monokai', 'solarized']

export interface ThemeOption {
  id: ThemeKey
  label: string
  color: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'dark', label: 'Dark', color: '#58a6ff' },
  { id: 'monokai', label: 'Monokai', color: '#a6e22e' },
  { id: 'solarized', label: 'Solarized', color: '#268bd2' },
]
