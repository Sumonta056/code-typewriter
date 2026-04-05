# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run lint          # eslint check
npm run lint:fix      # eslint auto-fix
npm run format        # prettier write
npm run format:check  # prettier check
```

No test runner or linter is configured.

## Architecture

**Code Typewriter** is a Nuxt 3 SPA (SSR disabled) — a distraction-free typing tutor that fetches real source code from GitHub instead of using random words.

### Core Data Flow

1. **Load** — User selects language → `useTypingEngine.loadRandomFile()` → fetch from GitHub via `useGithubFetcher` → tokenize via `useTokenizer` → store in `useTypingStore`
2. **Type** — Keystrokes captured by `useKeyboardHandler` → `useTypingEngine.processChar()` → `charStates` updated in store → rendered by `EditorCodeDisplay`
3. **Complete** — `useTypingStats` computes WPM/accuracy → saved to `useHistoryStore` → `ResultsOverlay` shown
4. **Profile** — `/profile` reads `useHistoryStore`

### Key Files

| File                              | Role                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| `composables/useTypingEngine.ts`  | Central orchestrator — wires all composables and stores      |
| `composables/useTypingStats.ts`   | WPM, raw WPM, CPM, accuracy calculations                     |
| `composables/useGithubFetcher.ts` | Fetches raw files from GitHub                                |
| `composables/useTokenizer.ts`     | On-the-fly syntax tokenization for highlighting              |
| `stores/typing.ts`                | Active session state (code, position, errors, charStates)    |
| `stores/snippets.ts`              | Available snippets and selected language                     |
| `stores/settings.ts`              | User preferences (sound, tab size, max lines)                |
| `stores/history.ts`               | Past attempts and aggregate stats                            |
| `Prototype/snippets.json`         | Source of truth for available languages and GitHub file URLs |

### Adding Languages / Snippets

Edit `Prototype/snippets.json` — this is the single place to add new languages or GitHub file references.

### Component Structure

Components are organized by concern: `app/` (chrome), `editor/` (code display + typing input), `toolbar/` (sidebar controls), `panels/` (modals), `results/` (completion overlay), `stats/` (live WPM display), `ui/` (base elements).

### CSS

Global design tokens live in `assets/css/variables.css`. Base resets in `base.css`, animations in `transitions.css`.
