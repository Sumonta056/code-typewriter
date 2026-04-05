# Code Typewriter — Nuxt 3 Migration Plan

## Context
The Code Typewriter project is currently a single-page vanilla HTML/CSS/JS app (4 files, ~2,200 lines). It lets users practice typing real code fetched from GitHub, with syntax highlighting, live stats, and settings. The goal is to migrate to **Nuxt 3 + Vue 3 (Composition API) + TypeScript + Pinia**, following best practices, keeping every component under 200-300 lines, adding a Profile page, and ensuring buttery smooth performance and accessibility.

---

## Directory Structure

```
code-typewriter/
├── nuxt.config.ts
├── tsconfig.json
├── package.json
├── app.vue
├── assets/css/
│   ├── variables.css          # CSS custom properties (palette, fonts, syntax colors)
│   ├── base.css               # Reset, body, scrollbar, keyframes, reduced-motion
│   └── transitions.css        # Vue <Transition> classes
├── public/
│   └── snippets.json          # Unchanged from current
├── types/
│   ├── index.ts               # Re-exports
│   ├── snippet.ts             # Language, SnippetFile, SnippetsData
│   ├── typing.ts              # CharState, TokenType, SessionResult
│   ├── settings.ts            # AppSettings, NumericSettingKey, BooleanSettingKey
│   └── profile.ts             # HistoryEntry, ProfileStats
├── composables/
│   ├── useTokenizer.ts        # Syntax tokenizer (pure function)
│   ├── useTypingEngine.ts     # processChar, backspace, setupSession, reset
│   ├── useGithubFetcher.ts    # URL parser + API/raw fetch with CORS
│   ├── useAudio.ts            # Lazy AudioContext key sound
│   ├── useTypingStats.ts      # Live WPM/accuracy/time/progress (200ms interval)
│   ├── useScrollTracker.ts    # Auto-scroll to current char
│   └── useKeyboardHandler.ts  # Keydown → normalized char/backspace
├── stores/
│   ├── typing.ts              # Session state (code, charStates, index, errors, timing)
│   ├── settings.ts            # 6 settings + localStorage persistence
│   ├── snippets.ts            # Languages, selected language, random file picker
│   └── history.ts             # Completed sessions (for Profile page)
├── components/
│   ├── app/
│   │   ├── AppHeader.vue      # Logo + live stats (~40 lines)
│   │   ├── AppLogo.vue        # Terminal dots + "codetype" + version (~35 lines)
│   │   └── AppScanlines.vue   # CRT overlay (~10 lines)
│   ├── toolbar/
│   │   ├── ToolbarMain.vue    # Container: languages + actions (~30 lines)
│   │   ├── LanguageSelector.vue # Language pill buttons (~50 lines)
│   │   ├── ToolbarActions.vue # URL/settings/random/reset buttons (~60 lines)
│   │   └── IconButton.vue     # Reusable icon button (~25 lines)
│   ├── panels/
│   │   ├── UrlPanel.vue       # Collapsible GitHub URL input (~55 lines)
│   │   ├── SettingsPanel.vue  # Collapsible settings grid (~45 lines)
│   │   ├── SettingNumeric.vue # +/value/- control (~40 lines)
│   │   └── SettingToggle.vue  # ON/OFF switch (~35 lines)
│   ├── editor/
│   │   ├── EditorFrame.vue    # Outer border/shadow wrapper (~20 lines)
│   │   ├── FileTabBar.vue     # File tab + progress badge (~40 lines)
│   │   ├── TypingContainer.vue # Switches placeholder ↔ code display (~35 lines)
│   │   ├── TypingPlaceholder.vue # ASCII art + instructions (~30 lines)
│   │   ├── CodeDisplay.vue    # Line numbers + per-char spans (THE critical component ~150 lines)
│   │   ├── LineNumbers.vue    # Line number gutter (~25 lines)
│   │   └── ProgressTrack.vue  # Thin gradient bar below editor (~20 lines)
│   ├── stats/
│   │   ├── LiveStats.vue      # 4 stat blocks with dividers (~55 lines)
│   │   ├── StatBlock.vue      # Value + label + optional bar (~35 lines)
│   │   └── StatBar.vue        # Thin animated width bar (~15 lines)
│   ├── results/
│   │   ├── ResultsOverlay.vue # Fullscreen backdrop + transitions (~30 lines)
│   │   ├── ResultsCard.vue    # Hero WPM, 6-stat grid, actions (~90 lines)
│   │   └── ResultItem.vue     # Icon + value + label (~25 lines)
│   ├── overlay/
│   │   └── LoadingOverlay.vue # Spinner + "Fetching..." (~35 lines)
│   └── ui/
│       ├── BaseButton.vue     # glow/dim variants (~30 lines)
│       └── HiddenInput.vue    # Offscreen textarea for keystrokes (~30 lines)
├── pages/
│   ├── index.vue              # Main typing page (~120 lines)
│   └── profile.vue            # History + aggregate stats (~180 lines)
├── layouts/
│   └── default.vue            # Scanlines + nav + <slot /> (~30 lines)
└── plugins/
    └── client-init.plugin.ts  # Client-only: load snippets, restore settings (~20 lines)
```

