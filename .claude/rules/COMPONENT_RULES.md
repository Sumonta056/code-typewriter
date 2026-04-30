## Component Rules

### Naming

- Components are PascalCase files grouped by feature folder: `components/editor/CodeDisplay.vue`
- Auto-import prefix matches folder name: `EditorCodeDisplay`, `StatsLiveStats`, `PanelsUrlPanel`
- Generic, reusable primitives live in `components/ui/`: `BaseButton`, `IconButton`, `HiddenInput`
- App-level shell components live in `components/app/`: `AppHeader`, `AppLogo`, `AppScanlines`

### Props & Events

- **Props are read-only.** Components never mutate their own props. All mutations go through emitted events back to the parent or directly to a store.
- **Emit before store.** If a component needs to trigger state change, it emits an event. The page wires the event to the store or engine. Components do not import stores directly unless they are "smart" page-level components.
- **Boolean props default to `false`.** All boolean props should be explicitly typed and default to `false`.

### Scoped Styles

- Components do **not** use `<style scoped>` blocks. All component CSS lives in `assets/css/components.css`.
- Global design tokens are CSS custom properties defined in `assets/css/variables.css` and consumed everywhere via `var(--token-name)`.
- Responsive breakpoints:
  - Mobile: `max-width: 768px`
  - Wide layout (editor + sidebar): `min-width: 1200px`
- Tailwind is used for layout/structural utilities only (`flex`, `gap`, `items-center`, spacing). CSS variables handle every color.
