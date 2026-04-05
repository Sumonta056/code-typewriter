# Project Rules & Patterns

Conventions, patterns, and rules that govern how this codebase is structured and extended.

---

## 1. Framework & Runtime Rules

| Rule                         | Detail                                                                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SSR is disabled**          | `ssr: false` in `nuxt.config.ts`. The app is a pure client-side SPA. Never assume server context.                                                                    |
| **Client-only guards**       | Any code that touches `window`, `localStorage`, `document`, or Web APIs must be guarded with `import.meta.client` or run inside `onMounted`.                         |
| **No server routes**         | There are no Nuxt server routes or API handlers. All data fetching hits external URLs directly from the browser.                                                     |
| **Plugin bootstraps stores** | `client-init.plugin.ts` is the single entry point for hydrating state from `localStorage` and fetching `snippets.json`. Do not load stores anywhere else on startup. |

---

## 2. State Management Rules (Pinia)

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

---

## 3. Composable Rules

- **Composables are pure logic units.** They must not contain template markup or direct DOM queries (except `useScrollTracker` which must operate on refs passed in from the component).
- **`useTypingEngine` is the orchestrator.** It is the only composable that coordinates between stores and other composables. Pages call `useTypingEngine`; they do not call `useGithubFetcher` or `useTokenizer` directly.
- **Single instance per composable call.** Composables like `useTypingStats` maintain local `ref` state (timer intervals, stat values). Each call to `useTypingEngine` creates its own set of stats. Do not share composable instances across components via a module-level singleton — use Pinia stores for shared global state instead.
- **Cleanup is explicit.** If a composable uses `setInterval` or `setTimeout`, it must expose a `stop`/`cleanup` function. The calling page must invoke it in `onUnmounted`.
- **`requestAnimationFrame` for scroll.** `useScrollTracker` wraps all scroll mutations in `rAF` and cancels the previous frame before scheduling a new one to avoid layout thrashing.

---

## 4. Component Rules

### Naming

| Pattern                                                   | Example                                                 |
| --------------------------------------------------------- | ------------------------------------------------------- |
| Components are PascalCase files grouped by feature folder | `components/editor/CodeDisplay.vue`                     |
| Auto-import prefix matches folder name                    | `EditorCodeDisplay`, `StatsLiveStats`, `PanelsUrlPanel` |
| Generic, reusable primitives live in `components/ui/`     | `BaseButton`, `IconButton`, `HiddenInput`               |
| App-level shell components live in `components/app/`      | `AppHeader`, `AppLogo`, `AppScanlines`                  |

### Props & Events

- **Props are read-only.** Components never mutate their own props. All mutations go through emitted events back to the parent or directly to a store.
- **Emit before store.** If a component needs to trigger state change, it emits an event. The page wires the event to the store or engine. Components do not import stores directly unless they are "smart" page-level components.
- **Boolean props default to `false`.** All boolean props should be explicitly typed and default to `false`.

### Scoped Styles

- All component styles are `<style scoped>`. There are no unscoped `<style>` blocks inside components.
- Global design tokens are CSS custom properties defined in `assets/css/variables.css` and consumed everywhere via `var(--token-name)`.
- Responsive breakpoints:
  - Mobile: `max-width: 768px`
  - Wide layout (editor + sidebar): `min-width: 1200px`
- **`deep()` selectors** are used in `pages/index.vue` to override child component styles for the sidebar context. This is intentional and acceptable only at the page level.

---

## 5. Typing Engine Rules

- **Tab expansion before session setup.** Tabs in fetched code are replaced with spaces (count = `settingsStore.settings.tabSize`) before being stored. The user always types `Space`, never `Tab`.
- **Comparison is character-exact.** `processChar` compares the typed character against `typingStore.code[currentIndex]` with strict equality. No tolerance, no autocorrect.
- **Backspace can only undo one character at a time.** Ctrl+Backspace (word delete) is not supported. Modifier keys are filtered out by `useKeyboardHandler`.
- **The timer starts on the first keystroke,** not when the file loads. `startTime` is `null` until the first call to `startTimer()`.
- **Stats tick every 200ms** via `setInterval` while the session is active. The interval is stopped on completion and on cleanup.
- **Results are shown after a 350ms delay** post-completion to allow the last character's state transition animation to finish before the overlay appears.
- **WPM formula:** `(correctChars / 5) / elapsedMinutes`. The standard "5 characters = 1 word" convention is used. Raw WPM uses total keystrokes instead of correct chars.

---

## 6. GitHub Fetcher Rules

