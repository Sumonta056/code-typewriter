# Architecture

This document describes the structure, data flow, and component hierarchy of Code Typewriter.

---

## 1. High-Level System Overview

```mermaid
graph TD
    A[Browser] -->|app start| B[client-init.plugin.ts]
    B -->|loadFromStorage| C[(localStorage)]
    B -->|loadSnippets| D[/public/snippets.json/]
    B --> E[Nuxt App Ready]

    E --> F[pages/index.vue]
    F -->|orchestrates| G[useTypingEngine]
    G -->|fetch| H[GitHub API / raw.githubusercontent.com]
    H -->|raw code string| G
    G -->|tokenize| I[useTokenizer]
    I -->|TokenType array| G
    G -->|setupSession| J[(typingStore)]

    F -->|keydown events| K[useKeyboardHandler]
    K -->|processChar / processBackspace| G
    G -->|advanceCorrect / advanceIncorrect| J
    G -->|live tick every 200ms| L[useTypingStats]
    G -->|playKeySound| M[useAudio / Web Audio API]
    G -->|scrollToIndex| N[useScrollTracker / rAF]

    J -->|charStates / currentIndex| O[EditorTypingContainer]
    L -->|wpm / accuracy / elapsed| P[StatsLiveStats]

    G -->|on complete| Q[historyStore]
    Q -->|persist| C
    G -->|showResults| R[ResultsOverlay]
```

---

## 2. Startup Sequence

```mermaid
sequenceDiagram
    participant Browser
    participant Plugin as client-init.plugin.ts
    participant SettingsStore
    participant HistoryStore
    participant SnippetsStore
    participant SnippetsJSON as /public/snippets.json

    Browser->>Plugin: app mounted (client only)
    Plugin->>SettingsStore: loadFromStorage()
    SettingsStore-->>Browser: apply CSS variables (font size, tab size)
    Plugin->>HistoryStore: loadFromStorage()
    Plugin->>SnippetsStore: loadSnippets()
    SnippetsStore->>SnippetsJSON: $fetch('/snippets.json')
    SnippetsJSON-->>SnippetsStore: { languages: [...] }
    SnippetsStore-->>Plugin: isLoaded = true, selectedLanguageId = languages[0].id
```

---

## 3. Code Loading Flow

```mermaid
sequenceDiagram
    participant User
    participant Page as pages/index.vue
    participant Engine as useTypingEngine
    participant Fetcher as useGithubFetcher
    participant Tokenizer as useTokenizer
    participant TypingStore

    User->>Page: click Random / paste URL / select language
    Page->>Engine: loadRandomFile() or loadCode(url, name)
    Engine->>Fetcher: fetchCode(url, maxLines)
    Fetcher->>Fetcher: parseGitHubUrl() → build API URL + raw URL
    Fetcher->>GitHub: fetch (API first, raw fallback)
    GitHub-->>Fetcher: raw code text
    Fetcher->>Fetcher: normalize line endings, trim, slice to maxLines
    Fetcher-->>Engine: { code, fileName }
    Engine->>Engine: expand tabs → spaces (per tabSize setting)
    Engine->>Tokenizer: tokenize(code)
    Tokenizer-->>Engine: TokenType[] (per-character token array)
    Engine->>TypingStore: setupSession(code, tokens, name, url)
    Engine->>useTypingStats: resetStats()
    Engine-->>Page: ok = true → focus hidden input
```

---

## 4. Typing Session Flow

```mermaid
sequenceDiagram
    participant User
    participant HiddenInput as UiHiddenInput
    participant KBHandler as useKeyboardHandler
    participant Engine as useTypingEngine
    participant TypingStore
    participant Stats as useTypingStats
    participant Audio as useAudio
    participant Scroller as useScrollTracker

    User->>HiddenInput: keydown event
    HiddenInput->>KBHandler: handleKeyDown(e, callbacks)
    KBHandler->>KBHandler: filter modifier keys, map Tab→\t Enter→\n

    alt Normal character
        KBHandler->>Engine: onChar(char)
        Engine->>TypingStore: startTimer() (first keystroke only)
        Engine->>Stats: startTimer() → setInterval 200ms
        Engine->>Audio: playKeySound(soundEnabled)
        Engine->>TypingStore: advanceCorrect() or advanceIncorrect()
        Engine->>Scroller: scrollToIndex(container, charEls, currentIndex)
    else Backspace
        KBHandler->>Engine: onBackspace()
        Engine->>TypingStore: goBack()
        Engine->>Scroller: scrollToIndex(...)
    end

    Stats-->>Page: wpm / accuracy / elapsed (reactive refs, updated every 200ms)
    TypingStore-->>EditorTypingContainer: charStates / currentIndex (reactive)
```

---

## 5. Session Completion Flow

