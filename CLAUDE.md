# CLAUDE.md

Guidance for Claude Code when working in this repo. Keep it short — the long-form description lives in `doc/ARCHITECTURE.md`. Read that first if the task is non-trivial.

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

## Architecture pointer

- What/why/data flow: **`doc/ARCHITECTURE.md`** — authoritative.
- High-level: Nuxt 3 SPA (`ssr: false`), Pinia, Tailwind + CSS variables, custom tokenizer, no backend, localStorage persistence.

## Directory responsibilities

| Directory      | Holds                                                            | Import rules                                                   |
| -------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| `pages/`       | Thin route entries                                               | Use ONE orchestrator composable; no store access               |
| `layouts/`     | `default.vue`                                                    | —                                                              |
| `components/`  | UI grouped by domain                                             | Auto-imported; presentation-only in `ui/`                      |
| `composables/` | Reactive logic, one purpose per file                             | May import stores + utils                                      |
| `stores/`      | Pinia setup-style; state + persistence                           | NO heavy analytics — delegate to `utils/`                      |
| `utils/`       | Pure functions, static data, constants                           | NO Vue, NO reactivity, NO I/O                                  |
| `types/`       | Interfaces and unions                                            | —                                                              |
| `assets/css/`  | `variables.css`, `base.css`, `transitions.css`, `components.css` | All component CSS lives in `components.css` (no scoped blocks) |

## Hard rules

1. **Plan before code.** Present the approach, affected files, design decisions. Wait for approval.
2. **Ask before acting.** Don't run commits, destructive git ops, or large refactors without explicit instruction.
3. **Never commit without instruction.** No `git commit`, `git push`, or destructive git ops unless asked.
4. **No magic numbers.** Put them in `utils/constants.ts` and import.
5. **Pages stay thin.** All handlers, refs, lifecycle → the page's orchestrator composable (e.g. `useIndexPage`).
6. **Stores stay thin.** Reductions over arrays (averages, trend, heatmap) live in `utils/`, not in `computed` inside a store.
7. **Utils stay pure.** No Vue imports, no reactivity. Testable with plain JS.
8. **One purpose per composable.** If a file does two things, split it.
9. **CSS variables for every color.** Never hardcode hex values anywhere (templates, utils, components.css).
10. **No new external dependencies** without explicit approval — especially no syntax highlighting, UI kit, or animation libraries.

## Performance-critical — touch carefully

These files are on the keystroke path. Edits require a justification and a smoke test.

- `components/editor/CodeDisplay.vue` — `v-memo` + stable `:key` per-char render loop.
- `stores/typing.ts` — `shallowRef` / `triggerRef` for `charStates` / `tokens`. Do not wrap in deep reactivity.
- `utils/tokenizer/tokenize.ts` — runs once per file load. Keep under ~50 ms on 50 k chars.
- `composables/useTypingStats.ts` — 200 ms timer. Must clean up via `onScopeDispose`.

## Coding conventions

- `<script setup lang="ts">` only. No Options API.
- Pinia: setup function form.
- Tailwind: use for pure layout / spacing / simple backgrounds.
- Raw CSS in `assets/css/components.css` for interactive states, media queries, animations, pseudo-elements.
- Auto-imports: don't manually import `ref`, `computed`, `watch`, composables under `composables/`, or components.
- Utils and types: prefer explicit imports for clarity (`import { X } from '~/utils/...'`).
- No unnecessary comments. Only explain non-obvious WHY.
- No speculative abstractions or "while I'm here" cleanups.

## Extension points

- **Add a language/file** — edit `Prototype/snippets.json`. `sync:snippets` runs on `predev`/`prebuild`.
- **Add a theme** — new entry in `utils/themes.ts#THEME_VARS`, `THEME_OPTIONS`, widen `ThemeKey`.
- **Add a component** — drop into the matching domain subdir under `components/`. Auto-imported.
- **Add a composable** — one purpose per file; `onScopeDispose` for cleanup; if pure, make it a `utils/` function instead.

## Tech stack defaults

- **Frontend:** Vue 3 Composition API, Nuxt Latest, Tailwind CSS + CSS variables.
- **Backend:** Java, Spring Boot Latest (not used in this project, but follow this if one is added).

## Response style

- Lead with the answer or the plan. No trailing summaries.
- Reference code as `file:line`.
- Ask a specific clarifying question if requirements are ambiguous.
