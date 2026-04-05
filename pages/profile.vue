<template>
  <div class="profile-page">
    <!-- Hero -->
    <header class="hero">
      <div class="hero-left">
        <h1 class="hero-title">Your <span class="hero-accent">Profile</span></h1>
        <p class="hero-sub">Track your progress and become a faster coder</p>
      </div>
      <div v-if="h.totalSessions > 0" class="hero-streak">
        <div class="streak-flame">
          {{ h.currentStreak > 0 ? '&#128293;' : '&#10060;' }}
        </div>
        <div class="streak-info">
          <span class="streak-value">{{ h.currentStreak }}</span>
          <span class="streak-label">day streak</span>
        </div>
      </div>
    </header>

    <!-- Summary Cards -->
    <div v-if="h.totalSessions > 0" class="stats-grid">
      <div class="stat-card stat-card--accent">
        <div class="stat-card-icon">&#9881;</div>
        <div class="stat-card-body">
          <span class="stat-card-value">{{ h.totalSessions }}</span>
          <span class="stat-card-label">Sessions</span>
        </div>
      </div>
      <div class="stat-card stat-card--blue">
        <div class="stat-card-icon">&#9889;</div>
        <div class="stat-card-body">
          <span class="stat-card-value">{{ h.averageWpm }}</span>
          <span class="stat-card-label">Avg WPM</span>
        </div>
      </div>
      <div class="stat-card stat-card--green">
        <div class="stat-card-icon">&#127942;</div>
        <div class="stat-card-body">
          <span class="stat-card-value">{{ h.bestWpm }}</span>
          <span class="stat-card-label">Best WPM</span>
        </div>
      </div>
      <div class="stat-card stat-card--purple">
        <div class="stat-card-icon">&#127919;</div>
        <div class="stat-card-body">
          <span class="stat-card-value">{{ h.averageAccuracy }}<small>%</small></span>
          <span class="stat-card-label">Avg Accuracy</span>
        </div>
      </div>
      <div class="stat-card stat-card--orange">
        <div class="stat-card-icon">&#9201;</div>
        <div class="stat-card-body">
          <span class="stat-card-value">{{ h.totalPracticeFormatted }}</span>
          <span class="stat-card-label">Total Practice</span>
        </div>
      </div>
      <div class="stat-card stat-card--red">
        <div class="stat-card-icon">&#128293;</div>
        <div class="stat-card-body">
          <span class="stat-card-value">{{ h.longestStreak }}</span>
          <span class="stat-card-label">Best Streak</span>
        </div>
      </div>
    </div>

    <!-- WPM Trend — SVG Line Chart -->
    <section v-if="h.wpmTrend.length > 1" class="section">
      <h2 class="section-title">
        WPM Trend <span class="section-badge">Last {{ h.wpmTrend.length }} sessions</span>
      </h2>
      <div class="chart-wrap">
        <div class="chart-y-labels">
          <span>{{ trendMax }}</span>
          <span>{{ Math.round(trendMax / 2) }}</span>
          <span>0</span>
        </div>
        <svg class="line-chart" :viewBox="`0 0 ${LC_W} ${LC_H}`" preserveAspectRatio="none">
          <!-- Grid lines -->
          <line
            v-for="pct in [0, 50, 100]"
            :key="pct"
            x1="0"
            :y1="lineChartY(pct)"
            :x2="LC_W"
            :y2="lineChartY(pct)"
            class="grid-line"
            :class="{ 'grid-line--faint': pct === 50 }"
          />
          <!-- Area fill -->
          <path :d="areaPath" class="chart-area" />
          <!-- Line -->
          <polyline :points="chartPoints" class="chart-line" />
          <!-- Data points -->
          <circle
            v-for="(pt, i) in h.wpmTrend"
            :key="i"
            :cx="lineChartX(i)"
            :cy="lineChartYForWpm(pt.wpm)"
            r="3"
            :class="['chart-dot', { 'chart-dot--latest': i === h.wpmTrend.length - 1 }]"
          >
            <title>{{ pt.wpm }} WPM · {{ pt.accuracy }}% · {{ pt.fileName }}</title>
          </circle>
        </svg>
      </div>
    </section>

    <!-- Calendar Heatmap -->
    <section v-if="h.totalSessions > 0" class="section">
      <h2 class="section-title">
        Practice Calendar
        <span class="section-badge">Last 52 weeks</span>
      </h2>
      <div class="calendar-wrap">
        <div class="calendar-grid">
          <div v-for="(week, wi) in h.calendarData" :key="wi" class="cal-week">
            <div
              v-for="(day, di) in week"
              :key="di"
              :class="['cal-day', calDayClass(day.count), { 'cal-day--today': day.isToday }]"
              :title="
                day.date + (day.count ? ` · ${day.count} session${day.count > 1 ? 's' : ''}` : '')
              "
            />
          </div>
        </div>
        <div class="cal-legend">
          <span class="cal-legend-label">Less</span>
          <div class="cal-legend-cells">
            <div v-for="n in 5" :key="n" :class="['cal-day', `cal-level-${n - 1}`]" />
          </div>
          <span class="cal-legend-label">More</span>
        </div>
      </div>
    </section>

    <!-- Language Breakdown -->
    <section v-if="h.languageStats.length > 0" class="section">
      <h2 class="section-title">Language Breakdown</h2>
      <div class="lang-grid">
        <div v-for="lang in h.languageStats" :key="lang.id" class="lang-card">
          <div class="lang-card-header">
            <span class="lang-card-name">{{ lang.id }}</span>
            <span class="lang-card-sessions"
              >{{ lang.sessions }} {{ lang.sessions === 1 ? 'session' : 'sessions' }}</span
            >
          </div>
          <div class="lang-card-stats">
            <div class="lang-stat">
              <span class="lang-stat-val">{{ lang.avgWpm }}</span>
              <span class="lang-stat-lbl">avg wpm</span>
            </div>
            <div class="lang-stat">
              <span class="lang-stat-val">{{ lang.bestWpm }}</span>
              <span class="lang-stat-lbl">best</span>
            </div>
            <div class="lang-stat">
              <span class="lang-stat-val">{{ lang.avgAccuracy }}%</span>
              <span class="lang-stat-lbl">accuracy</span>
            </div>
            <div class="lang-stat">
              <span class="lang-stat-val">{{ formatChars(lang.totalChars) }}</span>
              <span class="lang-stat-lbl">chars</span>
            </div>
          </div>
          <div class="lang-bar-track">
            <div class="lang-bar-fill" :style="{ width: langBarWidth(lang) }" />
          </div>
        </div>
      </div>
    </section>

    <!-- Mistake Heatmap -->
    <section v-if="h.errorHeatmap.length > 0" class="section">
      <h2 class="section-title">
        Mistake Heatmap <span class="section-badge">Most-errored keys</span>
      </h2>
      <div class="heatmap-wrap">
        <div
          v-for="item in h.errorHeatmap"
          :key="item.char"
          class="heatmap-cell"
          :style="{ '--heat': heatIntensity(item.count) }"
          :title="`'${displayChar(item.char)}' — ${item.count} errors`"
        >
          <span class="heatmap-char">{{ displayChar(item.char) }}</span>
          <span class="heatmap-count">{{ item.count }}</span>
        </div>
      </div>
    </section>

    <!-- Extra Stats Row -->
    <section v-if="h.totalSessions > 0" class="section">
      <h2 class="section-title">Lifetime Numbers</h2>
      <div class="extras-row">
        <div class="extra-item">
          <span class="extra-val">{{ formatChars(h.totalCharsTyped) }}</span>
          <span class="extra-lbl">Characters Typed</span>
        </div>
        <div class="extra-sep" />
        <div class="extra-item">
          <span class="extra-val">{{ h.totalErrors.toLocaleString() }}</span>
          <span class="extra-lbl">Total Errors</span>
        </div>
        <div class="extra-sep" />
        <div class="extra-item">
          <span class="extra-val">{{ h.bestAccuracy }}%</span>
          <span class="extra-lbl">Best Accuracy</span>
        </div>
        <div class="extra-sep" />
        <div class="extra-item">
          <span class="extra-val">{{ h.currentStreak }}</span>
          <span class="extra-lbl">Current Streak</span>
        </div>
      </div>
    </section>

    <!-- Recent Sessions -->
    <section v-if="h.recentEntries.length > 0" class="section">
      <div class="section-header">
        <h2 class="section-title">Recent Sessions</h2>
        <div class="section-actions">
          <button class="export-btn" title="Export history as CSV" @click="exportCSV">
            ↓ Export CSV
          </button>
          <button
            :class="['clear-btn', { 'clear-btn--confirm': confirmingClear }]"
            @click="confirmClear"
          >
            {{ confirmingClear ? 'Confirm Clear?' : 'Clear History' }}
          </button>
        </div>
      </div>
      <div class="sessions-list">
        <div v-for="entry in h.recentEntries" :key="entry.id" class="session-card">
          <div class="session-main">
            <span class="session-file">{{ entry.fileName }}</span>
            <span class="session-lang">{{ entry.language }}</span>
          </div>
          <div class="session-stats">
            <span class="session-stat session-stat--wpm">{{ entry.wpm }} <small>wpm</small></span>
            <span class="session-stat">{{ entry.accuracy }}%</span>
            <span class="session-stat session-stat--dim">{{ entry.time }}</span>
            <span class="session-stat session-stat--date">{{ formatDate(entry.date) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div v-if="h.totalSessions === 0" class="empty">
      <pre class="empty-art">
  ╔═══════════════════════════╗
  ║  no sessions recorded yet ║
  ╚═══════════════════════════╝</pre
      >
      <p class="empty-text">Complete a typing session to start tracking your progress.</p>
      <NuxtLink to="/" class="empty-link"> Start Typing </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHistoryStore } from '~/stores/history'
  import type { LanguageStat } from '~/types'

  const h = useHistoryStore()

  const confirmingClear = ref(false)
  let clearTimer: ReturnType<typeof setTimeout> | null = null

  // ── SVG Line Chart ──
  const LC_W = 600
  const LC_H = 160

  const trendMax = computed(() => {
    if (h.wpmTrend.length === 0) return 1
    return Math.max(...h.wpmTrend.map((p) => p.wpm), 1)
  })

  function lineChartX(i: number): number {
    if (h.wpmTrend.length <= 1) return LC_W / 2
    return (i / (h.wpmTrend.length - 1)) * LC_W
  }

  function lineChartYForWpm(wpm: number): number {
    const pct = trendMax.value > 0 ? wpm / trendMax.value : 0
    return LC_H - pct * LC_H * 0.9 - LC_H * 0.05
  }

  function lineChartY(pct: number): number {
    return LC_H - (pct / 100) * LC_H * 0.9 - LC_H * 0.05
  }

  const chartPoints = computed(() => {
    return h.wpmTrend
      .map((pt, i) => `${lineChartX(i).toFixed(1)},${lineChartYForWpm(pt.wpm).toFixed(1)}`)
      .join(' ')
  })

  const areaPath = computed(() => {
    if (h.wpmTrend.length < 2) return ''
    const pts = h.wpmTrend
      .map((pt, i) => `${lineChartX(i).toFixed(1)},${lineChartYForWpm(pt.wpm).toFixed(1)}`)
      .join(' L')
    const lastX = lineChartX(h.wpmTrend.length - 1).toFixed(1)
    return `M0,${LC_H} L${pts} L${lastX},${LC_H} Z`
  })

  // ── Calendar ──
  function calDayClass(count: number): string {
    if (count === 0) return 'cal-level-0'
    if (count === 1) return 'cal-level-1'
    if (count <= 3) return 'cal-level-2'
    if (count <= 6) return 'cal-level-3'
    return 'cal-level-4'
  }

  // ── Mistake heatmap ──
  function heatIntensity(count: number): number {
    if (h.errorHeatmap.length === 0) return 0
    const max = h.errorHeatmap[0].count
    return max > 0 ? count / max : 0
  }

  function displayChar(ch: string): string {
    if (ch === ' ') return '␣'
    if (ch === '\n') return '↵'
    if (ch === '\t') return '⇥'
    return ch
  }

  // ── Export CSV ──
  function exportCSV() {
    const headers = [
      'Date',
      'File',
      'Language',
      'WPM',
      'Raw WPM',
      'CPM',
      'Accuracy',
      'Time',
      'Chars',
      'Errors',
    ]
    const rows = [...h.entries]
      .reverse()
      .map((e) => [
        new Date(e.date).toLocaleString(),
        `"${e.fileName.replace(/"/g, '""')}"`,
        e.language,
        e.wpm,
        e.rawWpm,
        e.cpm,
        e.accuracy,
        e.time,
        e.chars,
        e.errors,
      ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code-typewriter-history-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function confirmClear() {
    if (confirmingClear.value) {
      h.clearHistory()
      confirmingClear.value = false
      return
    }
    confirmingClear.value = true
    clearTimer = setTimeout(() => {
      confirmingClear.value = false
    }, 3000)
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  function formatChars(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k'
    return String(n)
  }

  function langBarWidth(lang: LanguageStat): string {
    const max = Math.max(...h.languageStats.map((l) => l.sessions), 1)
    return Math.round((lang.sessions / max) * 100) + '%'
  }

  onUnmounted(() => {
    if (clearTimer) clearTimeout(clearTimer)
  })
</script>

<style scoped>
  .profile-page {
    max-width: 960px;
    margin: 0 auto;
  }

  /* ── Hero ── */
  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }
  .hero-title {
    font-family: var(--font-code);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }
  .hero-accent {
    color: var(--accent);
  }
  .hero-sub {
    font-size: 0.82rem;
    color: var(--text-dim);
  }
  .hero-streak {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 18px;
  }
  .streak-flame {
    font-size: 1.4rem;
  }
  .streak-value {
    font-family: var(--font-code);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1;
  }
  .streak-label {
    display: block;
    font-size: 0.62rem;
    color: var(--text-faint);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 2px;
  }

  /* ── Stats Grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 32px;
  }
  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 16px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s var(--ease);
  }
  .stat-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
  }
  .stat-card--accent::before {
    background: var(--accent);
  }
  .stat-card--blue::before {
    background: #61afef;
  }
  .stat-card--green::before {
    background: var(--green);
  }
  .stat-card--purple::before {
    background: var(--purple);
  }
  .stat-card--orange::before {
    background: var(--orange);
  }
  .stat-card--red::before {
    background: var(--red);
  }
  .stat-card:hover {
    border-color: var(--border-lit);
  }
  .stat-card-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
  }
  .stat-card-value {
    display: block;
    font-family: var(--font-code);
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1;
  }
  .stat-card-value small {
    font-size: 0.55em;
    color: var(--text-dim);
    font-weight: 500;
  }
  .stat-card-label {
    display: block;
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--text-faint);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 4px;
  }

  /* ── Sections ── */
  .section {
    margin-bottom: 28px;
  }
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .section-title {
    font-family: var(--font-ui);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-header .section-title {
    margin-bottom: 0;
  }
  .section-badge {
    font-family: var(--font-code);
    font-size: 0.6rem;
    font-weight: 500;
    color: var(--text-faint);
    background: var(--bg-raised);
    padding: 3px 10px;
    border-radius: 10px;
    border: 1px solid var(--border);
  }
  .section-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── SVG Line Chart ── */
  .chart-wrap {
    display: flex;
    gap: 8px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 18px 12px;
    height: 200px;
  }
  .chart-y-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: var(--font-code);
    font-size: 0.6rem;
    color: var(--text-faint);
    min-width: 28px;
    text-align: right;
    padding-bottom: 8px;
  }
  .line-chart {
    flex: 1;
    height: 100%;
    border-left: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    overflow: visible;
  }
  .grid-line {
    stroke: var(--border);
    stroke-width: 0.5;
  }
  .grid-line--faint {
    stroke-dasharray: 3 3;
    opacity: 0.5;
  }
  .chart-area {
    fill: rgba(var(--accent-rgb), 0.08);
  }
  .chart-line {
    fill: none;
    stroke: var(--accent);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .chart-dot {
    fill: var(--accent);
    transition: r 0.15s ease;
    cursor: default;
  }
  .chart-dot:hover {
    r: 5;
  }
  .chart-dot--latest {
    fill: var(--green);
    filter: drop-shadow(0 0 4px rgba(var(--green-rgb), 0.6));
  }

  /* ── Calendar Heatmap ── */
  .calendar-wrap {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 20px;
  }
  .calendar-grid {
    display: flex;
    gap: 3px;
    overflow-x: auto;
    padding-bottom: 6px;
  }
  .cal-week {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .cal-day {
    width: 11px;
    height: 11px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .cal-level-0 {
    background: var(--bg-raised);
  }
  .cal-level-1 {
    background: rgba(var(--green-rgb), 0.25);
  }
  .cal-level-2 {
    background: rgba(var(--green-rgb), 0.45);
  }
  .cal-level-3 {
    background: rgba(var(--green-rgb), 0.7);
  }
  .cal-level-4 {
    background: var(--green);
  }
  .cal-day--today {
    outline: 1px solid var(--accent);
    outline-offset: 1px;
  }
  .cal-legend {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 10px;
    justify-content: flex-end;
  }
  .cal-legend-label {
    font-family: var(--font-code);
    font-size: 0.58rem;
    color: var(--text-faint);
  }
  .cal-legend-cells {
    display: flex;
    gap: 3px;
    align-items: center;
  }

  /* ── Mistake Heatmap ── */
  .heatmap-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .heatmap-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: color-mix(
      in srgb,
      rgba(var(--red-rgb), 0.08) calc(var(--heat) * 80%),
      var(--bg-surface)
    );
    border: 1px solid
      color-mix(in srgb, rgba(var(--red-rgb), 0.4) calc(var(--heat) * 100%), var(--border));
    border-radius: var(--radius);
    padding: 10px 14px;
    min-width: 56px;
    transition: transform 0.15s ease;
  }
  .heatmap-cell:hover {
    transform: scale(1.06);
  }
  .heatmap-char {
    font-family: var(--font-code);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
  }
  .heatmap-count {
    font-family: var(--font-code);
    font-size: 0.6rem;
    color: var(--text-faint);
  }

  /* ── Language Cards ── */
  .lang-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 10px;
  }
  .lang-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    transition: border-color 0.2s var(--ease);
  }
  .lang-card:hover {
    border-color: var(--border-lit);
  }
  .lang-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .lang-card-name {
    font-family: var(--font-code);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--accent);
  }
  .lang-card-sessions {
    font-size: 0.62rem;
    color: var(--text-faint);
  }
  .lang-card-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
  }
  .lang-stat {
    text-align: center;
  }
  .lang-stat-val {
    display: block;
    font-family: var(--font-code);
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text);
    line-height: 1;
  }
  .lang-stat-lbl {
    display: block;
    font-size: 0.55rem;
    color: var(--text-faint);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 3px;
  }
  .lang-bar-track {
    height: 3px;
    background: var(--bg-raised);
    border-radius: 2px;
    overflow: hidden;
  }
  .lang-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--purple));
    border-radius: 2px;
    transition: width 0.4s var(--ease);
  }

  /* ── Extras Row ── */
  .extras-row {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 0;
  }
  .extra-item {
    flex: 1;
    text-align: center;
  }
  .extra-val {
    display: block;
    font-family: var(--font-code);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    line-height: 1;
  }
  .extra-lbl {
    display: block;
    font-size: 0.58rem;
    font-weight: 600;
    color: var(--text-faint);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 5px;
  }
  .extra-sep {
    width: 1px;
    height: 32px;
    background: var(--border);
    flex-shrink: 0;
  }

  /* ── Session Cards ── */
  .sessions-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .session-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    transition: border-color 0.15s var(--ease);
  }
  .session-card:hover {
    border-color: var(--border-lit);
  }
  .session-main {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }
  .session-file {
    font-family: var(--font-code);
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .session-lang {
    font-family: var(--font-code);
    font-size: 0.58rem;
    color: var(--text-faint);
    background: var(--bg-raised);
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid var(--border);
    flex-shrink: 0;
    white-space: nowrap;
  }
  .session-stats {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }
  .session-stat {
    font-family: var(--font-code);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
  }
  .session-stat small {
    font-size: 0.8em;
    font-weight: 400;
    color: var(--text-dim);
  }
  .session-stat--wpm {
    color: var(--accent);
    min-width: 70px;
  }
  .session-stat--dim {
    color: var(--text-dim);
    font-weight: 400;
  }
  .session-stat--date {
    color: var(--text-faint);
    font-weight: 400;
    font-size: 0.68rem;
    min-width: 55px;
  }

  /* ── Buttons ── */
  .export-btn {
    padding: 6px 14px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-faint);
    font-family: var(--font-code);
    font-size: 0.68rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s var(--ease);
  }
  .export-btn:hover {
    background: rgba(var(--accent-rgb), 0.08);
    color: var(--accent);
    border-color: rgba(var(--accent-rgb), 0.25);
  }
  .clear-btn {
    padding: 6px 14px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-faint);
    font-family: var(--font-code);
    font-size: 0.68rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s var(--ease);
  }
  .clear-btn:hover {
    background: rgba(var(--red-rgb), 0.08);
    color: var(--red);
    border-color: rgba(var(--red-rgb), 0.25);
  }
  .clear-btn--confirm {
    background: rgba(var(--red-rgb), 0.15);
    color: var(--red);
    border-color: rgba(var(--red-rgb), 0.4);
  }

  /* ── Empty ── */
  .empty {
    text-align: center;
    padding: 72px 20px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }
  .empty-art {
    font-family: var(--font-code);
    font-size: 0.78rem;
    color: var(--text-faint);
    opacity: 0.5;
    line-height: 1.5;
    margin-bottom: 24px;
  }
  .empty-text {
    color: var(--text-dim);
    font-size: 0.88rem;
    margin-bottom: 20px;
  }
  .empty-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 24px;
    border-radius: 6px;
    background: rgba(var(--accent-rgb), 0.15);
    color: var(--accent);
    border: 1px solid rgba(var(--accent-rgb), 0.25);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.82rem;
    transition: all 0.2s var(--ease);
  }
  .empty-link:hover {
    background: rgba(var(--accent-rgb), 0.25);
    box-shadow: 0 0 24px rgba(var(--accent-rgb), 0.12);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hero {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .extras-row {
      flex-wrap: wrap;
      gap: 16px;
      padding: 16px;
    }
    .extra-sep {
      display: none;
    }
    .extra-item {
      min-width: 40%;
    }
    .session-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .session-stats {
      flex-wrap: wrap;
      gap: 10px;
    }
    .chart-wrap {
      height: 160px;
    }
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
    .lang-card-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    .heatmap-wrap {
      gap: 6px;
    }
    .heatmap-cell {
      min-width: 48px;
      padding: 8px 10px;
    }
  }
</style>
