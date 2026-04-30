<div align="center">

<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qsfslnm8vrukdkpeb5av.png" alt="Code Typewriter — Type real source code, build real muscle memory" width="100%"/>

**[Report a Bug](https://github.com/Sumonta056/code-typewriter/issues/new?template=bug_report.yml) · [Request a Feature](https://github.com/Sumonta056/code-typewriter/issues/new?template=feature_request.yml) · [Add a Language](https://github.com/Sumonta056/code-typewriter/issues/new?template=language_request.yml)**

</div>

## What is Code Typewriter?

Code Typewriter is a browser-only typing practice app built for developers. Instead of lorem ipsum, you type **real production code** pulled live from open-source repositories — complete with indentation, punctuation, brackets, and symbols.

Pick a language → a real file loads from GitHub → type it character by character → see your WPM, CPM, and accuracy update live. No sign-up. No backend. Everything runs in your browser.

## Features

| Feature                                 | Details                                                                                            |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Real code, not filler**               | Snippets sourced from Vue, Nuxt, TypeScript, React, Python, Go, Rust, Java, and Spring Boot repos. |
| **Custom GitHub URL**                   | Paste any raw GitHub file URL to start a session with your own code.                               |
| **Character-level syntax highlighting** | Shiki tokenizes each character — colors match your chosen theme exactly.                           |
| **Live metrics**                        | WPM, raw WPM, CPM, accuracy, and progress update every 200 ms during the session.                  |
| **Session history & analytics**         | Local history tracks past runs, per-language performance, trends, and error heatmaps.              |
| **Fully customizable**                  | Themes, font size, tab size, line numbers, max visible lines, bookmarks, pause, and resume.        |
| **Zero backend**                        | All data lives in `localStorage`. No accounts, no tracking, no server.                             |

## Quick Start

**Prerequisites:** Node.js 18+, npm

```bash
git clone https://github.com/Sumonta056/code-typewriter.git
cd code-typewriter
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start typing.

### All Commands

```bash
npm run dev            # Start the Nuxt dev server
npm run lint           # Run ESLint
npm run lint:fix       # Run ESLint with auto-fix
npm run format         # Format with Prettier
npm run format:check   # Check formatting without writing
```

## Supported Languages

Snippet metadata lives in `languages/*.json`. Run `npm run sync:snippets` after any change.

| Language    | Source repository             |
| ----------- | ----------------------------- |
| Vue.js      | `vuejs/core`                  |
| Nuxt.js     | `nuxt/nuxt`                   |
| TypeScript  | `microsoft/TypeScript`        |
| React       | `facebook/react`              |
| Python      | `python/cpython`              |
| Go          | `golang/go`                   |
| Rust        | `rust-lang/rust`              |
| Java        | `google/guava`                |
| Spring Boot | `spring-projects/spring-boot` |

## Tech Stack

| Layer     | Technology                                                              |
| --------- | ----------------------------------------------------------------------- |
| Framework | [Nuxt 3](https://nuxt.com) (SPA, `ssr: false`)                          |
| UI        | [Vue 3](https://vuejs.org) Composition API + `<script setup lang="ts">` |
| State     | [Pinia](https://pinia.vuejs.org) (setup-style stores)                   |
| Styling   | [Tailwind CSS](https://tailwindcss.com) + CSS custom properties         |
| Syntax    | [Shiki](https://shiki.matsu.io) — character-level token colors          |
| Linting   | ESLint + Prettier                                                       |

## Architecture

```
User selects language / URL
  → snippets store resolves file metadata
  → useTypingEngine loads source code
      → useGithubFetcher fetches raw code (API-first, raw fallback)
      → shikiHighlighter maps token colors per character
      → typing store initializes the active session

User types
  → HiddenInput captures keydown
  → useKeyboardHandler normalizes special keys
  → useTypingEngine processes characters and backspace
  → typing store updates char state and current index
  → CodeDisplay renders only the changed span

Stats loop (every 200 ms)
  → useTypingStats updates WPM, CPM, accuracy, progress
  → on completion → history entry written to localStorage
  → ResultsOverlay displays the final session summary
```

<details>
<summary><strong>Pinia store responsibilities</strong></summary>

| Store                 | Responsibility                                            |
| --------------------- | --------------------------------------------------------- |
| `stores/typing.ts`    | Active session state (code, charStates, index, timers)    |
| `stores/snippets.ts`  | Language and snippet manifest from `public/snippets.json` |
| `stores/settings.ts`  | User preferences, persisted to `localStorage`             |
| `stores/history.ts`   | Completed sessions and analytics inputs                   |
| `stores/bookmarks.ts` | Starred snippets                                          |
| `stores/liveStats.ts` | High-frequency live stat values                           |

</details>

## Project Layout

```
code-typewriter/
├── assets/css/        # Global tokens, base styles, transitions, component CSS
├── components/        # Editor, toolbar, panels, overlays, results, stats, UI primitives
├── composables/       # Typing engine, stats loop, GitHub fetcher, keyboard handling
├── languages/         # Source of truth for bundled snippet metadata
├── pages/             # Nuxt routes (index, profile, about, rules)
├── plugins/           # Client initialization (localStorage hydration)
├── public/            # Generated snippet manifest and static assets
├── scripts/           # Maintenance scripts (sync:snippets)
├── stores/            # Pinia stores
├── types/             # TypeScript interfaces and unions
└── utils/             # Pure helpers, constants, and Shiki integration
```

For a deeper dive see:

- [Architecture](doc/architecture.md)
- [Infrastructure](doc/INFRASTRUCTURE.md)
- [Scoring System](doc/SCORING_SYSTEM.md)

## Adding a Language

1. Create or update a file under `languages/` following the schema below.
2. Run `npm run sync:snippets` to rebuild `public/snippets.json`.
3. Open a PR — see [CONTRIBUTING.md](CONTRIBUTING.md) for the full checklist.

```json
{
  "id": "kotlin",
  "name": "Kotlin",
  "extension": ".kt",
  "files": [
    {
      "name": "Snippet Label",
      "url": "https://raw.githubusercontent.com/owner/repo/COMMIT_SHA/path/to/file.kt"
    }
  ]
}
```

> Use `raw.githubusercontent.com` URLs pinned to a stable commit SHA or release tag — never a moving branch name.

## Contributing

Contributions of all kinds are welcome — bug fixes, new languages, UI improvements, and docs.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR. It covers:

- Development setup and commands
- Commit message format (`ISSUE-123: feat: description`)
- Coding conventions and architecture rules
- Language snippet guidelines
- PR expectations and review process

For major changes, open an issue first to discuss what you'd like to change.

**Good first issues:** look for the [`good first issue`](https://github.com/Sumonta056/code-typewriter/labels/good%20first%20issue) label.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold a welcoming and respectful environment for everyone.

## Security

Found a vulnerability? Please read [SECURITY.md](SECURITY.md) and report it responsibly — do not open a public issue.

## License

[MIT](LICENSE) © [Sumonta Saha Mridul](https://github.com/Sumonta056)
