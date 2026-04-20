# CLAUDE.md

A client-side typing practice app where you type real source code files fetched live from GitHub. Pick a language → a real file loads → type it character by character → get WPM/accuracy stats. No backend, no accounts — everything persists to `localStorage`.

### Tech Stack

- Framework: Nuxt 3 SPA (`ssr: false`) with ESLint + Prettier
- UI: Vue 3 Composition API (`<script setup lang="ts">`)
- State: Pinia (setup-style stores)
- Styling: Tailwind CSS + CSS custom properties (no scoped styles)
- Persistence: `localStorage` only
- Tokenizer: Custom-built (no syntax highlighting library)

### Key Patterns

- `liveStats.ts` — write-only bucket updated every 200 ms by `useTypingStats`, read by nav components
- Custom tokenizer — `utils/tokenizer/tokenize.ts` runs once per file load, produces one `TokenType` per character
- Theming — CSS custom properties in `variables.css`; `utils/themes.ts` writes them onto `document.documentElement` at runtime

### Data Flow

```
Pick language → fetch GitHub file → tokenize → render chars
User types   → keystroke → match char → update charState → re-render only changed span
Every 200ms  → stats loop updates WPM / accuracy / progress
Session done → save to historyStore → show ResultsOverlay
```

## Commands

```bash
npm run dev           # Dev server (auto-syncs snippets, localhost:3000)
npm run build         # Production build (auto-syncs snippets)
npm run sync:snippets # Manual: copy Prototype/snippets.json → public/
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier write
npm run format:check  # Prettier check
```

## Directory responsibilities

- `pages/` — `index.vue` (practice), `profile.vue` (analytics), `about.vue` (info). Use ONE orchestrator composable; no direct store access.
- `components/` — UI grouped by domain. Auto-imported; presentation-only components in `ui/`.
- `composables/` — Reactive logic, one purpose per file. May import stores + utils.
- `stores/` — Pinia setup-style; state + persistence. NO heavy analytics — delegate to `utils/`.
- `utils/` — Pure functions, static data, constants. NO Vue, NO reactivity, NO I/O.
- `types/` — Interfaces and unions.
- `assets/css/` — `variables.css`, `base.css`, `transitions.css`, `components.css`. All component CSS lives in `components.css` (no scoped blocks).

## Hard rules

1. Plan before code. Present the approach, affected files, design decisions. Wait for approval.
2. Ask before acting. Don't run commits, destructive git ops, or large refactors without explicit instruction.
3. No magic numbers. Put them in `utils/constants.ts` and import.
4. Pages stay thin. All handlers, refs, lifecycle → the page's orchestrator composable (e.g. `useIndexPage`).
5. Stores stay thin. Reductions over arrays (averages, trend, heatmap) live in `utils/`, not in `computed` inside a store.
6. Utils stay pure. No Vue imports, no reactivity. Testable with plain JS.
7. One purpose per composable. If a file does two things, split it.
8. CSS variables for every color. Never hardcode hex values anywhere (templates, utils, components.css).
9. No new external dependencies without explicit approval — especially no syntax highlighting, UI kit, or animation libraries.

## Performance-critical — touch carefully

- `components/editor/CodeDisplay.vue` — `v-memo` + stable `:key` per-char render loop.
- `stores/typing.ts` — `shallowRef` / `triggerRef` for `charStates` / `tokens`. Do not wrap in deep reactivity.
- `utils/tokenizer/tokenize.ts` — runs once per file load. Keep under ~50 ms on 50 k chars.
- `composables/useTypingStats.ts` — 200 ms timer. Must clean up via `onScopeDispose`.

## Coding conventions

- Tailwind: use for pure layout / spacing / simple backgrounds.
- Raw CSS in `assets/css/components.css` for interactive states, media queries, animations, pseudo-elements.
- Utils and types: prefer explicit imports for clarity (`import { X } from '~/utils/...'`).
- No unnecessary comments. Only explain non-obvious WHY.
- No speculative abstractions or "while I'm here" cleanups.

> Deep dive: `doc/ARCHITECTURE.md`
