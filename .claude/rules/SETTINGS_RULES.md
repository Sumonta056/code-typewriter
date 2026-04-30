## Settings Rules

- Settings are persisted to `localStorage` on every change (not debounced).
- `fontSize` and `tabSize` changes immediately write `--code-font-size` and `--code-tab-size` CSS custom properties to `document.documentElement` via `applyCssVariables()`.
- Clamp logic for numeric settings is centralised in `NUMERIC_LIMITS` in `settings.ts`. Add new numeric settings there, not in the component.
