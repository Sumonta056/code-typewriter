A client-side typing practice app where you type real source code files fetched live from GitHub. Pick a language → a real file loads → type it character by character → get WPM/accuracy stats. No backend everything persists to `localStorage` only.

### Tech Stack

- Framework: Nuxt 3 SPA (`ssr: false`) with ESLint + Prettier
- UI: Vue 3 Composition API (`<script setup lang="ts">`)
- State: Pinia (setup-style stores)
- Styling: Tailwind CSS + CSS custom properties (no scoped styles)

### Data Flow

```
Pick language → fetch GitHub file → tokenize → render chars
User types   → keystroke → match char → update charState → re-render only changed span
Every * ms  → stats loop updates WPM / accuracy / progress
Session done → save to historyStore → show ResultsOverlay
```

## MUST FOLLOW RULES & Coding conventions

- Plan before code. Present the approach, affected files, design decisions. Wait for approval.
- No magic numbers. Put them in `utils/constants.ts` and import.
- Go through `.claude/rules` for the relevant layer. Don't read all rules at once — focus on the ones relevant to your change. For example, if you're working on a component, review `COMPONENT_RULES.md` and `FRAMEWORK_RULES.md`, but you can skip `PINIA_RULES.md` unless your change touches stores.
- Use tailwind CSS strictly for regular use. but CSS variables for every color. Never hardcode hex values anywhere (templates, utils, components.css). Raw CSS in `assets/css/components.css` only, no scoped styles.
- Pages stay thin. All handlers, refs, lifecycle → the page's orchestrator composable.
- Stores stay thin. Reductions over arrays (averages, trend, heatmap) live in `utils/`, not in `computed` inside a store.
- One purpose per composable. If a file does two things, split it.
- No new external dependencies without explicit approval — especially no syntax highlighting, UI kit, or animation libraries.
- PERFORMANCE IS THE MAIN PRIORITY: If a change causes a noticeable slowdown (e.g. >50 ms on 50k chars), it must be optimized before merging.
- If any changes regarding artchitectural decisions, please update `doc/ARCHITECTURE.md`, `doc/INFRASTRUCTURE.md`, `doc/SCORING_SYSTEM.md` accordingly.
- MUST update `CONTRIBUTING.md` with any new steps or guidelines for future contributors.

## Commands

```bash
npm run dev           # Dev server
npm run lint          # ESLint check
npm run format        # Prettier write
```

> IF need Deep dive: `doc/ARCHITECTURE.md`, `doc/INFRASTRUCTURE.md`, `doc/SCORING_SYSTEM.md` for detailed explanations of core systems.
