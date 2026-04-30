## State Management Rules (Pinia)

- **All stores use the Composition API style** (`defineStore('id', () => { ... })`). Do not use the Options API style.
- **One store per concern:**
  - `typingStore` — session state only (code, charStates, timers, progress)
  - `settingsStore` — user preferences; persisted to `localStorage` under key `codeTypeSettings`
  - `snippetsStore` — snippet catalogue loaded from `snippets.json`
  - `historyStore` — completed session log; persisted to `localStorage` under key `codeTypeHistory`
- **Stores do not import each other.** Cross-store coordination belongs in `useTypingEngine`, not in a store.
- **`shallowRef` for large arrays.** `charStates` and `tokens` use `shallowRef` + manual `triggerRef()` for performance when mutating array elements in-place. Do not switch these to `ref`.
- **Computed properties, never watchers in stores.** Derived values (e.g. `progressPercent`, `averageWpm`, `languageStats`) are computed properties. Watchers are only used in components or composables when a side-effect is truly needed.
- **History is capped at 100 entries.** `MAX_ENTRIES = 100` in `history.ts`. When the cap is exceeded, the oldest entries are dropped (`slice(-MAX_ENTRIES)`).
