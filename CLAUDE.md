# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands

```bash
npm run dev           # Start dev server at http://localhost:3000
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check
```

## Architecture

**Code Typewriter** is a Nuxt 3 SPA (SSR disabled, `ssr: false`). It is a client-side-only typing tutor where users practice typing real source code fetched directly from GitHub.

### Core Data Flow

1. **Load** — User selects language → `useTypingEngine.loadRandomFile()` → fetch from GitHub via `useGithubFetcher` → tokenize via `useTokenizer` → initialize `typingStore` (charStates, tokens, code)
2. **Type** — Keypress → `HiddenInput` → `useKeyboardHandler` normalizes (Tab→spaces, Enter→`\n`) → `useTypingEngine.processChar()` → `typingStore` updates charStates/currentIndex/errors → `CodeDisplay` re-renders
3. **Stats** — `useTypingStats` polls every 200 ms while active → computes WPM, raw WPM, CPM, accuracy, progress
4. **Complete** — `useTypingEngine.completeTyping()` → saves `HistoryEntry` to `historyStore` (persisted to `localStorage`) → shows `ResultsOverlay`
5. **Profile** — `/profile` reads aggregate data from `historyStore` computed properties

---

## Key Files

| File                                | Role                                                             |
| ----------------------------------- | ---------------------------------------------------------------- |
| `composables/useTypingEngine.ts`    | Central orchestrator — wires all composables and stores          |
| `composables/useTypingStats.ts`     | WPM, raw WPM, CPM, accuracy calculations (200 ms interval)       |
| `composables/useGithubFetcher.ts`   | Parses GitHub URLs, fetches raw file content                     |
| `composables/useTokenizer.ts`       | Custom syntax tokenizer — no external highlighting library       |
| `composables/useKeyboardHandler.ts` | Normalizes Tab / Enter / Backspace for typing input              |
| `composables/useScrollTracker.ts`   | Auto-scrolls editor to keep cursor visible                       |
| `stores/typing.ts`                  | Ephemeral session state (code, charStates, currentIndex, errors) |
| `stores/settings.ts`                | Persisted user preferences (theme, fontSize, tabSize, etc.)      |
| `stores/history.ts`                 | Persisted session history + computed analytics                   |
| `stores/snippets.ts`                | Available languages and files, loaded from `/snippets.json`      |
| `stores/bookmarks.ts`               | Persisted bookmarked files                                       |
| `Prototype/snippets.json`           | **Source of truth** for all languages and GitHub file URLs       |
| `public/snippets.json`              | Runtime copy of the above (what the app actually fetches)        |
| `assets/css/variables.css`          | All CSS custom properties and theme definitions                  |

---

## Stores

### `stores/typing.ts` — ephemeral, not persisted

Active session state only. Cleared on reset or new file load.

Key state: `code`, `fileName`, `fileUrl`, `tokens: TokenType[]`, `charStates: CharState[]`, `currentIndex`, `totalKeystrokes`, `totalErrors`, `startTime`, `isActive`, `isComplete`, `isPaused`, `pausedAt`, `totalPausedMs`

Key actions: `setupSession()`, `advanceCorrect()`, `advanceIncorrect()`, `goBack()`, `markComplete()`, `pause()`, `resume()`, `reset()`

### `stores/settings.ts` — persisted to localStorage

Key state: `fontSize` (10–24), `tabSize` (1–8), `maxLines` (10–200), `lineNumbers: boolean`, `smoothCaret: boolean`, `theme: 'dark' | 'monokai' | 'solarized'`

Key actions: `updateNumeric(key, delta)`, `toggleBoolean(key)`, `setTheme(theme)`, `applyCssVariables()`, `loadFromStorage()`, `saveToStorage()`

Theme switching applies a class to `<html>` and swaps CSS custom properties defined in `variables.css`.

### `stores/history.ts` — persisted to localStorage

Stores array of `HistoryEntry`. Provides computed analytics: `totalSessions`, `averageWpm`, `bestWpm`, `averageAccuracy`, `totalPracticeSeconds`, `wpmTrend` (last 20), `languageStats`, `calendarData` (52-week heatmap), `errorHeatmap`, `currentStreak`, `longestStreak`.

### `stores/snippets.ts` — fetched, not persisted

Loads `/snippets.json` on first use. Key state: `languages: Language[]`, `selectedLanguageId`. Key actions: `loadSnippets()`, `selectLanguage(id)`, `getRandomFile()`.

### `stores/bookmarks.ts` — persisted to localStorage

Stores `BookmarkedFile[]` with `url`, `name`, `language`. Actions: `toggle(file)`, `remove(url)`, `isBookmarked(url)`.

---

## Composables

### `useTypingEngine.ts`

The single entry point for all typing session logic. Coordinates between stores and other composables. The main page (`pages/index.vue`) calls this composable — it does not access stores directly.

Key functions: `loadCode(url, name)`, `loadRandomFile()`, `processChar(char)`, `processBackspace()`, `togglePause()`, `completeTyping()`, `reset()`, `retry()`

### `useTypingStats.ts`

Runs a `setInterval` at 200 ms to compute live stats from `typingStore`. Returns reactive refs: `wpm`, `rawWpm`, `cpm`, `accuracy`, `progressPercent`, `elapsedFormatted`, `accuracyHistory`.

WPM formula: `(correctChars / 5) / elapsedMinutes`

### `useGithubFetcher.ts`

`parseGitHubUrl(url)` → extracts owner, repo, branch, path. `fetchCode(url)` → tries GitHub API first, falls back to `raw.githubusercontent.com`. Strips CR, trailing whitespace, and truncates to `maxLines` setting.

### `useTokenizer.ts`

