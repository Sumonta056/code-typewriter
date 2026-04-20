import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.ts',
    './app.vue',
  ],
  corePlugins: {
    preflight: false, // Keep our own base.css resets
  },
  theme: {
    extend: {
      colors: {
        'bg-root': 'var(--bg-root)',
        'bg-main': 'var(--bg-main)',
        'bg-surface': 'var(--bg-surface)',
        'bg-raised': 'var(--bg-raised)',
        'bg-hover': 'var(--bg-hover)',
        'bg-overlay': 'var(--bg-overlay)',
        'c-border': 'var(--border)',
        'c-border-lit': 'var(--border-lit)',
        'c-text': 'var(--text)',
        'c-text-dim': 'var(--text-dim)',
        'c-text-faint': 'var(--text-faint)',
        'c-accent': 'var(--accent)',
        'c-green': 'var(--green)',
        'c-red': 'var(--red)',
        'c-purple': 'var(--purple)',
        'c-yellow': 'var(--yellow)',
        'c-orange': 'var(--orange)',
      },
      fontFamily: {
        code: 'var(--font-code)',
        ui: 'var(--font-ui)',
      },
      borderRadius: {
        base: 'var(--radius)',
        lg: 'var(--radius-lg)',
      },
    },
  },
} satisfies Config
