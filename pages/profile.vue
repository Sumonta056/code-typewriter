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