**Total: ~42 files | Each component 10-150 lines (well under 300 limit)**

---

## Pinia Stores

### `stores/typing.ts` — Session State
- **State**: `code`, `fileName`, `fileUrl`, `tokens: TokenType[]`, `charStates: CharState[]` (shallowRef), `currentIndex`, `totalErrors`, `totalKeystrokes`, `startTime`, `isComplete`, `isActive`
- **Getters**: `currentChar`, `progressPercent`, `charCount`, `isSessionReady`
- **Actions**: `setupSession()`, `advanceCorrect()`, `advanceIncorrect()`, `goBack()`, `markComplete()`, `reset()`

### `stores/settings.ts` — User Preferences
- **State**: `fontSize` (14), `tabSize` (2), `maxLines` (50), `sound` (false), `lineNumbers` (true), `smoothCaret` (true)
- **Actions**: `updateNumeric()`, `toggleBoolean()`, `loadFromStorage()`, `saveToStorage()`, `applyCssVariables()`
- **Persistence**: `localStorage` key `codeTypeSettings`, synced via watcher

### `stores/snippets.ts` — Language Data
- **State**: `languages[]`, `selectedLanguageId`, `isLoaded`
- **Actions**: `loadSnippets()`, `selectLanguage()`
- **Getters**: `selectedLanguage`, `randomFile`

### `stores/history.ts` — Typing History (NEW)
- **State**: `entries: HistoryEntry[]`
- **Actions**: `addEntry()`, `clearHistory()`
- **Getters**: `averageWpm`, `bestWpm`, `averageAccuracy`, `totalSessions`, `recentEntries()`, `wpmOverTime`
- **Persistence**: `localStorage` key `codeTypeHistory`

---

## Composables — Migration Mapping

| Composable | Source (app.js lines) | Key exports |
|---|---|---|
| `useTokenizer.ts` | 309-517 | `tokenize(code): TokenType[]` |
| `useTypingEngine.ts` | 274-306, 572-628 | `setupSession()`, `processCharacter()`, `handleBackspace()`, `reset()` |
| `useGithubFetcher.ts` | 101-210 | `isLoading`, `parseGitHubUrl()`, `fetchCode()` |
| `useAudio.ts` | 80-94 | `playKeySound()` |
| `useTypingStats.ts` | 665-724 | `wpm`, `accuracy`, `elapsedFormatted`, `progress`, `cpm`, `rawWpm`, `startTimer()`, `stopTimer()` |
| `useScrollTracker.ts` | 644-662 | `scrollToIndex()` |
| `useKeyboardHandler.ts` | 544-569 | `handleKeyDown()` |

---

## Performance Strategy

1. **Do NOT use a Vue component per character.** Use `v-for` on a flat `{ char, class }[]` array rendering `<span>` elements directly in `CodeDisplay.vue`. Each span's class string is pre-computed in the store getter.
2. **`shallowRef`** for `charStates[]` array — avoid deep reactivity on 2000+ items.
3. **200ms setInterval** for live stats — NOT reactive per-keystroke computation.
4. **`requestAnimationFrame`** for scroll tracking during rapid typing.
5. **Lazy AudioContext** — created on first keystroke only.
6. **SSR-safe**: All typing/audio/localStorage logic runs client-only via `onMounted` or `import.meta.client` guards.

---

## Accessibility Plan

- **EditorFrame**: `role="application"`, `aria-label="Code typing practice area"`
- **HiddenInput**: `aria-label="Type the displayed code here"`
- **LiveStats**: `role="status"`, `aria-live="polite"`
- **ResultsOverlay**: `role="dialog"`, `aria-modal="true"`, focus trap to Retry button on open
- **LoadingOverlay**: `role="alert"`, `aria-live="assertive"`
- **LanguageSelector**: `role="radiogroup"` with `role="radio"` + `aria-checked` per button
- **SettingToggle**: `role="switch"`, `aria-checked`
- **ProgressTrack**: `role="progressbar"`, `aria-valuenow`
- **Focus management**: Auto-focus hidden input on session start; trap focus in results dialog; Escape closes panels
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables cursor blink, transitions, scanlines

