## Composable Rules

- **Composables are pure logic units.** They must not contain template markup or direct DOM queries (except `useScrollTracker` which must operate on refs passed in from the component).
- **`useTypingEngine` is the orchestrator.** It is the only composable that coordinates between stores and other composables. Pages call `useTypingEngine`; they do not call `useGithubFetcher` or `useTokenizer` directly.
- **Single instance per composable call.** Composables like `useTypingStats` maintain local `ref` state (timer intervals, stat values). Each call to `useTypingEngine` creates its own set of stats. Do not share composable instances across components via a module-level singleton — use Pinia stores for shared global state instead.
- **Cleanup is explicit.** If a composable uses `setInterval` or `setTimeout`, it must expose a `stop`/`cleanup` function. The calling page must invoke it in `onUnmounted`.
- **`requestAnimationFrame` for scroll.** `useScrollTracker` wraps all scroll mutations in `rAF` and cancels the previous frame before scheduling a new one to avoid layout thrashing.
