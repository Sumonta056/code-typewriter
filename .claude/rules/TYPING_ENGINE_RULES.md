## Typing Engine Rules

- **Tab expansion before session setup.** Tabs in fetched code are replaced with spaces (count = `settingsStore.settings.tabSize`) before being stored. The user always types `Space`, never `Tab`.
- **Comparison is character-exact.** `processChar` compares the typed character against `typingStore.code[currentIndex]` with strict equality. No tolerance, no autocorrect.
- **Backspace can only undo one character at a time.** Ctrl+Backspace (word delete) is not supported. Modifier keys are filtered out by `useKeyboardHandler`.
- **The timer starts on the first keystroke,** not when the file loads. `startTime` is `null` until the first call to `startTimer()`.
- **Stats tick every 200ms** via `setInterval` while the session is active. The interval is stopped on completion and on cleanup.
- **Results are shown after a 350ms delay** post-completion to allow the last character's state transition animation to finish before the overlay appears.
- **WPM formula:** `(correctChars / 5) / elapsedMinutes`. The standard "5 characters = 1 word" convention is used. Raw WPM uses total keystrokes instead of correct chars.
