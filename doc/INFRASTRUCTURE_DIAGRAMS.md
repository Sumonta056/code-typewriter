# Infrastructure Diagrams — Code Typewriter

> All diagrams use Mermaid syntax. A complete overview is given first, followed by focused sub-diagrams for each major flow.

---

## Quick Notes (Key Facts)

- **No backend.** Everything is client-side. GitHub files are fetched directly from the browser.
- **No accounts.** All persistence is `localStorage` only.
- **One orchestrator.** `useIndexPage` is the only composable `index.vue` touches directly.
- **One timer.** `useTypingStats` runs a 200 ms `setInterval` for all live stat updates.
- **One write bus.** `liveStats` store is a thin bucket — only `useTypingStats` writes to it; `NavStats` reads from it.
- **Tokenizer runs once.** After a file loads, `tokenizeCode()` in `shikiHighlighter.ts` assigns a Shiki color to every character. It never runs again mid-session (unless the theme changes).
- **`charStates` uses `shallowRef` + `triggerRef`.** Only changed characters cause re-renders in `CodeDisplay`.
- **Settings are reactive.** CSS variables are re-applied instantly on every change via `applyCssVariables()`.
- **Snippets are pre-built.** `public/snippets.json` is synced from `Prototype/snippets.json` at build time.

---

## 1 — Complete System Overview

```mermaid
graph TD
    subgraph Browser["Browser (SPA — SSR disabled)"]
        subgraph Boot["App Boot (client-init.plugin.ts)"]
            P1[Load settings from localStorage]
            P2[Load history from localStorage]
            P3[Load bookmarks from localStorage]
            P4[Fetch /snippets.json]
        end

        subgraph Page["pages/index.vue → useIndexPage"]
            UI[User Interface]
        end

        subgraph Composables["Composables (Logic Layer)"]
            UIE[useTypingEngine]
            UIS[useTypingStats — 200ms timer]
            UIK[useKeyboardHandler]
            UIG[useGithubFetcher]
            USCR[useScrollTracker]
        end

        subgraph Stores["Pinia Stores (State Layer)"]
            ST[typing.ts — session state]
            SS[snippets.ts — language list]
            SE[settings.ts — user prefs]
            SH[history.ts — past sessions]
            SL[liveStats.ts — live WPM/ACC/TIME]
            SB[bookmarks.ts — saved files]
        end

        subgraph Utils["Utils (Pure Functions)"]
            SHK[shikiHighlighter.ts — Shiki tokenizer]
            HA[historyAnalytics.ts]
            TH[themes.ts]
            CN[constants.ts]
        end

        subgraph Components["Key Components"]
            CD[CodeDisplay.vue — v-memo char loop]
            NS[NavStats.vue — reads liveStats]
            RC[ResultsCard.vue]
            SP[SettingsPanel.vue]
        end
    end

    subgraph External
        GH[GitHub API / raw.githubusercontent.com]
        LS[localStorage]
    end

    Boot --> Stores
    Page --> Composables
    Composables --> Stores
    Stores --> Components
    UIG --> GH
    Stores --> LS
    Utils --> Composables
```

---

## 2 — Page Load Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Plugin as client-init.plugin.ts
    participant Settings as settingsStore
    participant History as historyStore
    participant Bookmarks as bookmarksStore
    participant Snippets as snippetsStore
    participant Theme as themes.ts
    participant GH as /snippets.json

    Browser->>Plugin: App mounted (client only)
    Plugin->>Settings: loadFromStorage()
    Settings->>Settings: parse localStorage → merge + clamp values
    Settings->>Theme: applyCssVariables() → write CSS vars to :root

    Plugin->>History: loadFromStorage()
    History->>History: parse localStorage → HistoryEntry[]

    Plugin->>Bookmarks: loadFromStorage()
    Plugin->>Snippets: loadSnippets()
    Snippets->>GH: $fetch('/snippets.json')
    GH-->>Snippets: { languages: [...] }
    Snippets->>Snippets: auto-select first language

    Note over Browser: index.vue renders with sidebar ready
    Note over Browser: TypingPlaceholder shown (no code loaded yet)
