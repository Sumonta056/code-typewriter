# Code Typewriter

A distraction-free typing practice app for developers — built with real source code fetched live from GitHub.

Instead of random words, you type actual production code from popular open-source projects. Every keystroke builds muscle memory for the syntax patterns you encounter every day.

---

## Features

- **Real code, not words** — Practice with live files from Vue, React, TypeScript, Go, Rust, Python, Java, and more
- **Syntax highlighting** — Custom tokenizer with 24 token types, no external library
- **Live metrics** — Real-time WPM, raw WPM, CPM, accuracy, and progress while you type
- **Three themes** — Dark, Monokai, and Solarized with full CSS variable theming
- **Session history** — Every session is saved with WPM, accuracy, language, and timestamp
- **Profile analytics** — WPM trend chart, 52-week practice calendar, per-language breakdown, character error heatmap
- **Bookmarks** — Star files you want to revisit
- **Custom URLs** — Load any raw GitHub file
- **Keyboard sound** — Optional procedurally-generated click feedback via Web Audio API
- **Pause / resume** — Pause time is excluded from stats
- **Configurable editor** — Font size, tab size, max lines, line numbers toggle

---

## Tech Stack

| Layer               | Technology                                  |
| ------------------- | ------------------------------------------- |
| Framework           | Nuxt 3 (SSR disabled, client-only SPA)      |
| UI                  | Vue 3 + TypeScript                          |
| State               | Pinia                                       |
| Styling             | Scoped CSS + CSS custom properties          |
| Code fetching       | Fetch API (GitHub raw + API fallback)       |
| Syntax highlighting | Custom tokenizer (no Prism / Highlight.js)  |
| Sound               | Web Audio API (procedural, no audio files)  |
| Persistence         | LocalStorage (settings, history, bookmarks) |
| Fonts               | Fira Code (editor), Space Grotesk (UI)      |
| Code quality        | ESLint + Prettier + Husky + lint-staged     |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:3000`.

### Other commands

```bash
npm run build          # Production build
npm run generate       # Static site generation
npm run preview        # Preview production build
npm run lint           # ESLint check
npm run lint:fix       # ESLint auto-fix
npm run format         # Prettier write
npm run format:check   # Prettier check
```

---

## Supported Languages

| Language     | Source                      |
| ------------ | --------------------------- |
| Vue JS       | vuejs/core                  |
| Nuxt JS      | nuxt/nuxt                   |
| TypeScript   | microsoft/TypeScript        |
| React        | facebook/react              |
| Python       | python/cpython              |
| Go           | golang/go                   |
| Rust         | rust-lang/rust              |
| Java / Guava | google/guava                |
| Spring Boot  | spring-projects/spring-boot |

Each language ships with 5 hand-picked files from the real upstream source.

---

## Adding Snippets

Edit `Prototype/snippets.json` — it is the single source of truth for all languages and file URLs.

**Add a new file to an existing language:**

```json
{
  "id": "typescript",
  "name": "TypeScript",
  "extension": ".ts",
  "files": [
    {
      "name": "My New File",
      "url": "https://raw.githubusercontent.com/owner/repo/branch/path/to/file.ts"
    }
  ]
}
```

**Add an entirely new language:**

```json
{
  "id": "kotlin",
  "name": "Kotlin",
  "extension": ".kt",
  "files": [{ "name": "Snippet Label", "url": "https://raw.githubusercontent.com/..." }]
}
```

Use raw `githubusercontent.com` URLs, not `github.com` browse URLs.

After editing, copy `Prototype/snippets.json` to `public/snippets.json` — the Nuxt app reads from `public/`.

---

## Project Structure

```
code-typewriter/
├── pages/                   # Routes (index.vue, profile.vue)
├── components/
│   ├── app/                 # Logo, scanline overlay
│   ├── editor/              # Code display, typing input, line numbers, progress
│   ├── toolbar/             # Language selector, action buttons
│   ├── panels/              # Settings modal, URL input panel
│   ├── results/             # Completion overlay and results card
│   ├── stats/               # Live WPM display, accuracy sparkline
│   ├── overlay/             # Loading spinner
│   └── ui/                  # Base button, icon button, hidden input
├── composables/
│   ├── useTypingEngine.ts   # Central orchestrator
│   ├── useTypingStats.ts    # WPM / accuracy calculations
│   ├── useGithubFetcher.ts  # GitHub file fetching
│   ├── useTokenizer.ts      # Syntax highlighting tokenization
│   ├── useKeyboardHandler.ts # Tab / Enter / Backspace normalization
│   ├── useAudio.ts          # Procedural key click sound
│   └── useScrollTracker.ts  # Auto-scroll to cursor
├── stores/
│   ├── typing.ts            # Active session state
│   ├── settings.ts          # User preferences (persisted)
│   ├── history.ts           # Session history & analytics
│   ├── snippets.ts          # Available languages and snippets
│   └── bookmarks.ts         # Starred files
├── types/                   # TypeScript interfaces and enums
├── assets/css/
│   ├── variables.css        # Design tokens and theme definitions
│   ├── base.css             # Resets and global styles
│   └── transitions.css      # Animation definitions
├── public/snippets.json     # Runtime snippet manifest (copy of Prototype/)
└── Prototype/snippets.json  # Source of truth for snippets
```

---

## Architecture Overview

### Core data flow

```
User selects language
  → useTypingEngine.loadRandomFile()
  → useGithubFetcher fetches raw file from GitHub
  → useTokenizer classifies every character (keyword, string, comment, …)
  → typing store initializes (charStates[], tokens[], currentIndex = 0)

User types
  → HiddenInput captures keypress
  → useKeyboardHandler normalizes (Tab → spaces, Enter → \n)
  → useTypingEngine.processChar()
  → typing store updates (charStates, currentIndex, errors)
  → useTypingStats recalculates WPM / accuracy every 200 ms
  → CodeDisplay re-renders highlighting + caret position

Session complete
  → completeTyping() called
  → Final stats calculated
  → HistoryEntry saved to localStorage via history store
  → ResultsOverlay shown
```

### State management

All state lives in Pinia stores. Session state in `stores/typing.ts` is ephemeral (not persisted). Settings, history, and bookmarks persist to `localStorage`.

### Theming

Three complete themes are defined as sets of CSS custom properties in `assets/css/variables.css`. Switching themes swaps the active class on `<html>` via `settings.applyCssVariables()`. No CSS framework is used.

---

## License

MIT