---

## Styling Approach

- **Global**: `variables.css` (all CSS vars + syntax colors), `base.css` (reset, body, scrollbar, keyframes), `transitions.css`
- **Components**: Each uses `<style scoped>` — co-located, no collisions, stays under 80 lines of CSS per component
- **Syntax colors**: Defined as CSS vars in `variables.css`, applied via scoped `.char.correct.syn-keyword` etc. in `CodeDisplay.vue`
- **Fonts**: Google Fonts loaded via `nuxt.config.ts` `app.head.link`

---

## Pages

### `pages/index.vue` (~120 lines)
Main typing page. Composes: AppHeader, ToolbarMain, UrlPanel, SettingsPanel, FileTabBar, EditorFrame > TypingContainer, ProgressTrack, HiddenInput, ResultsOverlay, LoadingOverlay. Local state: `urlOpen`, `settingsOpen`. Orchestrates composables.

### `pages/profile.vue` (~180 lines)
**NEW page.** Shows:
- Summary cards: total sessions, average WPM, best WPM, average accuracy
- Table of recent sessions (file, language, WPM, accuracy, time, date)
- "Clear History" button with confirmation
- Nav link back to home

---

## Implementation Order

| Step | What | Depends on |
|---|---|---|
| 1 | Scaffold Nuxt + install Pinia + create dirs + `nuxt.config.ts` | — |
| 2 | TypeScript types (`types/`) | — |
| 3 | Global CSS (`assets/css/`) | — |
| 4 | Pinia stores (settings → snippets → typing → history) | types |
| 5 | Pure composables (`useTokenizer`, `useAudio`) | types |
| 6 | Layout + base components (`default.vue`, `AppScanlines`, `AppLogo`, `BaseButton`, `IconButton`) | CSS |
| 7 | `AppHeader` + toolbar + panels | stores, base components |
| 8 | `useGithubFetcher` composable | types |
| 9 | Editor components (`FileTabBar`, `TypingPlaceholder`, `LineNumbers`, `CodeDisplay`, `TypingContainer`, `EditorFrame`, `ProgressTrack`) | stores, tokenizer |
| 10 | Typing engine (`useTypingEngine`, `useKeyboardHandler`, `useScrollTracker`, `HiddenInput`) | stores, editor |
| 11 | Stats (`useTypingStats`, `StatBar`, `StatBlock`, `LiveStats`) | stores |
| 12 | Results (`ResultItem`, `ResultsCard`, `ResultsOverlay`) | stores, stats |
| 13 | `LoadingOverlay` | — |
| 14 | Wire `pages/index.vue` | all above |
| 15 | `pages/profile.vue` + history store integration | history store |
| 16 | Accessibility pass (ARIA, focus traps, reduced motion) | all above |
| 17 | Performance tuning + testing | all above |

---

## Verification

1. **Dev server**: `npm run dev` — page loads, no SSR errors
2. **Language selector**: Click each language — active state toggles correctly
3. **Random File**: Click — loading overlay appears, code loads with syntax highlighting, file tab updates
4. **Typing**: Characters match expected, correct = syntax color at full brightness, incorrect = red underline
5. **Enter key**: Pressing Enter matches `\n` in code (the old bug must stay fixed)
6. **Backspace**: Reverts char to pending state with dimmed syntax color
7. **Live stats**: WPM, accuracy, time, progress update every 200ms during typing
8. **Completion**: Results overlay appears with correct WPM, accuracy, time, chars, errors, CPM, raw WPM
9. **Retry/New File**: Both buttons work from results overlay
10. **URL input**: Paste GitHub URL → fetches and loads code correctly
11. **Settings**: Font size, tab size, max lines adjust live; toggles work; persists across refresh
12. **Profile page**: Navigate to `/profile`, see session history after completing a typing session
13. **Accessibility**: Tab through all controls, Escape closes panels, screen reader announces results
14. **Performance**: Type rapidly for 30+ seconds — no jank, no memory growth, smooth scrolling
15. **Build**: `npm run build` succeeds with no TypeScript errors

---

## Source Files
- `/Users/cefalo_1/Documents/Projects/code-typewriter/app.js` (862 lines) — all logic to decompose
- `/Users/cefalo_1/Documents/Projects/code-typewriter/style.css` (1035 lines) — styles to split
- `/Users/cefalo_1/Documents/Projects/code-typewriter/index.html` (238 lines) — markup to componentize
- `/Users/cefalo_1/Documents/Projects/code-typewriter/snippets.json` (58 lines) — moves to `public/` unchanged
