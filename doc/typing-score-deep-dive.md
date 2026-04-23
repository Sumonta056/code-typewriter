# Typing Score Deep Dive

## How Matching, Speed, Accuracy & Mistakes Are Calculated

> A line-by-line walkthrough with a real example so you can trace every number from first keypress to final results screen.

---

## Table of Contents

1. [Files Involved](#1-files-involved)
2. [Key Data Structures](#2-key-data-structures)
3. [Real Example Setup](#3-real-example-setup)
4. [Phase 1 — Session Bootstrap](#4-phase-1--session-bootstrap)
5. [Phase 2 — Keyboard Input Pipeline](#5-phase-2--keyboard-input-pipeline)
6. [Phase 3 — Character Matching](#6-phase-3--character-matching)
7. [Phase 4 — Live Stats (200 ms tick)](#7-phase-4--live-stats-200-ms-tick)
8. [Phase 5 — Completion & Final Stats](#8-phase-5--completion--final-stats)
9. [Formula Reference](#9-formula-reference)
10. [Full Example Walkthrough Table](#10-full-example-walkthrough-table)
11. [Edge Cases & Design Decisions](#11-edge-cases--design-decisions)

---

## 1. Files Involved

| File                                | Role                                                     |
| ----------------------------------- | -------------------------------------------------------- |
| `composables/useKeyboardHandler.ts` | Normalises raw `KeyboardEvent` → single character string |
| `composables/useTypingEngine.ts`    | Orchestrator: calls store mutations, triggers stats      |
| `stores/typing.ts`                  | Source of truth for every per-session counter            |
| `composables/useTypingStats.ts`     | All maths: WPM, raw WPM, CPM, accuracy, elapsed time     |
| `stores/liveStats.ts`               | Thin broadcast bucket read by the navbar / HUD           |
| `stores/history.ts`                 | Persists completed session results to localStorage       |
| `utils/historyAnalytics.ts`         | Aggregate analytics across multiple sessions             |
| `utils/constants.ts`                | Magic numbers in one place                               |
| `types/typing.ts`                   | `CharState`, `SessionResult` type definitions            |
| `types/profile.ts`                  | `HistoryEntry` shape                                     |

---

## 2. Key Data Structures

### `CharState` — per character status

```ts
// types/typing.ts  line 1
export type CharState = 'pending' | 'correct' | 'incorrect'
```

Every character in the loaded code file starts as `'pending'`.  
When the user types it correctly → `'correct'`.  
Wrong key → `'incorrect'`.  
Backspace → reverts to `'pending'`.

### Counters inside `stores/typing.ts`

```ts
const currentIndex = ref(0) // cursor position in the code string
const totalErrors = ref(0) // cumulative wrong keystrokes (never decremented)
const totalKeystrokes = ref(0) // cumulative ALL keystrokes (correct + incorrect, never decremented)
const startTime = ref<number | null>(null) // Date.now() at first keypress
const totalPausedMs = ref(0) // ms spent paused (subtracted from elapsed)
```

> **Important:** `totalErrors` and `totalKeystrokes` are **never decremented** by backspace.
> Backspace only resets the `CharState` of the previous character to `'pending'` and moves `currentIndex` back by 1.

---

## 3. Real Example Setup

Imagine the code snippet loaded is exactly:

```
const x = 1;
```

That is **13 characters**: `c o n s t   x   =   1 ;` + `\n` (newline at end, index 12).

After `setupSession()`:

```
charStates = ['pending','pending','pending','pending','pending','pending','pending',
              'pending','pending','pending','pending','pending','pending']
                 0         1         2         3         4         5         6
             c         o         n         s         t         (space)   x

currentIndex    = 0
totalErrors     = 0
totalKeystrokes = 0
startTime       = null
```

The user will type the following sequence (with one deliberate mistake):

```
c o n s t (space) y ← x = 1 ; (newline)
```

The `y` is wrong; they backspace and retype `x`.

---

## 4. Phase 1 — Session Bootstrap

### `stores/typing.ts` → `setupSession()`

```ts
// stores/typing.ts  lines 28-43
function setupSession(newCode: string, newTokens: TokenType[], name: string, url: string) {
  code.value = newCode
  tokens.value = newTokens
  charStates.value = new Array(newCode.length).fill('pending') // ← all pending
  fileName.value = name
  fileUrl.value = url
  currentIndex.value = 0 // ← cursor at start
  totalErrors.value = 0 // ← no mistakes yet
  totalKeystrokes.value = 0 // ← no typing yet
  startTime.value = null // ← timer not started
  isComplete.value = false
  isActive.value = true
  isPaused.value = false
  pausedAt.value = null
  totalPausedMs.value = 0
}
```

**What this does:**

- Fills a `charStates` array of length 13 with `'pending'`
- Resets every counter to zero
- Leaves `startTime = null` — the clock does **not** start until the first actual keystroke

### `useTypingEngine.ts` → `loadCode()`

```ts
// composables/useTypingEngine.ts  lines 61-77
async function loadCode(url: string, name: string): Promise<boolean> {
  const result = await fetcher.fetchCode(url, settingsStore.settings.maxLines)
  // ...
  const tabSpaces = ' '.repeat(settingsStore.settings.tabSize)
  const code = result.code.replace(/\t/g, tabSpaces) // tabs → spaces
  const tokens = await tokenizeCode(code, url, settingsStore.settings.editorTheme)
  typingStore.setupSession(code, tokens, result.fileName || name, url)
  stats.resetStats() // ← wpm=0, accuracy=100, etc.
  showResults.value = false
  sessionErrorMap = {} // ← per-char error counts cleared
  return true
}
```

`sessionErrorMap` is a plain JS object (not reactive) like `{ 'y': 2, '{': 1 }`.  
It records **which expected character** was missed and how many times.

---

## 5. Phase 2 — Keyboard Input Pipeline

Every keypress goes through `useKeyboardHandler` first.

### `composables/useKeyboardHandler.ts`

```ts
// lines 12-37
if (e.key === 'Tab') {
  e.preventDefault()
  const spaces = ' '.repeat(getTabSize())
  for (const ch of spaces) {
    callbacks.onChar(ch) // sends N space characters, one per tab-space
  }
  return
}

if (e.key === 'Enter') {
  e.preventDefault()
  callbacks.onChar('\n') // newline character sent to engine
  return
}

if (e.key === 'Backspace') {
  e.preventDefault()
  callbacks.onBackspace()
  return
}

if (e.ctrlKey || e.metaKey || e.altKey) return // ← ignore modifier combos
if (e.key.length > 1) return // ← ignore F1, ArrowLeft, etc.

e.preventDefault()
callbacks.onChar(e.key) // normal printable character
```

**So when the user presses `y`:**

- `e.key === 'y'`, length is 1, no modifiers
- `callbacks.onChar('y')` is called
- This calls `processChar('y')` in `useTypingEngine`

---

## 6. Phase 3 — Character Matching

### `composables/useTypingEngine.ts` → `processChar()`

```ts
// lines 88-113
function processChar(char: string): 'complete' | 'continue' | null {
  if (typingStore.isPaused) return null
  if (typingStore.currentIndex >= typingStore.charCount) return null

  // ① Start the timer on the very first character
  if (!typingStore.startTime) {
    typingStore.startTimer() // sets startTime = Date.now()
    stats.startTimer() // starts the 200ms interval for live stats
  }

  setTypingActive() // shows "typing" indicator, resets 500ms idle timeout

  // ② Compare typed char against expected char
  const expected = typingStore.code[typingStore.currentIndex] as string
  if (char === expected) {
    typingStore.advanceCorrect()
  } else {
    typingStore.advanceIncorrect()
    // ③ Record which character was missed
    sessionErrorMap[expected] = (sessionErrorMap[expected] || 0) + 1
  }

  // ④ Check completion
  if (typingStore.currentIndex >= typingStore.charCount) {
    completeTyping()
    return 'complete'
  }
  return 'continue'
}
```

#### Step-by-step for our example

**Keystroke 1: user types `c`, expected `c`**

```ts
expected = code[0] = 'c'
char = 'c'
'c' === 'c'  → true  → advanceCorrect()
```

Inside `advanceCorrect()`:

```ts
// stores/typing.ts  lines 45-51
charStates.value[0] = 'correct' // index 0 → ✅
triggerRef(charStates) // force Vue to re-render
totalKeystrokes.value++ // 0 → 1
currentIndex.value++ // 0 → 1
```

State after keystroke 1:

```
currentIndex    = 1
totalKeystrokes = 1
totalErrors     = 0
charStates[0]   = 'correct'
```

---

**Keystroke 7: user types `y`, expected `x`** (the deliberate mistake)

```ts
expected = code[6] = 'x'
char = 'y'
'y' === 'x'  → false  → advanceIncorrect()
sessionErrorMap['x'] = 1   // 'x' was the expected char that was missed
```

Inside `advanceIncorrect()`:

```ts
// stores/typing.ts  lines 53-60
charStates.value[6] = 'incorrect' // index 6 → ❌
triggerRef(charStates)
totalErrors.value++ // 0 → 1
totalKeystrokes.value++ // 6 → 7
currentIndex.value++ // 6 → 7
```

State after keystroke 7:

```
currentIndex    = 7
totalKeystrokes = 7
totalErrors     = 1
charStates[6]   = 'incorrect'
```

---

**Keystroke 8: user presses `Backspace`**

```ts
// useTypingEngine.ts  lines 115-120
function processBackspace() {
  if (typingStore.isPaused) return
  if (typingStore.currentIndex <= 0) return
  setTypingActive()
  typingStore.goBack()
}
```

Inside `goBack()`:

```ts
// stores/typing.ts  lines 62-67
currentIndex.value-- // 7 → 6
charStates.value[6] = 'pending' // reset to ⬜
triggerRef(charStates)
```

> **Note:** `totalErrors` stays at **1** and `totalKeystrokes` stays at **7**.
> The backspace is NOT counted as a new keystroke, and the previous error is NOT undone.
> This is intentional — it penalises you for making mistakes.

State after backspace:

```
currentIndex    = 6
totalKeystrokes = 7    ← unchanged
totalErrors     = 1    ← unchanged
charStates[6]   = 'pending'
```

---

**Keystroke 9: user types `x`, expected `x`** (correction)

```ts
expected = code[6] = 'x'
char = 'x'
'x' === 'x'  → true  → advanceCorrect()
```

```
charStates[6]   = 'correct'
totalKeystrokes = 8
currentIndex    = 7
totalErrors     = 1   ← still 1, not forgiven
```

The remaining characters `' '`, `'='`, `' '`, `'1'`, `';'`, `'\n'` are all typed correctly.

Final state before completion:

```
currentIndex    = 13   (== charCount, session done)
totalKeystrokes = 14   (13 correct chars + 1 wrong keystroke)
totalErrors     = 1
```

---

## 7. Phase 4 — Live Stats (200 ms tick)

### `useTypingStats.ts` → `startTimer()` / `update()`

When the first character is typed, `stats.startTimer()` is called:

```ts
// composables/useTypingStats.ts  lines 65-68
function startTimer() {
  stopTimer()
  intervalId = setInterval(update, STATS_UPDATE_INTERVAL_MS) // every 200ms
}
```

Every 200 ms `update()` runs:

```ts
// lines 51-63
function update() {
  if (!store.startTime || store.isComplete || store.isPaused) return
  progress.value = store.progressPercent // currentIndex / charCount * 100
  calcStats(store.currentIndex) // ← pass chars typed so far

  // Record accuracy snapshot for sparkline chart every 1 second
  const elapsed = elapsedSeconds.value
  if (elapsed > 0 && accuracyHistory.value.length < MAX_ACCURACY_SAMPLES) {
    const last = accuracyHistory.value[accuracyHistory.value.length - 1]
    if (!last || elapsed - last.t >= ACCURACY_SAMPLE_INTERVAL_S) {
      accuracyHistory.value.push({ t: Math.round(elapsed), v: accuracy.value })
    }
  }
}
```

### `calcStats()` — the core math

```ts
// lines 34-49
function calcStats(charCount: number): void {
  const elapsed = getEffectiveElapsed() // ← real seconds, pauses excluded
  const minutes = elapsed / 60

  // WPM — "net" words per minute
  wpm.value = minutes > 0 ? Math.round(charCount / 5 / minutes) : 0

  // Raw WPM — every keystroke, including mistakes
  rawWpm.value = minutes > 0 ? Math.round(store.totalKeystrokes / 5 / minutes) : 0

  // CPM — characters per minute
  cpm.value = minutes > 0 ? Math.round(charCount / minutes) : 0

  // Accuracy %
  accuracy.value =
    store.totalKeystrokes > 0
      ? Math.round(((store.totalKeystrokes - store.totalErrors) / store.totalKeystrokes) * 100)
      : 100

  elapsedSeconds.value = elapsed
  const mins = Math.floor(elapsed / 60)
  const secs = Math.floor(elapsed % 60)
  elapsedFormatted.value = `${mins}:${secs.toString().padStart(2, '0')}`

  // Push to liveStats store so navbar HUD stays in sync
  liveStats.set(wpm.value, accuracy.value, elapsedFormatted.value, progress.value)
}
```

### `getEffectiveElapsed()` — pause-aware timer

```ts
// lines 27-31
function getEffectiveElapsed(): number {
  if (!store.startTime) return 0
  // If currently paused, subtract how long we've been paused so far
  const pausedNow = store.isPaused && store.pausedAt ? Date.now() - store.pausedAt : 0
  return (Date.now() - store.startTime - store.totalPausedMs - pausedNow) / 1000
}
```

**Example:** user started at `t=0`, paused at `t=10s` for `5s`, resumed at `t=15s`.  
If we check at `t=20s`:

```
totalPausedMs = 5000ms
pausedNow     = 0 (not currently paused)
elapsed = (20000 - 0 - 5000 - 0) / 1000 = 15s  ← correctly 15s of real typing time
```

---

## 8. Phase 5 — Completion & Final Stats

When `currentIndex >= charCount` after the last correct character:

```ts
// useTypingEngine.ts  lines 108-113
if (typingStore.currentIndex >= typingStore.charCount) {
  completeTyping()
  return 'complete'
}
```

### `completeTyping()`

```ts
// lines 131-157
function completeTyping() {
  typingStore.markComplete() // isComplete=true, isActive=false
  stats.stopTimer() // kills the 200ms interval
  stats.computeFinalStats() // one final precise calculation

  // Check personal best
  const prevBest = historyStore.bestWpm
  isNewPB.value = stats.wpm.value > prevBest

  // Save to history
  historyStore.addEntry({
    fileName: typingStore.fileName,
    language: snippetsStore.selectedLanguageId,
    wpm: stats.wpm.value,
    rawWpm: stats.rawWpm.value,
    cpm: stats.cpm.value,
    accuracy: stats.accuracy.value,
    elapsedSeconds: stats.elapsedSeconds.value,
    time: stats.elapsedFormatted.value,
    chars: typingStore.charCount, // total chars in snippet (13)
    errors: typingStore.totalErrors, // (1)
    date: new Date().toISOString(),
    errorMap: { ...sessionErrorMap }, // { 'x': 1 }
  })

  // Show results panel after 350ms delay
  resultsTimeout = setTimeout(() => {
    showResults.value = true
  }, RESULTS_SHOW_DELAY_MS)
}
```

### `computeFinalStats()`

```ts
// useTypingStats.ts  lines 77-81
function computeFinalStats() {
  if (!store.startTime) return
  progress.value = 100
  calcStats(store.charCount) // ← uses TOTAL charCount, not currentIndex
}
```

For live updates `calcStats(store.currentIndex)` is used (chars typed so far).  
For the final result `calcStats(store.charCount)` is used (all chars in snippet).  
This gives the most precise final score.

---

## 9. Formula Reference

### WPM (Words Per Minute) — Net Speed

```
WPM = round( correctChars / 5 / minutes )
```

The industry-standard "word" = **5 characters** (including spaces).  
`correctChars` = `store.charCount` at completion (only correct chars count).

**Our example:** 13 chars in 30 seconds (0.5 min)

```
WPM = round(13 / 5 / 0.5)
    = round(13 / 2.5)
    = round(5.2)
    = 5 WPM
```

> For a real snippet of 500 chars typed in 2 minutes: `500 / 5 / 2 = 50 WPM`

---

### Raw WPM — Gross Speed (includes mistakes)

```
rawWPM = round( totalKeystrokes / 5 / minutes )
```

`totalKeystrokes` = every key pressed, right or wrong.

**Our example:** 14 keystrokes in 30 seconds

```
rawWPM = round(14 / 5 / 0.5)
       = round(14 / 2.5)
       = round(5.6)
       = 6 rawWPM
```

---

### CPM (Characters Per Minute)

```
CPM = round( correctChars / minutes )
```

**Our example:**

```
CPM = round(13 / 0.5) = round(26) = 26 CPM
```

---

### Accuracy

```
accuracy = round( (totalKeystrokes - totalErrors) / totalKeystrokes * 100 )
```

**Our example:** 14 keystrokes, 1 error

```
accuracy = round( (14 - 1) / 14 * 100 )
         = round( 13 / 14 * 100 )
         = round( 92.857... )
         = 93%
```

If no keystrokes yet → accuracy defaults to `100`.

---

### Progress Percent

```ts
// stores/typing.ts  lines 21-23
const progressPercent = computed(() =>
  code.value.length > 0 ? Math.round((currentIndex.value / code.value.length) * 100) : 0,
)
```

**Our example at keystroke 7:**

```
progressPercent = round(7 / 13 * 100) = round(53.8) = 54%
```

---

### Mistakes (Error Map)

```ts
// useTypingEngine.ts  lines 104-106
sessionErrorMap[expected] = (sessionErrorMap[expected] || 0) + 1
```

Each time a wrong key is pressed, the **expected** character (not the typed character) is recorded.

**Our example after the `y` mistake on position 6:**

```js
sessionErrorMap = { x: 1 }
// meaning: the character 'x' was missed 1 time
```

This map is saved to `HistoryEntry.errorMap` and powers the Error Heatmap on the stats page via:

```ts
// utils/historyAnalytics.ts  lines 141-153
export function computeErrorHeatmap(entries: HistoryEntry[]): ErrorHeatmapEntry[] {
  const map = new Map<string, number>()
  for (const e of entries) {
    if (!e.errorMap) continue
    for (const [ch, count] of Object.entries(e.errorMap)) {
      map.set(ch, (map.get(ch) || 0) + count) // accumulate across sessions
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1]) // most-missed first
    .slice(0, ERROR_HEATMAP_TOP_N) // top 15
    .map(([char, count]) => ({ char, count }))
}
```

---

## 10. Full Example Walkthrough Table

Code: `const x = 1;\n` (13 chars) | Total time: 30 seconds

| #   | Key Pressed   | Expected | Match? | `currentIndex` | `totalKeystrokes` | `totalErrors` | `charStates[i]` | Notes                   |
| --- | ------------- | -------- | ------ | -------------- | ----------------- | ------------- | --------------- | ----------------------- |
| —   | —             | —        | —      | 0              | 0                 | 0             | all pending     | Session start           |
| 1   | `c`           | `c`      | ✅     | 1              | 1                 | 0             | [0]=correct     | Timer starts            |
| 2   | `o`           | `o`      | ✅     | 2              | 2                 | 0             | [1]=correct     |                         |
| 3   | `n`           | `n`      | ✅     | 3              | 3                 | 0             | [2]=correct     |                         |
| 4   | `s`           | `s`      | ✅     | 4              | 4                 | 0             | [3]=correct     |                         |
| 5   | `t`           | `t`      | ✅     | 5              | 5                 | 0             | [4]=correct     |                         |
| 6   | `Space`       | `Space`  | ✅     | 6              | 6                 | 0             | [5]=correct     |                         |
| 7   | `y`           | `x`      | ❌     | 7              | 7                 | 1             | [6]=incorrect   | `sessionErrorMap={x:1}` |
| 8   | `⌫ Backspace` | —        | —      | 6              | 7                 | 1             | [6]=**pending** | Counters unchanged      |
| 9   | `x`           | `x`      | ✅     | 7              | 8                 | 1             | [6]=correct     | Corrected               |
| 10  | `Space`       | `Space`  | ✅     | 8              | 9                 | 1             | [7]=correct     |                         |
| 11  | `=`           | `=`      | ✅     | 9              | 10                | 1             | [8]=correct     |                         |
| 12  | `Space`       | `Space`  | ✅     | 10             | 11                | 1             | [9]=correct     |                         |
| 13  | `1`           | `1`      | ✅     | 11             | 12                | 1             | [10]=correct    |                         |
| 14  | `;`           | `;`      | ✅     | 12             | 13                | 1             | [11]=correct    |                         |
| 15  | `Enter`       | `\n`     | ✅     | 13             | 14                | 1             | [12]=correct    | **Session complete**    |

**Final computed values** (30s = 0.5 min):

| Metric    | Calculation                  | Result       |
| --------- | ---------------------------- | ------------ |
| WPM       | `round(13 / 5 / 0.5)`        | **5 WPM**    |
| Raw WPM   | `round(14 / 5 / 0.5)`        | **6 rawWPM** |
| CPM       | `round(13 / 0.5)`            | **26 CPM**   |
| Accuracy  | `round((14 - 1) / 14 * 100)` | **93%**      |
| Mistakes  | `totalErrors`                | **1**        |
| Error Map | `sessionErrorMap`            | `{ x: 1 }`   |
| Progress  | `100%`                       | ✅ Complete  |

---

## 11. Edge Cases & Design Decisions

### Backspace does NOT forgive errors

The decision to keep `totalErrors` immutable after a backspace is deliberate:

- It preserves the true cost of a mistake
- It means `rawWPM > WPM` is a signal of how many extra keystrokes were wasted

### WPM denominator is always 5

The "5 chars = 1 word" convention is the global typing-test standard (used by Monkeytype, TypeRacer, etc.). It makes WPM language-agnostic regardless of average word length.

### Pause time is excluded from elapsed

```ts
// The key subtraction in getEffectiveElapsed():
return (Date.now() - store.startTime - store.totalPausedMs - pausedNow) / 1000
```

This ensures the user is not penalised for pausing. The timer resumes cleanly using `totalPausedMs` which accumulates pause durations.

### Live stats update every 200 ms

```ts
// utils/constants.ts  line 1
export const STATS_UPDATE_INTERVAL_MS = 200
```

Fast enough to feel real-time; slow enough to avoid thrashing reactivity.

### Accuracy history sampled every 1 second (max 120 points)

```ts
// utils/constants.ts  lines 2-3
export const ACCURACY_SAMPLE_INTERVAL_S = 1
export const MAX_ACCURACY_SAMPLES = 120 // 2 minutes of data
```

Powers the live accuracy sparkline shown during typing.

### Tab key expands to spaces before comparison

```ts
// composables/useTypingEngine.ts  line 69
const code = result.code.replace(/\t/g, tabSpaces) // tabs → N spaces
```

And in the keyboard handler:

```ts
// composables/useKeyboardHandler.ts  lines 12-19
if (e.key === 'Tab') {
  const spaces = ' '.repeat(getTabSize())
  for (const ch of spaces) {
    callbacks.onChar(ch)
  }
}
```

So pressing `Tab` generates N individual space `processChar(' ')` calls, matching the N spaces in the code string. The user never needs to type an actual tab character.

### Results panel delayed 350 ms

```ts
// utils/constants.ts  line 6
export const RESULTS_SHOW_DELAY_MS = 350
```

A short fade-in delay so the final character animation can complete before the overlay appears, making the UX feel less jarring.

---

_Generated from source analysis of `code-typewriter` — April 2026_