```

---

## 3 — Language Select + File Load Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as index.vue / useIndexPage
    participant Snippets as snippetsStore
    participant Engine as useTypingEngine
    participant Fetcher as useGithubFetcher
    participant Shiki as shikiHighlighter.ts
    participant TypingStore as typing store
    participant Stats as useTypingStats

    User->>UI: Selects a language from dropdown
    UI->>Snippets: selectLanguage(id)
    UI->>Engine: loadRandomFile()
    Engine->>Snippets: getRandomFile() → picks random file URL from selected language
    Engine->>Fetcher: fetchCode(url, maxLines)

    Fetcher->>Fetcher: parseGitHubUrl(url) → extract owner/repo/branch/path
    Fetcher->>GH: fetch GitHub API (with Accept: vnd.github.v3.raw)
    alt API success
        GH-->>Fetcher: raw file content
    else API fails
        Fetcher->>GH: fetch raw.githubusercontent.com URL (fallback)
        GH-->>Fetcher: raw file content
    end

    Fetcher->>Fetcher: trim to maxLines, normalize line endings
    Fetcher-->>Engine: { code, fileName }

    Engine->>Engine: replace \t with spaces (tabSize setting)
    Engine->>Shiki: tokenizeCode(code, url, theme) → string[] (hex color per char)
    Engine->>TypingStore: setupSession(code, tokens, fileName, url)
    TypingStore->>TypingStore: charStates = new Array(n).fill('pending')

    Engine->>Stats: resetStats()
    Engine-->>UI: success → focusHiddenInput()

    Note over UI: CodeDisplay renders — TypingPlaceholder hidden
```

---

## 4 — Custom GitHub URL Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as useIndexPage
    participant Fetcher as useGithubFetcher
    participant Engine as useTypingEngine

    User->>UI: Opens URL panel, pastes GitHub link
    UI->>Fetcher: parseGitHubUrl(input)

    alt Invalid URL (too few path segments)
        Fetcher-->>UI: null
        UI->>UI: urlError = true → reset after 1.5s
    else Valid URL
        Fetcher-->>UI: { owner, repo, branch, path }
        UI->>Engine: loadCode(url, filename)
        Note over Engine: Same flow as diagram 3 from here
        Engine-->>UI: success → close URL panel, focus input
    end
```

---

## 5 — Keystroke Flow (What Happens When You Type)

```mermaid
sequenceDiagram
    participant User
    participant HI as HiddenInput.vue
    participant KH as useKeyboardHandler
    participant IP as useIndexPage (onKeyDown)
    participant Engine as useTypingEngine
    participant TS as typing store
    participant Stats as useTypingStats
    participant LS as liveStats store
    participant CD as CodeDisplay.vue

    User->>HI: keydown event
    HI->>IP: emit @keydown
    IP->>KH: handleKeyDown(e, callbacks)

    alt Tab key
        KH->>Engine: onChar(' ') × tabSize times
    else Enter key
        KH->>Engine: onChar('\n')
    else Backspace
        KH->>Engine: onBackspace() → processBackspace()
    else Regular character
        KH->>Engine: onChar(key) → processChar(char)
    end

    Engine->>TS: startTimer() if first keystroke
    Engine->>Stats: startTimer() — begins 200ms interval

    Engine->>TS: compare char vs expected code[currentIndex]

    alt Correct character
        TS->>TS: charStates[i] = 'correct', currentIndex++, totalKeystrokes++
        TS->>TS: triggerRef(charStates) — minimal re-render
    else Wrong character
        TS->>TS: charStates[i] = 'incorrect', currentIndex++, totalKeystrokes++, totalErrors++
        Engine->>Engine: sessionErrorMap[expected]++
    end

    TS-->>CD: charStates shallowRef change → re-render only changed span

    Note over Stats: Every 200ms independently:
    Stats->>TS: read currentIndex, totalKeystrokes, totalErrors, startTime
    Stats->>Stats: WPM = (currentIndex/5) / minutes
    Stats->>Stats: Accuracy = (keystrokes - errors) / keystrokes × 100
    Stats->>LS: liveStats.set(wpm, acc, elapsed, progress)
    LS-->>NavStats: NavStats.vue reads liveStats reactive refs

    alt Session complete (currentIndex >= charCount)
        Engine->>TS: markComplete()
        Engine->>Stats: stopTimer(), computeFinalStats()
        Engine->>History: addEntry({ wpm, accuracy, errors, ... })
        Engine->>Engine: setTimeout 350ms → showResults = true
    end