```mermaid
sequenceDiagram
    participant Engine as useTypingEngine
    participant TypingStore
    participant Stats as useTypingStats
    participant HistoryStore
    participant ResultsOverlay

    Engine->>TypingStore: markComplete()
    Engine->>Stats: stopTimer()
    Engine->>Stats: computeFinalStats()
    Engine->>HistoryStore: addEntry({ wpm, accuracy, chars, errors, ... })
    HistoryStore->>localStorage: saveToStorage()
    Engine-->>ResultsOverlay: showResults = true (after 350ms delay)
    ResultsOverlay-->>User: display WPM, raw WPM, CPM, accuracy, time, errors

    alt Retry
        User->>Engine: retrySession()
        Engine->>TypingStore: reset()
        Engine->>Stats: resetStats()
    else New File
        User->>Engine: loadRandomFile()
        Note over Engine: same as Code Loading Flow
    end
```

---

## 6. Component Tree

```mermaid
graph TD
    AV[app.vue] --> NL[NuxtLayout → layouts/default.vue]
    NL --> NP[NuxtPage → pages/index.vue]

    NP --> SB[Sidebar]
    SB --> AL[AppLogo]
    SB --> LS[ToolbarLanguageSelector]
    SB --> TA[ToolbarActions]
    SB --> ST[StatsLiveStats]
    ST --> SBK[StatBlock]
    ST --> SBR[StatBar]

    NP --> ED[Editor Column]
    ED --> UP[PanelsUrlPanel]
    ED --> SP[PanelsSettingsPanel]
    SP --> SN[SettingNumeric]
    SP --> STG[SettingToggle]
    ED --> FT[EditorFileTabBar]
    ED --> EF[EditorFrame]
    EF --> TC[EditorTypingContainer]
    TC --> CD[EditorCodeDisplay]
    TC --> LN[EditorLineNumbers]
    TC --> TP[EditorTypingPlaceholder]
    ED --> PT[EditorProgressTrack]

    NP --> HI[UiHiddenInput]
    NP --> RO[ResultsOverlay]
    RO --> RC[ResultsCard]
    RC --> RI[ResultItem ×N]

    NP --> LO[OverlayLoadingOverlay]
```

---

## 7. State & Composable Map

```mermaid
graph LR
    subgraph Stores ["Pinia Stores (global state)"]
        TS[typingStore\ncode · charStates · currentIndex\ntotalErrors · isComplete · isActive]
        SS[settingsStore\nfontSize · tabSize · maxLines\nsound · lineNumbers · smoothCaret]
        SN[snippetsStore\nlanguages · selectedLanguageId\ngetRandomFile]
        HS[historyStore\nentries · averageWpm · bestWpm\nstreak · languageStats]
    end

    subgraph Composables ["Composables (logic units)"]
        TE[useTypingEngine\norchestrator]
        GF[useGithubFetcher\nHTTP · URL parsing]
        TK[useTokenizer\nsyntax highlighting]
        TStats[useTypingStats\nWPM · CPM · accuracy]
        KB[useKeyboardHandler\nkeydown filtering]
        AU[useAudio\nWeb Audio API]
        SC[useScrollTracker\nrAF scroll]
    end

    TE --> GF
    TE --> TK
    TE --> TStats
    TE --> AU
    TE --> TS
    TE --> SS
    TE --> SN
    TE --> HS

    Page[pages/index.vue] --> TE
    Page --> KB
    Page --> SC
    Page --> TS
    Page --> SS
    Page --> SN
```

---

## 8. Data Types

```mermaid
classDiagram
    class CharState {
        <<type>>
        'pending' | 'correct' | 'incorrect'
    }

    class TokenType {
        <<type>>
        plain | keyword | control | string
        number | comment | func-call | type
        builtin | operator | bracket | brace
        punctuation | property | boolean | null
        import | decorator | tag-bracket
        tag-name | tag-attr | tag-attr-special
    }

    class Language {
        +string id
        +string name
        +string extension
        +SnippetFile[] files
    }

    class SnippetFile {
        +string name
        +string url
    }

    class AppSettings {
        +number fontSize
        +number tabSize
        +number maxLines
        +boolean sound
        +boolean lineNumbers
        +boolean smoothCaret
    }

    class HistoryEntry {
        +string id
        +string fileName
        +string language
        +number wpm
        +number rawWpm
        +number cpm
        +number accuracy
        +number elapsedSeconds
        +string time
        +number chars
        +number errors
        +string date
    }

    Language "1" --> "many" SnippetFile
```

---

## 9. CSS Architecture

```mermaid
graph TD
    V[assets/css/variables.css\nDesign tokens: colors, fonts,\nspacing, radius, border] --> B
    B[assets/css/base.css\nReset, body, scrollbars,\nglobal layout primitives] --> T
    T[assets/css/transitions.css\nVue transition classes\nfade, slide, scale]
    V --> SC[Scoped component styles\nAll layout & component-specific CSS\nlives inside each .vue file]
```
