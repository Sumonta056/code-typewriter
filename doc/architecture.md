# Architecture

Canonical reference for the Code Typewriter codebase. Updated 2026-04-20.

---

## 1. What this app is

A client-side-only typing practice app (Nuxt 3 SPA, `ssr: false`). The user picks a language, a real source file is fetched from GitHub, tokenized locally, and rendered character-by-character. Every keystroke is matched against the expected character and updates a live stats overlay. Everything persists to `localStorage` — there is no backend.

---

## 2. Directory layout

| Directory          | Purpose                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ | --- | ------------- | --------------------------------------------------------------------------------------------------------- |
| `pages/`           | Route-level components. Thin — all logic lives in the matching page composable.                                                |
| `layouts/`         | `default.vue` wraps every page with nav + overlays.                                                                            |     | `components/` | UI. Grouped by domain: `app/`, `editor/`, `overlay/`, `panels/`, `results/`, `stats/`, `toolbar/`, `ui/`. |
| `composables/`     | Reusable reactive logic. One purpose per file. May import stores and utils.                                                    |
| `stores/`          | Pinia stores (setup style). Hold ephemeral or persisted state + the mutations that change it. No heavy analytics.              |
| `utils/`           | Pure functions and static data. No Vue imports, no reactivity. Cheaply unit-testable.                                          |
| `utils/tokenizer/` | Syntax tokenizer. `keywords.ts` (word sets) + `tokenize.ts` (scanner) + `index.ts` (re-export).                                |
| `types/`           | TypeScript interfaces and unions. Re-exported from `types/index.ts`.                                                           |
| `assets/css/`      | `variables.css` (CSS custom properties + themes), `base.css` (resets), `transitions.css`, `components.css` (component styles). |
| `plugins/`         | Nuxt plugins. `client-init.plugin.ts` hydrates stores from localStorage on mount.                                              |
| `Prototype/`       | Legacy HTML/JS prototype + the authoritative `snippets.json`. Do not edit `public/snippets.json` directly.                     |
| `public/`          | Static assets. `snippets.json` is auto-copied from `Prototype/` by the `sync:snippets` script.                                 |

---

## 3. Core data flow

```
User picks language
  → snippetsStore.getRandomFile()
  → engine.loadCode(url, name)
    ├─ useGithubFetcher.fetchCode() → raw source
    ├─ utils/tokenizer.tokenize()   → TokenType[] (one per char)
    └─ typingStore.setupSession()   → code, tokens, charStates (all pending)

User types
  → HiddenInput @keydown
  → useIndexPage.onKeyDown()
    ├─ useKeyboardHandler.handleKeyDown() → normalizes Tab/Enter/Backspace
    └─ engine.processChar(ch) | engine.processBackspace()
       └─ typingStore.advanceCorrect | advanceIncorrect | goBack
  → CodeDisplay re-renders (v-memo'd per char)

Stats loop (every 200 ms while active)
  → useTypingStats.update()
  → reactive refs: wpm, rawWpm, cpm, accuracy, progress, accuracyHistory

Session complete
  → engine.completeTyping()
  → historyStore.addEntry()  (persisted)
  → ResultsOverlay shown after RESULTS_SHOW_DELAY_MS
```

---

## 4. Stores

All stores are Pinia setup-style. Keep persistence + state here. Heavy derivations belong in `utils/` or composables.

| Store          | Persisted?   | What it owns                                                                                                                                                                           |
| -------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `typing.ts`    | no           | Active session: `code`, `tokens`, `charStates`, `currentIndex`, `startTime`, `isActive`, pause/resume state                                                                            |
| `settings.ts`  | yes          | `fontSize`, `tabSize`, `maxLines`, `lineNumbers`, `smoothCaret`, `theme`                                                                                                               |
| `history.ts`   | yes          | `entries: HistoryEntry[]`; exposes computed refs (`averageWpm`, `bestWpm`, `wpmTrend`, `calendarData`, `errorHeatmap`, etc.) that call pure functions from `utils/historyAnalytics.ts` |
| `snippets.ts`  | no (fetched) | `languages`, `selectedLanguageId`; loads `public/snippets.json`                                                                                                                        |
| `bookmarks.ts` | yes          | `bookmarks: BookmarkedFile[]`                                                                                                                                                          |
| `liveStats.ts` | no           | Thin data bucket: `wpm`, `accuracy`, `elapsed`, `progress`. Written by `useTypingStats` every 200 ms. Read by nav/component consumers. No math lives here.                             |

---

## 5. Composables

