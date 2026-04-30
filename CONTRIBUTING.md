# Contributing to Code Typewriter

Thanks for helping improve Code Typewriter. This guide covers local setup, commit format, pull requests, language additions, and project conventions.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Development Setup

Prerequisites:

- Node.js 18 or newer
- npm

```bash
git clone https://github.com/Sumonta056/code-typewriter.git
cd code-typewriter
npm install
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues where possible
npm run format         # Format with Prettier
npm run format:check   # Check formatting
```

## Before You Commit

This project uses [Husky](https://typicode.github.io/husky/) to enforce quality gates automatically on every commit. Two hooks run:

| Hook         | Trigger      | What it does                                                           |
| ------------ | ------------ | ---------------------------------------------------------------------- |
| `pre-commit` | `git commit` | Runs `lint-staged` — ESLint and Prettier on staged files               |
| `commit-msg` | `git commit` | Validates the commit message against the format below via `commitlint` |

Both hooks are installed automatically after `npm install` via the `prepare` script. If a hook rejects your commit, fix the reported issue and try again. **Do not bypass hooks with `--no-verify`.**

## Commit Message Format

The release workflow parses commit subjects to generate release notes. Use this format:

```text
ISSUE-<number>: <type>: <short description>
```

Allowed types:

| Type       | Use for                                         |
| ---------- | ----------------------------------------------- |
| `feat`     | New user-facing behavior                        |
| `fix`      | Bug fixes                                       |
| `perf`     | Performance improvements                        |
| `style`    | Visual or CSS-only changes                      |
| `refactor` | Code structure changes without behavior changes |
| `chore`    | Tooling, dependency, config, or CI work         |
| `doc`      | Documentation-only changes                      |

Examples:

```text
ISSUE-42: feat: add Ruby language support
ISSUE-17: fix: preserve cursor position after backspace
ISSUE-55: perf: reduce editor rerenders while typing
ISSUE-30: chore: update CI workflow
```

Open an issue first if one does not already exist.

## Pull Request Process

1. Fork the repository and create a branch from `main`.
2. Keep the change focused on one issue.
3. Run `npm run lint` and `npm run format:check`.
4. Open a pull request and complete the template.
5. Link the issue with `Closes #123` or `Fixes #123`.

Reviewers check that the PR matches the issue scope, follows the conventions below, keeps generated files in sync, and does not introduce unrelated refactors.

## Adding Languages or Snippets

Language data lives in two places inside `public/languages/`:

| File         | Purpose                                         |
| ------------ | ----------------------------------------------- |
| `index.json` | Ordered array of language IDs loaded at startup |
| `<id>.json`  | Full metadata and file list for one language    |

### Add a snippet to an existing language

Open `public/languages/<id>.json` and append an entry to the `files` array:

```json
{
  "name": "Go http client",
  "url": "https://raw.githubusercontent.com/golang/go/go1.23.0/src/net/http/client.go"
}
```

### Add a new language

**Step 1 — create the language file**

Create `public/languages/<id>.json`. The `id` must be lowercase, no spaces.

```json
{
  "id": "kotlin",
  "name": "Kotlin",
  "extension": ".kt",
  "files": [
    {
      "name": "Kotlin coroutines - channels",
      "url": "https://raw.githubusercontent.com/Kotlin/kotlinx.coroutines/1.8.1/kotlinx-coroutines-core/common/src/channels/Channel.kt"
    },
    {
      "name": "Kotlin stdlib - strings",
      "url": "https://raw.githubusercontent.com/JetBrains/kotlin/v2.0.0/libraries/stdlib/src/kotlin/text/Strings.kt"
    }
  ]
}
```

**Step 2 — register the ID in the index**

Open `public/languages/index.json` and add the new ID in alphabetical order:

```json
["go", "java", "kotlin", "nuxtjs", "python", "react", "rust", "springboot", "typescript", "vuejs"]
```

That's it. No build step needed — the app fetches each file directly at runtime.

### Language guidelines

- Use `raw.githubusercontent.com` URLs only.
- Prefer a version tag or commit SHA over a moving branch (`master`/`main`) so the snippet stays stable.
- Pick readable, representative files — standard library internals, well-known OSS packages, or idiomatic framework code.
- Avoid: generated files, minified output, vendored code, large auto-generated fixtures, and files with no meaningful syntax to type.
- Keep `name` labels short enough to scan in the language selector (under ~40 characters).
- Aim for 3–6 files per language — enough variety without overwhelming the selector.

## Coding Conventions

- Keep route pages thin. Move stateful orchestration into composables.
- Keep stores focused on state transitions and persistence. Put reusable calculations in `utils/`.
- Keep `utils/` free of Vue reactivity unless a utility is explicitly Vue-specific.
- Use TypeScript types from `types/` where shared structures cross modules.
- Avoid `any`; if a type assertion is necessary, make the reason obvious in nearby code.
- Use Tailwind for simple layout and spacing, and `assets/css/components.css` for shared component behavior, media queries, and animations.
- Add colors through `assets/css/variables.css` instead of hardcoding them through the app.
- Add new dependencies only when the benefit is clear and the maintainer has agreed.

## Performance-Sensitive Areas

| File                                | Watch for                                             |
| ----------------------------------- | ----------------------------------------------------- |
| `components/editor/CodeDisplay.vue` | Per-character rendering and memoization.              |
| `stores/typing.ts`                  | High-frequency typing updates.                        |
| `utils/shikiHighlighter.ts`         | Syntax token loading and per-character color mapping. |
| `composables/useTypingStats.ts`     | The live stats interval and cleanup.                  |

If a PR touches these files, describe the performance impact and how you checked it.
