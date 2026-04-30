## Syntax Highlighting Rules

- **Shiki is the only highlighter.** `utils/shikiHighlighter.ts` wraps a Shiki singleton. Call `tokenizeCode(code, url, theme)` — it returns a `string[]` of hex color codes, one per character.
- **Singleton pattern.** The `Highlighter` instance is created once and reused. Languages and themes are lazily loaded on first use.
- **Language detection.** `getLangFromUrl(url)` maps file extensions to Shiki language identifiers via the `EXT_TO_LANG` map. Unknown extensions fall back to `'text'`.
- **Runs once per file load.** `tokenizeCode` is called in `useTypingEngine` after `fetchCode` returns. It does not run again mid-session unless the theme changes.
- **Token array is parallel to the code string.** The returned `string[]` has length === `code.length`. Index `i` maps to character `i`.
- **No hand-written tokenizer.** Do not implement a custom scanner. Shiki handles all syntax classification.
- **Theme compatibility.** Always use themes from `utils/themes.ts#SHIKI_THEMES`. Do not hardcode theme strings.