| Composable           | Role                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `useIndexPage`       | Orchestrator for `pages/index.vue`. Owns page handlers, template refs, and lifecycle.     |
| `useTypingEngine`    | Session orchestrator. Wires stores + stats + tokenizer + fetcher. Used by `useIndexPage`. |
| `useTypingStats`     | Live WPM / accuracy / CPM loop. Polls every `STATS_UPDATE_INTERVAL_MS`.                   |
| `useGithubFetcher`   | Parses GitHub URLs, fetches raw content, truncates to `maxLines`.                         |
| `useTokenizer`       | Thin wrapper returning `tokenize` from `utils/tokenizer`.                                 |
| `useKeyboardHandler` | Normalizes Tab→spaces, Enter→`\n`, Backspace→action; ignores Meta/Alt/Ctrl.               |
| `useScrollTracker`   | Keeps the current character visible via rAF-scheduled `scrollTo`.                         |

---

## 6. Pages

| Page          | Role                                                                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.vue`   | Main practice page. Thin shell — delegates entirely to `useIndexPage`. Renders editor, sidebar, URL/settings panels, results overlay.                                              |
| `profile.vue` | Analytics dashboard. Displays WPM trend, calendar heatmap, language breakdown, mistake heatmap, lifetime numbers, recent sessions list, and CSV export. Reads from `historyStore`. |
| `about.vue`   | Static informational page. Explains the app, how it works, privacy model, and donation link. No store access.                                                                      |

---

## 7. Utils

| File                    | Contents                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `constants.ts`          | Timing, window, scroll margin, history limits. No magic numbers elsewhere.         |
| `themes.ts`             | `THEME_VARS` CSS property tables, `THEME_KEYS`, `THEME_OPTIONS`.                   |
| `historyAnalytics.ts`   | Pure analytics over `HistoryEntry[]`: averages, trend, calendar, heatmap, streaks. |
| `tokenizer/keywords.ts` | `KEYWORDS`, `CONTROL`, `BUILTINS`, `IMPORT_KEYWORDS`, literal sets, char strings.  |
| `tokenizer/tokenize.ts` | Pure `tokenize(code)` → `TokenType[]`; per-token scanners.                         |

Utils must stay pure: no Vue imports, no reactivity, no I/O beyond parameters in / value out.

---

## 8. Performance-critical paths

Edits to these require justification and a typing-session smoke test:

- `components/editor/CodeDisplay.vue` — renders one `<span>` per character. Uses `v-memo` + stable `:key` so only changed characters re-render. Never touch the render loop without measuring.
- `utils/tokenizer/tokenize.ts` — runs once per file load. Tokenizing a 50 k-char file should stay under ~50 ms.
- `stores/typing.ts` — the keystroke write path. Uses `shallowRef` + `triggerRef` where appropriate. Do not wrap `charStates`/`tokens` in deep reactivity.
- `composables/useTypingStats.ts` — the only recurring timer. Must clean up via `onScopeDispose`. Do not raise its frequency above 200 ms.

---

## 9. Styling

- CSS custom properties in `variables.css` are the source of truth for every color.
- Three themes live as entries in `utils/themes.ts` → `THEME_VARS`. Theme switch writes the properties onto `document.documentElement`.
- Tailwind is configured (`tailwind.config.ts`) with the CSS variables exposed as color tokens (`bg-bg-main`, `text-c-text`, etc.) and `preflight: false`.
- Prefer Tailwind utilities for pure layout/structural styling (`flex`, `gap`, `items-center`, spacing, simple backgrounds).
- Keep raw CSS in `assets/css/components.css` for interactive states, animations, media queries, and anything that needs pseudo-elements.
- Never hardcode hex colors in templates or components — always reference a CSS variable (directly or via Tailwind token).

---

## 10. Extension points

**Add a language or file** — edit `Prototype/snippets.json`. The `sync:snippets` script copies it into `public/` automatically via `predev`/`prebuild`.

**Add a theme** — append a new key to `utils/themes.ts#THEME_VARS`, add a `THEME_OPTIONS` entry, widen the `ThemeKey` union in `types/settings.ts`, and add a matching `.theme-<key>` class in `variables.css` if present.

**Add a component** — place it under the matching domain directory. If no match, create a new group (e.g. `components/overlay/`). Keep presentation-only components in `ui/`. Export via auto-import (no manual imports needed).

**Add a composable** — one purpose per file. Use `onScopeDispose` for cleanup. If the logic is pure, put it in `utils/` instead.

**Add a magic number** — put it in `utils/constants.ts` and import from there.

---

## 11. Coding conventions

- `<script setup lang="ts">` only; no Options API.
- Pinia stores use the setup function form.
- No external UI libraries. Tailwind is the only CSS framework.
- No syntax highlighting libraries — the custom tokenizer is authoritative.
- No backend; persistence is localStorage only.
- Scoped `<style>` blocks are not used — all component CSS lives in `assets/css/components.css`.
- Pages are thin: one orchestrator composable per page (`useIndexPage`, etc.).
- Stores do not compute heavy analytics — delegate to `utils/`.