Returns `TokenType[]` for every character in the code string. Custom implementation — no Prism, Highlight.js, or external dependencies. Handles 24 token types: `plain`, `keyword`, `control`, `string`, `number`, `comment`, `func-call`, `type`, `builtin`, `operator`, `bracket`, `brace`, `punctuation`, `property`, `boolean`, `null`, `import`, `decorator`, `tag-bracket`, `tag-name`, `tag-attr`, `tag-attr-special`.

### `useKeyboardHandler.ts`

Converts raw `KeyboardEvent` into a normalized string or action. Tab → `' '.repeat(tabSize)`. Enter → `'\n'`. Backspace → calls `processBackspace()`. Meta/Alt/Ctrl keys are ignored.

### `useScrollTracker.ts`

Exposes `scrollToCurrent(el)` — given the code display element and current character index, scrolls to keep the cursor line in view.

---

## Component Structure

Components are grouped by concern under `components/`:

| Directory  | Contents                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `app/`     | `AppLogo`, `AppScanlines` (decorative overlay)                                                                     |
| `editor/`  | `EditorFrame`, `TypingContainer`, `CodeDisplay`, `LineNumbers`, `FileTabBar`, `ProgressTrack`, `TypingPlaceholder` |
| `toolbar/` | `LanguageSelector`, `ToolbarActions`                                                                               |
| `panels/`  | `SettingsPanel`, `SettingToggle`, `SettingNumeric`, `UrlPanel`                                                     |
| `results/` | `ResultsOverlay`, `ResultsCard`, `ResultItem`                                                                      |
| `stats/`   | `LiveStats`, `StatBar`, `StatBlock`, `AccuracySparkline`                                                           |
| `overlay/` | `LoadingOverlay`                                                                                                   |
| `ui/`      | `BaseButton`, `IconButton`, `HiddenInput`                                                                          |

### CodeDisplay

The most complex component. Renders code character-by-character applying two CSS classes per character: one for syntax token type (`token-keyword`, `token-comment`, etc.) and one for typing state (`state-pending`, `state-correct`, `state-incorrect`). The caret is a pseudo-element on the current character. Do not change the character rendering loop without considering performance on large files.

### HiddenInput

An `<input>` positioned off-screen that captures all keyboard events. The editor container click handler focuses it. Do not replace this pattern — it is required for mobile keyboard support.

---

## Types

All types are defined in `types/` and re-exported from `types/index.ts`.

```typescript
// types/typing.ts
type CharState = 'pending' | 'correct' | 'incorrect'
type TokenType =
  | 'plain'
  | 'keyword'
  | 'control'
  | 'string'
  | 'number'
  | 'comment'
  | 'func-call'
  | 'type'
  | 'builtin'
  | 'operator'
  | 'bracket'
  | 'brace'
  | 'punctuation'
  | 'property'
  | 'boolean'
  | 'null'
  | 'import'
  | 'decorator'
  | 'tag-bracket'
  | 'tag-name'
  | 'tag-attr'
  | 'tag-attr-special'
interface SessionResult {
  wpm
  rawWpm
  cpm
  accuracy
  time
  elapsedSeconds
  chars
  errors
  fileName
  fileUrl
  language
  date
}

// types/settings.ts
interface AppSettings {
  fontSize
  tabSize
  maxLines
  lineNumbers
  smoothCaret
  theme
}
type ThemeKey = 'dark' | 'monokai' | 'solarized'

// types/snippet.ts
interface SnippetFile {
  name: string
  url: string
}
interface Language {
  id
  name
  extension
  files: SnippetFile[]
}
interface SnippetsData {
  languages: Language[]
}

// types/profile.ts
interface HistoryEntry {
  id
  fileName
  language
  wpm
  rawWpm
  cpm
  accuracy
  elapsedSeconds
  time
  chars
  errors
  date
  errorMap?
}
interface LanguageStat {
  id
  sessions
  avgWpm
  bestWpm
  avgAccuracy
  totalChars
}
```

---

## CSS and Theming

`assets/css/variables.css` — defines all CSS custom properties under three theme classes: `.theme-dark`, `.theme-monokai`, `.theme-solarized`. Variables cover background colors, text colors, syntax token colors, and UI chrome. Never hardcode color values in component styles — always use a CSS variable.

`assets/css/base.css` — global resets, body defaults, scrollbar styling.

`assets/css/transitions.css` — reusable animation and transition definitions.

All component styles are scoped (`<style scoped>`). Global CSS only lives in the three files above.

---

## Adding Languages / Snippets

Edit `Prototype/snippets.json`. This is the **only** file to edit for adding languages or file URLs. After editing, copy the file to `public/snippets.json` so the app picks it up at runtime.

Use raw `githubusercontent.com` URLs, not `github.com` browse URLs. Each language requires: `id` (kebab-case), `name` (display), `extension` (with dot), `files[]` with `name` and `url`.

---

## Coding Conventions

- **Composition API only** — no Options API, no `<script>` without `setup`
- **TypeScript everywhere** — all composables, stores, and components use `.ts` or `<script setup lang="ts">`
- **Pinia stores** — use `defineStore` with setup function style (not options style) where possible
- **No external UI libraries** — no Vuetify, Tailwind, Headless UI, etc.
- **No syntax highlighting libraries** — the custom tokenizer in `useTokenizer.ts` handles all highlighting
- **No backend** — everything is client-side; persistence via `localStorage` only
- **CSS variables for all colors** — never hardcode color hex values in component `<style>` blocks
- **Scoped styles** — all component styles use `<style scoped>`
- **Auto-imports** — Nuxt auto-imports Vue composables (`ref`, `computed`, `watch`, etc.) and composables from `composables/`. Do not import these manually.
