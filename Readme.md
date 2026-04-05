# Code Typewriter

A smooth, distraction-free typing practice app for developers — built with real code snippets fetched directly from GitHub.

Instead of random words, you practice typing actual source code from popular open-source projects. Track your speed, accuracy, and completion time as you work through real-world Vue JS and Nuxt JS files.

---

## Features

- **Real code snippets** — fetches live files from GitHub (Vue JS, Nuxt JS, and more to come)
- **Language selector** — choose what type of code you want to practice
- **Typewriter-style UI** — character-by-character typing with visual feedback
- **No time limit** — type at your own pace, no pressure
- **Results on completion** — see your total time, typing speed (WPM), and accuracy when you finish
- **Random file picker** — grab a random snippet from the selected language to keep things fresh
- **Easily extensible** — add more GitHub links anytime by editing a single JSON file

---

## Tech Stack

| Layer     | Technology          |
| --------- | ------------------- |
| Framework | Nuxt 3              |
| UI        | Vue 3 + TypeScript  |
| State     | Pinia               |
| Prototype | Vanilla HTML/CSS/JS |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install & run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run preview
```

---

## Adding More Snippets

Snippet sources are managed in `Prototype/snippets.json`. Each entry follows this structure:

```json
{
  "id": "vuejs",
  "name": "Vue JS",
  "extension": ".vue",
  "files": [
    {
      "name": "My Snippet Label",
      "url": "https://raw.githubusercontent.com/..."
    }
  ]
}
```

Add a new object to the `languages` array to support an entirely new language, or push a new entry into an existing language's `files` array to add more snippets.

---

## Roadmap

- [ ] C++ snippet support
- [ ] Python snippet support
- [ ] Per-language accuracy stats history
- [ ] Keyboard shortcut to skip / reload snippet

---

## Project Structure

```
code-typewriter/
├── Prototype/          # Standalone HTML/CSS/JS prototype
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── snippets.json   # All GitHub snippet sources
├── components/         # Vue components (Nuxt app)
├── pages/              # App routes
├── stores/             # Pinia stores
├── composables/        # Shared logic
└── nuxt.config.ts
```

---

## License

MIT
