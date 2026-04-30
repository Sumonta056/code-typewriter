## History & Profile Rules

- Each completed session generates one `HistoryEntry` with a `crypto.randomUUID()` id.
- History is never merged or deduped — all sessions are recorded independently.
- Streak calculation counts calendar days (ISO date `YYYY-MM-DD`), not sessions. Multiple sessions on the same day count as one streak day.
- `languageStats` aggregates history by `language` field (matches `snippetsStore.selectedLanguageId` at session end).
- The profile page (`pages/profile.vue`) reads directly from `historyStore` computed properties — it does not fetch or transform data itself.