```

---

## 6 — Accuracy Calculation

```mermaid
flowchart TD
    A[User presses a key] --> B{Is key correct?}
    B -->|Yes| C[totalKeystrokes++]
    B -->|No| D[totalKeystrokes++\ntotalErrors++]
    C --> E[Every 200ms: useTypingStats.update]
    D --> E

    E --> F{totalKeystrokes > 0?}
    F -->|Yes| G["accuracy = round((keystrokes - errors) / keystrokes × 100)"]
    F -->|No| H[accuracy = 100]

    G --> I[liveStats.set wpm, acc, elapsed, progress]
    H --> I
    I --> J[NavStats.vue reads liveStats.accuracy]

    E --> K{elapsed > 0 AND samples < 120?}
    K -->|Yes, every 1s| L[accuracyHistory.push currentAccuracy]
    L --> M[Used for profile AccuracySparkline]

    subgraph FinalCalc["On Session Complete"]
        N[computeFinalStats] --> O["WPM = charCount / 5 / minutes (net WPM)"]
        N --> P["rawWpm = totalKeystrokes / 5 / minutes"]
        N --> Q["accuracy = final formula"]
        N --> R[liveStats updated one last time]
        R --> S[historyStore.addEntry saves to localStorage]
    end
```

---

## 7 — Settings Change Flow

```mermaid
sequenceDiagram
    participant User
    participant SP as SettingsPanel.vue
    participant SS as settingsStore
    participant CSS as :root CSS variables
    participant Engine as useTypingEngine

    User->>SP: Clicks +/- on font size (or toggles a setting)
    SP->>SS: updateNumeric('fontSize', +1)
    SS->>SS: clamp value within min/max bounds
    SS->>SS: saveToStorage() → localStorage
    SS->>CSS: applyCssVariables() → document.documentElement.style.setProperty

    Note over CSS: --code-font-size updates instantly
    Note over CSS: CodeDisplay re-renders with new font size

    alt User changes maxLines
        User->>SP: Increase maxLines
        SP->>SS: updateNumeric('maxLines', +10)
        SS->>Engine: watch(maxLines) triggers
        Engine->>Engine: if file loaded AND no typing started yet
        Engine->>Engine: reload same file URL with new maxLines
    end

    alt User changes theme
        User->>SP: Click Dark / Monokai / Solarized
        SP->>SS: setTheme('monokai')
        SS->>CSS: applyTheme() → write all palette CSS vars
        Note over CSS: Entire color scheme updates instantly
    end
```

---

## 8 — Session Complete → Results → History Flow

```mermaid
sequenceDiagram
    participant Engine as useTypingEngine
    participant Stats as useTypingStats
    participant TS as typing store
    participant HS as historyStore
    participant LS as localStorage
    participant RO as ResultsOverlay.vue
    participant Profile as profile.vue

    Engine->>TS: markComplete() — isComplete=true, isActive=false
    Engine->>Stats: stopTimer() — clears 200ms interval
    Engine->>Stats: computeFinalStats() — final WPM/ACC with full charCount
    Stats->>Stats: elapsedFormatted, wpm, accuracy, cpm, rawWpm

    Engine->>HS: addEntry({ wpm, rawWpm, cpm, accuracy, time, errors, errorMap, ... })
    HS->>HS: entries.unshift(entry) — newest first, cap at 100
    HS->>LS: saveToStorage() — persist immediately

    Engine->>Engine: setTimeout(350ms) → showResults = true
    Engine-->>RO: showResults prop = true → overlay fades in
    RO->>RO: animate WPM counter from 0 → final value

    User->>RO: Clicks "Try Again"
    RO->>Engine: retrySession() → reset charStates, stats, index
    Note over Engine: Same file reloads, ready to type again

    User->>RO: Clicks "New File"
    RO->>Engine: loadRandomFile() → full fetch flow again

    Note over Profile: profile.vue reads historyStore
    Profile->>HS: wpmTrend, languageStats, calendarData, errorHeatmap
    HS->>HA: historyAnalytics.ts pure functions compute all aggregates
