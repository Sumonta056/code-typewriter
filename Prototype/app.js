(() => {
  'use strict';

  // ═══ STATE ═══
  const state = {
    snippets: null,
    selectedLanguage: null,
    currentFile: null,
    code: '',
    chars: [],
    currentIndex: 0,
    totalErrors: 0,
    startTime: null,
    timerInterval: null,
    isComplete: false,
    typingTimeout: null,
    totalKeystrokes: 0,
    settings: {
      fontSize: 14,
      tabSize: 2,
      maxLines: 50,
      sound: false,
      lineNumbers: true,
      smoothCaret: true,
    },
  };

  // ═══ DOM ═══
  const $ = (id) => document.getElementById(id);
  const els = {
    languageSelector: $('languageSelector'),
    randomBtn: $('randomBtn'),
    resetBtn: $('resetBtn'),
    fileName: $('fileName'),
    fileProgress: $('fileProgress'),
    typingContainer: $('typingContainer'),
    typingPlaceholder: $('typingPlaceholder'),
    codeDisplay: $('codeDisplay'),
    lineNumbers: $('lineNumbers'),
    codeArea: $('codeArea'),
    hiddenInput: $('hiddenInput'),
    headerStats: $('headerStats'),
    liveWpmValue: $('liveWpmValue'),
    liveAccuracyValue: $('liveAccuracyValue'),
    liveTimeValue: $('liveTimeValue'),
    liveProgressValue: $('liveProgressValue'),
    wpmBar: $('wpmBar'),
    accBar: $('accBar'),
    progressBar: $('progressBar'),
    resultsOverlay: $('resultsOverlay'),
    resultWpm: $('resultWpm'),
    resultAccuracy: $('resultAccuracy'),
    resultTime: $('resultTime'),
    resultChars: $('resultChars'),
    resultErrors: $('resultErrors'),
    resultCpm: $('resultCpm'),
    resultRaw: $('resultRaw'),
    resultsFileName: $('resultsFileName'),
    retryBtn: $('retryBtn'),
    newFileBtn: $('newFileBtn'),
    loadingOverlay: $('loadingOverlay'),
    urlBtn: $('urlBtn'),
    urlPanel: $('urlPanel'),
    urlInput: $('urlInput'),
    urlFetchBtn: $('urlFetchBtn'),
    settingsBtn: $('settingsBtn'),
    settingsPanel: $('settingsPanel'),
    fontSizeValue: $('fontSizeValue'),
    tabSizeValue: $('tabSizeValue'),
    maxLinesValue: $('maxLinesValue'),
    soundToggle: $('soundToggle'),
    lineNumToggle: $('lineNumToggle'),
    smoothCaretToggle: $('smoothCaretToggle'),
    progressTrack: $('progressTrack'),
    progressFill: $('progressFill'),
    editorFrame: document.querySelector('.editor-frame'),
  };

  // ═══ AUDIO CONTEXT (lazy) ═══
  let audioCtx = null;
  function playKeySound() {
    if (!state.settings.sound) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = 600 + Math.random() * 200;
    gain.gain.value = 0.03;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }

  // ═══ GITHUB URL PARSER ═══
  // Accepts various formats:
  //   https://github.com/owner/repo/blob/branch/path
  //   owner/repo/blob/branch/path
  //   raw.githubusercontent.com/owner/repo/branch/path
  function parseGitHubUrl(input) {
    input = input.trim();

    // Strip protocol and domain
    input = input.replace(/^https?:\/\//, '');
    input = input.replace(/^(www\.)?github\.com\//, '');
    input = input.replace(/^raw\.githubusercontent\.com\//, '');

    // Now we have: owner/repo/blob/branch/path  OR  owner/repo/branch/path (raw format)
    const parts = input.split('/');
    if (parts.length < 4) return null;

    const owner = parts[0];
    const repo = parts[1];

    // If "blob" or "tree" is in position 2, skip it
    let branchStart = 2;
    if (parts[2] === 'blob' || parts[2] === 'tree') {
      branchStart = 3;
    }

    if (parts.length <= branchStart) return null;

    const branch = parts[branchStart];
    const path = parts.slice(branchStart + 1).join('/');

    if (!path) return null;

    return { owner, repo, branch, path };
  }

  function buildRawUrl(parsed) {
    return `https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${parsed.branch}/${parsed.path}`;
  }

  function buildApiUrl(parsed) {
    return `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/contents/${parsed.path}?ref=${parsed.branch}`;
  }

  // ═══ FETCH CODE ═══
  async function fetchCode(url, fileName) {
    els.loadingOverlay.classList.add('visible');

    try {
      // Try raw URL first (works with CORS on http servers)
      let code = null;
      const parsed = parseGitHubUrl(url);

      if (parsed) {
        // Try GitHub API (reliable CORS)
        try {
          const apiUrl = buildApiUrl(parsed);
          const res = await fetch(apiUrl, {
            headers: { 'Accept': 'application/vnd.github.v3.raw' }
          });
          if (res.ok) {
            code = await res.text();
          }
        } catch (_) { /* fall through */ }

        // Fallback: raw URL
        if (!code) {
          const rawUrl = buildRawUrl(parsed);
          const res = await fetch(rawUrl);
          if (res.ok) {
            code = await res.text();
          }
        }
      } else {
        // Direct URL fetch
        const res = await fetch(url);
        if (res.ok) {
          code = await res.text();
        }
      }

      if (!code) throw new Error('Could not fetch file');

      // Normalize line endings (\r\n → \n, stray \r → \n)
      code = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

      // Trim to max lines
      const lines = code.split('\n');
      if (lines.length > state.settings.maxLines) {
        code = lines.slice(0, state.settings.maxLines).join('\n');
      }

      // Clean whitespace
      code = code
        .split('\n')
        .map((l) => l.trimEnd())
        .join('\n')
        .trimEnd();

      if (!code) throw new Error('File is empty');

      state.currentFile = {
        name: fileName || (parsed ? parsed.path.split('/').pop() : 'file'),
        url: url,
      };
      state.code = code;

      setupTyping();
    } catch (e) {
      console.error('Fetch error:', e);
      els.fileName.textContent = 'Failed to load — check URL & try again';
    } finally {
      els.loadingOverlay.classList.remove('visible');
    }
  }

  // ═══ INIT ═══
  async function init() {
    try {
      const res = await fetch('snippets.json');
      state.snippets = await res.json();
      renderLanguageButtons();
    } catch (e) {
      console.error('Failed to load snippets.json:', e);
    }

    loadSettings();
    applySettings();
    bindEvents();
  }

  // ═══ LANGUAGE BUTTONS ═══
  function renderLanguageButtons() {
    els.languageSelector.innerHTML = '';
    state.snippets.languages.forEach((lang, i) => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn';
      btn.textContent = lang.name;
      btn.dataset.id = lang.id;
      btn.addEventListener('click', () => selectLanguage(lang.id));
      els.languageSelector.appendChild(btn);
      if (i === 0) selectLanguage(lang.id);
    });
  }

  function selectLanguage(id) {
    state.selectedLanguage = id;
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.id === id);
    });
  }

  // ═══ LOAD RANDOM ═══
  function loadRandomFile() {
    if (!state.selectedLanguage || !state.snippets) return;
    const lang = state.snippets.languages.find((l) => l.id === state.selectedLanguage);
    if (!lang || lang.files.length === 0) return;

    const file = lang.files[Math.floor(Math.random() * lang.files.length)];
    fetchCode(file.url, file.name);
  }

  // ═══ LOAD FROM URL ═══
  function loadFromUrl() {
    const input = els.urlInput.value.trim();
    if (!input) return;

    const parsed = parseGitHubUrl(input);
    if (!parsed) {
      els.urlInput.style.borderColor = 'var(--red)';
      setTimeout(() => { els.urlInput.style.borderColor = ''; }, 1500);
      return;
    }

    fetchCode(input, parsed.path.split('/').pop());
  }

  // ═══ SETUP TYPING ═══
  function setupTyping() {
    state.currentIndex = 0;
    state.totalErrors = 0;
    state.startTime = null;
    state.isComplete = false;
    state.totalKeystrokes = 0;
    clearInterval(state.timerInterval);
    state.timerInterval = null;

    els.fileName.textContent = state.currentFile.name;
    els.fileProgress.textContent = '';
    els.typingPlaceholder.style.display = 'none';
    els.codeDisplay.style.display = 'flex';
    els.headerStats.classList.add('visible');
    els.resultsOverlay.classList.remove('visible');
    els.progressTrack.classList.add('visible');

    // Reset live stats
    els.liveWpmValue.textContent = '0';
    els.liveAccuracyValue.innerHTML = '100<span class="stat-unit">%</span>';
    els.liveTimeValue.textContent = '0:00';
    els.liveProgressValue.innerHTML = '0<span class="stat-unit">%</span>';
    els.wpmBar.style.width = '0%';
    els.accBar.style.width = '100%';
    els.progressBar.style.width = '0%';
    els.progressFill.style.width = '0%';

    renderCode();

    els.hiddenInput.value = '';
    els.hiddenInput.focus();
  }

  // ═══ SYNTAX TOKENIZER ═══
  // Returns an array where each index = char position, value = token type string
  function tokenize(code) {
    const tokens = new Array(code.length).fill('plain');
    let i = 0;
    const len = code.length;

    const KEYWORDS = new Set([
      'const','let','var','function','return','if','else','for','while','do',
      'class','import','export','from','default','new','this','typeof','instanceof',
      'async','await','try','catch','finally','throw','switch','case','break',
      'continue','true','false','null','undefined','void','in','of','extends',
      'implements','interface','type','enum','readonly','abstract','static',
      'super','yield','delete','as','is','public','private','protected',
      'module','require','declare','namespace','keyof','infer','satisfies',
    ]);

    const CONTROL = new Set([
      'if','else','for','while','do','switch','case','break','continue',
      'return','throw','try','catch','finally','yield','await',
    ]);

    const BUILTIN = new Set([
      'console','window','document','Math','JSON','Object','Array','String',
      'Number','Boolean','Promise','Map','Set','WeakMap','WeakSet','Symbol',
      'RegExp','Error','TypeError','RangeError','Date','parseInt','parseFloat',
      'setTimeout','setInterval','clearTimeout','clearInterval','fetch',
      'process','global','globalThis','Proxy','Reflect',
    ]);

    function peek(offset) { return code[i + offset] || ''; }
    function isWordChar(c) { return /[\w$]/.test(c || ''); }

    function mark(from, to, type) {
      for (let j = from; j < to && j < len; j++) tokens[j] = type;
    }

    while (i < len) {
      const ch = code[i];

      // ── Line comment ──
      if (ch === '/' && peek(1) === '/') {
        const start = i;
        while (i < len && code[i] !== '\n') i++;
        mark(start, i, 'comment');
        continue;
      }

      // ── Block comment ──
      if (ch === '/' && peek(1) === '*') {
        const start = i;
        i += 2;
        while (i < len && !(code[i] === '*' && peek(1) === '/')) i++;
        i += 2;
        mark(start, i, 'comment');
        continue;
      }

      // ── Strings ──
      if (ch === "'" || ch === '"' || ch === '`') {
        const quote = ch;
        const start = i;
        i++;
        while (i < len) {
          if (code[i] === '\\') { i += 2; continue; }
          if (code[i] === quote) { i++; break; }
          // template literals can span lines
          if (quote !== '`' && code[i] === '\n') break;
          i++;
        }
        mark(start, i, 'string');
        continue;
      }

      // ── Numbers ──
      if (/\d/.test(ch) || (ch === '.' && /\d/.test(peek(1)))) {
        const start = i;
        if (ch === '0' && (peek(1) === 'x' || peek(1) === 'X')) {
          i += 2;
          while (i < len && /[\da-fA-F_]/.test(code[i])) i++;
        } else if (ch === '0' && (peek(1) === 'b' || peek(1) === 'B')) {
          i += 2;
          while (i < len && /[01_]/.test(code[i])) i++;
        } else {
          while (i < len && /[\d._eE]/.test(code[i])) i++;
          if (code[i] === 'n') i++; // BigInt
        }
        mark(start, i, 'number');
        continue;
      }

      // ── HTML tags (for Vue/Nuxt templates) ──
      if (ch === '<' && (peek(1) === '/' || /[a-zA-Z!]/.test(peek(1)))) {
        const start = i;
        // Check it looks like a tag, not comparison
        const rest = code.slice(i, i + 40);
        if (/^<\/?[a-zA-Z!]/.test(rest)) {
          // Mark < and tag name
          i++; // <
          if (code[i] === '/') i++;
          const nameStart = i;
          while (i < len && /[\w\-.]/.test(code[i])) i++;
          mark(start, nameStart, 'tag-bracket');
          mark(nameStart, i, 'tag-name');
          // Inside tag: attributes until >
          while (i < len && code[i] !== '>') {
            if (code[i] === '=' || code[i] === ' ' || code[i] === '\n' || code[i] === '\t') {
              i++;
            } else if (code[i] === '"' || code[i] === "'") {
              const qs = i;
              const q = code[i]; i++;
              while (i < len && code[i] !== q) i++;
              i++;
              mark(qs, i, 'string');
            } else if (code[i] === ':' || code[i] === '@' || code[i] === 'v' && peek(1) === '-') {
              const ds = i;
              while (i < len && /[\w\-:@.]/.test(code[i])) i++;
              mark(ds, i, 'tag-attr-special');
            } else if (/[\w\-]/.test(code[i])) {
              const as = i;
              while (i < len && /[\w\-]/.test(code[i])) i++;
              mark(as, i, 'tag-attr');
            } else if (code[i] === '/') {
              tokens[i] = 'tag-bracket';
              i++;
            } else {
              i++;
            }
          }
          if (i < len && code[i] === '>') {
            tokens[i] = 'tag-bracket';
            i++;
          }
          continue;
        }
      }

      // ── Decorator ──
      if (ch === '@' && /[a-zA-Z]/.test(peek(1))) {
        const start = i;
        i++;
        while (i < len && isWordChar(code[i])) i++;
        mark(start, i, 'decorator');
        continue;
      }

      // ── Words (identifiers, keywords) ──
      if (/[a-zA-Z_$]/.test(ch)) {
        const start = i;
        while (i < len && isWordChar(code[i])) i++;
        const word = code.slice(start, i);

        if (CONTROL.has(word)) {
          mark(start, i, 'control');
        } else if (word === 'true' || word === 'false') {
          mark(start, i, 'boolean');
        } else if (word === 'null' || word === 'undefined' || word === 'void') {
          mark(start, i, 'null');
        } else if (word === 'import' || word === 'export' || word === 'from' || word === 'as' || word === 'default') {
          mark(start, i, 'import');
        } else if (KEYWORDS.has(word)) {
          mark(start, i, 'keyword');
        } else if (BUILTIN.has(word)) {
          mark(start, i, 'builtin');
        } else if (/^[A-Z]/.test(word) && word.length > 1) {
          mark(start, i, 'type');
        } else if (i < len && code[i] === '(') {
          mark(start, i, 'func-call');
        } else {
          // Check if preceded by a dot → property
          let prevNonSpace = start - 1;
          while (prevNonSpace >= 0 && code[prevNonSpace] === ' ') prevNonSpace--;
          if (prevNonSpace >= 0 && code[prevNonSpace] === '.') {
            mark(start, i, 'property');
          }
        }
        continue;
      }

      // ── Operators ──
      if ('=+-*/<>!&|?:^%~'.includes(ch)) {
        tokens[i] = 'operator';
        i++;
        continue;
      }

      // ── Brackets ──
      if ('()[]'.includes(ch)) {
        tokens[i] = 'bracket';
        i++;
        continue;
      }

      if ('{}'.includes(ch)) {
        tokens[i] = 'brace';
        i++;
        continue;
      }

      // ── Punctuation ──
      if (';,.'.includes(ch)) {
        tokens[i] = 'punctuation';
        i++;
        continue;
      }

      i++;
    }

    return tokens;
  }

  function renderCode() {
    const lines = state.code.split('\n');
    state.chars = [];

    // Tokenize for syntax colors
    const tokens = tokenize(state.code);

    els.lineNumbers.innerHTML = lines.map((_, i) => `<div>${i + 1}</div>`).join('');
    els.codeArea.innerHTML = '';

    for (let i = 0; i < state.code.length; i++) {
      const ch = state.code[i];
      const span = document.createElement('span');
      span.className = `char pending syn-${tokens[i]}`;
      span.textContent = ch;
      state.chars.push(span);
      els.codeArea.appendChild(span);
    }

    if (state.chars.length > 0) {
      state.chars[0].classList.add('current');
    }
  }

  // ═══ TYPING ═══
  function handleKeyDown(e) {
    if (state.isComplete || state.chars.length === 0) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      processCharacter('\t');
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      processCharacter('\n');
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length > 1) return;

    e.preventDefault();
    processCharacter(e.key);
  }

  function processCharacter(typed) {
    if (state.currentIndex >= state.code.length) return;

    if (!state.startTime) {
      state.startTime = Date.now();
      state.timerInterval = setInterval(updateLiveStats, 200);
    }

    state.totalKeystrokes++;
    setTypingActive();
    playKeySound();

    const expected = state.code[state.currentIndex];
    const charEl = state.chars[state.currentIndex];

    charEl.classList.remove('current', 'pending');

    if (typed === expected) {
      charEl.classList.add('correct');
    } else {
      charEl.classList.add('incorrect');
      state.totalErrors++;
    }

    state.currentIndex++;
    updateProgress();

    if (state.currentIndex >= state.code.length) {
      completeTyping();
      return;
    }

    state.chars[state.currentIndex].classList.add('current');
    scrollToCurrentChar();
  }

  function handleBackspace() {
    if (state.currentIndex <= 0) return;
    setTypingActive();

    if (state.currentIndex < state.chars.length) {
      state.chars[state.currentIndex].classList.remove('current');
    }

    state.currentIndex--;
    const charEl = state.chars[state.currentIndex];

    if (charEl.classList.contains('incorrect')) {
      state.totalErrors = Math.max(0, state.totalErrors - 1);
    }

    charEl.classList.remove('correct', 'incorrect');
    charEl.classList.add('pending', 'current');

    updateProgress();
    scrollToCurrentChar();
  }

  function updateProgress() {
    const pct = Math.round((state.currentIndex / state.code.length) * 100);
    els.fileProgress.textContent = `${state.currentIndex}/${state.code.length}`;
    els.progressFill.style.width = pct + '%';
  }

  function setTypingActive() {
    els.typingContainer.classList.add('typing-active');
    clearTimeout(state.typingTimeout);
    state.typingTimeout = setTimeout(() => {
      els.typingContainer.classList.remove('typing-active');
    }, 500);
  }

  function scrollToCurrentChar() {
    if (state.currentIndex >= state.chars.length) return;
    const el = state.chars[state.currentIndex];
    const container = els.codeDisplay;
    const r = el.getBoundingClientRect();
    const cr = container.getBoundingClientRect();

    if (r.top < cr.top + 50) {
      container.scrollTop -= (cr.top + 50 - r.top);
    } else if (r.bottom > cr.bottom - 50) {
      container.scrollTop += (r.bottom - cr.bottom + 50);
    }

    if (r.left < cr.left + 80) {
      container.scrollLeft -= (cr.left + 80 - r.left);
    } else if (r.right > cr.right - 40) {
      container.scrollLeft += (r.right - cr.right + 40);
    }
  }

  // ═══ LIVE STATS ═══
  function updateLiveStats() {
    if (!state.startTime || state.isComplete) return;

    const elapsed = (Date.now() - state.startTime) / 1000;
    const minutes = elapsed / 60;

    const wpm = minutes > 0 ? Math.round((state.currentIndex / 5) / minutes) : 0;
    const accuracy = state.totalKeystrokes > 0
      ? Math.round(((state.totalKeystrokes - state.totalErrors) / state.totalKeystrokes) * 100)
      : 100;
    const progress = Math.round((state.currentIndex / state.code.length) * 100);

    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);

    els.liveWpmValue.textContent = wpm;
    els.liveAccuracyValue.innerHTML = accuracy + '<span class="stat-unit">%</span>';
    els.liveTimeValue.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    els.liveProgressValue.innerHTML = progress + '<span class="stat-unit">%</span>';

    // Stat bars
    els.wpmBar.style.width = Math.min(wpm / 1.5, 100) + '%';
    els.accBar.style.width = accuracy + '%';
    els.progressBar.style.width = progress + '%';
  }

  // ═══ COMPLETE ═══
  function completeTyping() {
    state.isComplete = true;
    clearInterval(state.timerInterval);

    const elapsed = (Date.now() - state.startTime) / 1000;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.round((state.code.length / 5) / minutes) : 0;
    const rawWpm = minutes > 0 ? Math.round((state.totalKeystrokes / 5) / minutes) : 0;
    const cpm = minutes > 0 ? Math.round(state.code.length / minutes) : 0;
    const accuracy = state.totalKeystrokes > 0
      ? Math.round(((state.totalKeystrokes - state.totalErrors) / state.totalKeystrokes) * 100)
      : 100;

    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);

    els.resultWpm.textContent = wpm;
    els.resultAccuracy.textContent = accuracy + '%';
    els.resultTime.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    els.resultChars.textContent = state.code.length;
    els.resultErrors.textContent = state.totalErrors;
    els.resultCpm.textContent = cpm;
    els.resultRaw.textContent = rawWpm;
    els.resultsFileName.textContent = state.currentFile.name;

    // Final update
    els.liveWpmValue.textContent = wpm;
    els.progressFill.style.width = '100%';

    setTimeout(() => {
      els.resultsOverlay.classList.add('visible');
    }, 350);
  }

  // ═══ SETTINGS ═══
  function loadSettings() {
    try {
      const saved = localStorage.getItem('codeTypeSettings');
      if (saved) Object.assign(state.settings, JSON.parse(saved));
    } catch (_) {}
  }

  function saveSettings() {
    try {
      localStorage.setItem('codeTypeSettings', JSON.stringify(state.settings));
    } catch (_) {}
  }

  function applySettings() {
    const s = state.settings;
    document.documentElement.style.setProperty('--code-font-size', s.fontSize + 'px');
    document.documentElement.style.setProperty('--code-tab-size', s.tabSize);

    els.fontSizeValue.textContent = s.fontSize;
    els.tabSizeValue.textContent = s.tabSize;
    els.maxLinesValue.textContent = s.maxLines;

    // Toggles
    updateToggle(els.soundToggle, s.sound);
    updateToggle(els.lineNumToggle, s.lineNumbers);
    updateToggle(els.smoothCaretToggle, s.smoothCaret);

    // Line numbers
    els.lineNumbers.classList.toggle('hidden', !s.lineNumbers);

    // Smooth caret
    els.typingContainer.classList.toggle('smooth-caret', s.smoothCaret);
  }

  function updateToggle(btn, val) {
    btn.classList.toggle('active', val);
    btn.textContent = val ? 'ON' : 'OFF';
    btn.dataset.on = val;
  }

  function handleSettingBtn(action, dir) {
    const s = state.settings;
    if (action === 'fontSize') {
      s.fontSize = Math.max(10, Math.min(24, s.fontSize + Number(dir)));
    } else if (action === 'tabSize') {
      s.tabSize = Math.max(1, Math.min(8, s.tabSize + Number(dir)));
    } else if (action === 'maxLines') {
      s.maxLines = Math.max(10, Math.min(200, s.maxLines + Number(dir)));
    }
    saveSettings();
    applySettings();
  }

  function handleToggle(key, btn) {
    state.settings[key] = !state.settings[key];
    saveSettings();
    applySettings();
  }

  // ═══ EVENTS ═══
  function bindEvents() {
    els.randomBtn.addEventListener('click', loadRandomFile);
    els.resetBtn.addEventListener('click', () => {
      if (state.currentFile) setupTyping();
    });

    els.retryBtn.addEventListener('click', () => {
      els.resultsOverlay.classList.remove('visible');
      if (state.currentFile) setupTyping();
    });

    els.newFileBtn.addEventListener('click', () => {
      els.resultsOverlay.classList.remove('visible');
      loadRandomFile();
    });

    // URL panel
    els.urlBtn.addEventListener('click', () => {
      const isOpen = els.urlPanel.classList.toggle('open');
      els.urlBtn.classList.toggle('active', isOpen);
      els.settingsPanel.classList.remove('open');
      els.settingsBtn.classList.remove('active');
      if (isOpen) els.urlInput.focus();
    });

    els.urlFetchBtn.addEventListener('click', loadFromUrl);
    els.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadFromUrl();
    });

    // Settings panel
    els.settingsBtn.addEventListener('click', () => {
      const isOpen = els.settingsPanel.classList.toggle('open');
      els.settingsBtn.classList.toggle('active', isOpen);
      els.urlPanel.classList.remove('open');
      els.urlBtn.classList.remove('active');
    });

    // Setting buttons
    document.querySelectorAll('.setting-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        handleSettingBtn(btn.dataset.action, btn.dataset.dir);
      });
    });

    // Toggles
    els.soundToggle.addEventListener('click', () => handleToggle('sound', els.soundToggle));
    els.lineNumToggle.addEventListener('click', () => handleToggle('lineNumbers', els.lineNumToggle));
    els.smoothCaretToggle.addEventListener('click', () => handleToggle('smoothCaret', els.smoothCaretToggle));

    // Typing
    els.hiddenInput.addEventListener('keydown', handleKeyDown);

    els.typingContainer.addEventListener('click', () => {
      if (state.chars.length > 0 && !state.isComplete) {
        els.hiddenInput.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.lang-btn')) return;
      if (state.chars.length > 0 && !state.isComplete) {
        els.hiddenInput.focus();
      }
    });

    window.addEventListener('focus', () => {
      if (state.chars.length > 0 && !state.isComplete) {
        els.hiddenInput.focus();
      }
    });
  }

  // ═══ START ═══
  init();
})();