- **API-first, raw fallback.** `useGithubFetcher` tries the GitHub Contents API (`Accept: application/vnd.github.v3.raw`) first, then falls back to `raw.githubusercontent.com`. This avoids CORS issues on private repos while remaining resilient.
- **URL normalisation.** `parseGitHubUrl` accepts all three common GitHub URL formats: browser URL (`github.com/…/blob/…`), raw URL (`raw.githubusercontent.com/…`), and plain `owner/repo/branch/path` paths.
- **Line limit is enforced.** Code is sliced to `maxLines` (from settings, default 50) before being passed to the tokenizer.
- **Line endings are normalised.** `\r\n` and `\r` are both converted to `\n` before processing.
- **Trailing whitespace is stripped per line** using `trimEnd()` so the user never has to type invisible trailing spaces.

---

## 7. Tokenizer Rules

- **Token array is parallel to the code string.** `tokenize(code)` returns an array of `TokenType` values with length === `code.length`. Index `i` in the token array maps to character `i` in the code string.
- **Single-pass, character-by-character.** The tokenizer is a hand-written scanner (not a regex replace chain) for performance and predictability.
- **Token priority order (highest to lowest):**
  1. Line comments (`//`)
  2. Block comments (`/* */`)
  3. String literals (`'`, `"`, `` ` ``)
  4. Numeric literals (decimal, hex `0x`, binary `0b`, bigint `n`)
  5. HTML/JSX tags (`<TagName ...>`)
  6. Decorators (`@decorator`)
  7. Identifiers → classified as: `control`, `boolean`, `null`, `import`, `keyword`, `builtin`, `type` (PascalCase), `func-call` (followed by `(`), `property` (after `.`)
  8. Operators (`=+-*/<>!&|?:^%~`)
  9. Brackets `()[]`, Braces `{}`, Punctuation `.,;`
- **No runtime dependencies.** The tokenizer has zero imports beyond the project's own `TokenType`. Do not introduce a third-party syntax highlighter (Prism, Shiki, etc.) — this is intentional to keep the bundle minimal.

---

## 8. Settings Rules

| Setting       | Type    | Default | Min | Max | Persisted |
| ------------- | ------- | ------- | --- | --- | --------- |
| `fontSize`    | number  | 14      | 10  | 24  | yes       |
| `tabSize`     | number  | 2       | 1   | 8   | yes       |
| `maxLines`    | number  | 50      | 10  | 200 | yes       |
| `sound`       | boolean | false   | —   | —   | yes       |
| `lineNumbers` | boolean | true    | —   | —   | yes       |
| `smoothCaret` | boolean | true    | —   | —   | yes       |

- Settings are persisted to `localStorage` on every change (not debounced).
- `fontSize` and `tabSize` changes immediately write `--code-font-size` and `--code-tab-size` CSS custom properties to `document.documentElement` via `applyCssVariables()`.
- Clamp logic for numeric settings is centralised in `NUMERIC_LIMITS` in `settings.ts`. Add new numeric settings there, not in the component.

---

## 9. History & Profile Rules

- Each completed session generates one `HistoryEntry` with a `crypto.randomUUID()` id.
- History is never merged or deduped — all sessions are recorded independently.
- Streak calculation counts calendar days (ISO date `YYYY-MM-DD`), not sessions. Multiple sessions on the same day count as one streak day.
- `languageStats` aggregates history by `language` field (matches `snippetsStore.selectedLanguageId` at session end).
- The profile page (`pages/profile.vue`) reads directly from `historyStore` computed properties — it does not fetch or transform data itself.

---

## 10. Adding New Languages / Snippets

1. Open `public/snippets.json`.
2. To add a new **language**, append to the `languages` array:
   ```json
   {
     "id": "python",
     "name": "Python",
     "extension": ".py",
     "files": [{ "name": "My Snippet", "url": "https://raw.githubusercontent.com/..." }]
   }
   ```
3. To add a new **file** to an existing language, push to that language's `files` array.
4. The `id` field becomes the value stored in history entries under `language`. Keep it lowercase and stable.
5. No code changes are required — the `SnippetsStore` and `LanguageSelector` component pick up new entries automatically on next load.

---

## 11. CSS Token Reference

Defined in `assets/css/variables.css`. Always use these tokens — never hardcode colors or sizes.

| Category    | Token                                  | Usage                                           |
| ----------- | -------------------------------------- | ----------------------------------------------- |
| Background  | `--bg`, `--bg-surface`, `--bg-hover`   | Page, card, hover states                        |
| Text        | `--text`, `--text-dim`, `--text-faint` | Primary, secondary, muted text                  |
| Accent      | `--accent`, `--accent-dim`             | Cursor, active states                           |
| Correct     | `--correct`                            | Correctly typed characters                      |
| Incorrect   | `--incorrect`                          | Incorrectly typed characters                    |
| Pending     | `--pending`                            | Not-yet-typed characters                        |
| Border      | `--border`                             | Dividers, component outlines                    |
| Radius      | `--radius`                             | Shared border-radius                            |
| Font (UI)   | `--font-ui`                            | All UI labels (Space Grotesk)                   |
| Font (Code) | `--font-code`                          | Code display and monospace elements (Fira Code) |
