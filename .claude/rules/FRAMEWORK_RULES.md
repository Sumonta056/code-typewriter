## Framework & Runtime Rules

- **SSR is disabled**: `ssr: false` in `nuxt.config.ts`. The app is a pure client-side SPA. Never assume server context.
- **Client-only guards**: Any code that touches `window`, `localStorage`, `document`, or Web APIs must be guarded with `import.meta.client` or run inside `onMounted`.
- **No server routes**: There are no Nuxt server routes or API handlers. All data fetching hits external URLs directly from the browser.
- **Plugin bootstraps stores**: `client-init.plugin.ts` is the single entry point for hydrating state from `localStorage` and fetching `snippets.json`. Do not load stores anywhere else on startup.