```

---

## 9 — Store + Component Dependency Map

```mermaid
graph LR
    subgraph Stores
        TS[typing]
        SS[snippets]
        SE[settings]
        SH[history]
        SL[liveStats]
        SB[bookmarks]
    end

    subgraph Composables
        UIE[useTypingEngine]
        UIS[useTypingStats]
        UIK[useKeyboardHandler]
        UIG[useGithubFetcher]
        UIP[useIndexPage]
        USR[useScrollTracker]
    end

    subgraph Pages
        IDX[index.vue]
        PRF[profile.vue]
    end

    subgraph Components
        NS[NavStats]
        CD[CodeDisplay]
        RC[ResultsCard]
        SP[SettingsPanel]
        FTB[FileTabBar]
        PP[TypingPlaceholder]
    end

    UIP --> UIE
    UIP --> UIK
    UIP --> USR
    UIE --> UIS
    UIE --> UIG
    UIE --> TS
    UIE --> SS
    UIE --> SE
    UIE --> SH
    UIS --> TS
    UIS --> SL

    IDX --> UIP
    IDX --> TS
    IDX --> SS
    IDX --> SE
    IDX --> SB

    PRF --> SH

    NS --> SL
    CD --> TS
    RC -.->|props| UIE
    SP --> SE
    FTB --> TS
    PP -.->|shown when no code| TS
```

---

## 10 — Data Persistence Map

```mermaid
flowchart LR
    subgraph Written["Written to localStorage"]
        A[settings — font, tabSize, maxLines, theme, lineNumbers, smoothCaret]
        B[history — up to 100 HistoryEntry objects]
        C[bookmarks — BookmarkedFile array]
        D[intro-seen flag — one-time welcome overlay]
    end

    subgraph NotPersisted["NOT persisted — resets on reload"]
        E[typing state — current session]
        F[liveStats — WPM / ACC / TIME]
        G[snippets — re-fetched from /snippets.json]
    end

    subgraph ReadOn["Read on boot — client-init.plugin.ts"]
        H[settingsStore.loadFromStorage]
        I[historyStore.loadFromStorage]
        J[bookmarksStore.loadFromStorage]
        K[snippetsStore.loadSnippets — fetch]
    end

    A --> H
    B --> I
    C --> J
```

---

## Summary: The Core Loops

```
LOAD LOOP
  Boot → plugin → stores hydrate from localStorage + snippets.json fetched
  User clicks Start → random URL selected → GitHub fetch → tokenize → session ready

TYPING LOOP
  keydown → useKeyboardHandler → processChar → typing store mutates
  → CodeDisplay re-renders only changed char span (v-memo + shallowRef)
  → Every 200ms: useTypingStats.update → liveStats.set → NavStats reads

COMPLETION LOOP
  last char typed → completeTyping → stop timer → computeFinalStats
  → save to history → 350ms delay → ResultsOverlay shows

SETTINGS LOOP
  user changes setting → settingsStore updates → localStorage saved
  → CSS vars applied instantly to :root → UI reflects immediately
  → if maxLines changed + file loaded + not started: file reloads

PROFILE LOOP
  profile.vue mounts → reads historyStore computed props
  → historyAnalytics.ts pure functions compute aggregates on the fly
  → no extra fetch, everything from localStorage
```
