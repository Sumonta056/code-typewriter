<template>
  <div class="profile-page">

    <!-- Hero -->
    <header class="hero">
      <div class="hero-left">
        <h1 class="hero-title">Your <span class="hero-accent">Profile</span></h1>
        <p class="hero-sub">Track your progress and become a faster coder</p>
      </div>
      <div v-if="h.totalSessions > 0" class="hero-streak">
        <div class="streak-flame">{{ h.currentStreak > 0 ? '&#128293;' : '&#10060;' }}</div>
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

    <!-- WPM Trend -->
    <section v-if="h.wpmTrend.length > 1" class="section">
      <h2 class="section-title">WPM Trend <span class="section-badge">Last {{ h.wpmTrend.length }} sessions</span></h2>
      <div class="trend-chart">
        <div class="trend-y-labels">
          <span>{{ trendMax }}</span>
          <span>{{ Math.round(trendMax / 2) }}</span>
          <span>0</span>
        </div>
        <div class="trend-bars">
          <div
            v-for="(point, i) in h.wpmTrend"
            :key="i"
            class="trend-bar-wrap"
            :title="`${point.wpm} WPM &middot; ${point.accuracy}% &middot; ${point.fileName}`"
          >
            <div
              class="trend-bar"
              :style="{ height: point.percent + '%' }"
              :class="{ 'trend-bar--latest': i === h.wpmTrend.length - 1 }"
            />
            <span v-if="h.wpmTrend.length <= 12" class="trend-bar-label">{{ point.wpm }}</span>
          </div>
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
            <span class="lang-card-sessions">{{ lang.sessions }} {{ lang.sessions === 1 ? 'session' : 'sessions' }}</span>
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
        <button :class="['clear-btn', { 'clear-btn--confirm': confirmingClear }]" @click="confirmClear">
          {{ confirmingClear ? 'Confirm Clear?' : 'Clear History' }}
        </button>
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
      <pre class="empty-art">  ╔═══════════════════════════╗
  ║  no sessions recorded yet ║
  ╚═══════════════════════════╝</pre>
      <p class="empty-text">Complete a typing session to start tracking your progress.</p>
      <NuxtLink to="/" class="empty-link">Start Typing</NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useHistoryStore } from '~/stores/history'
import type { LanguageStat } from '~/types'

const h = useHistoryStore()

const confirmingClear = ref(false)
let clearTimer: ReturnType<typeof setTimeout> | null = null

const trendMax = computed(() => {
  if (h.wpmTrend.length === 0) return 1
  return Math.max(...h.wpmTrend.map(p => p.wpm), 1)
})

function confirmClear() {
  if (confirmingClear.value) {
    h.clearHistory()
    confirmingClear.value = false
    return
  }
  confirmingClear.value = true
  clearTimer = setTimeout(() => { confirmingClear.value = false }, 3000)
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
  const max = Math.max(...h.languageStats.map(l => l.sessions), 1)
  return Math.round((lang.sessions / max) * 100) + '%'
}

onUnmounted(() => { if (clearTimer) clearTimeout(clearTimer) })
</script>

<style scoped>
.profile-page { max-width: 960px; margin: 0 auto; }

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
.hero-accent { color: var(--accent); }
.hero-sub { font-size: 0.82rem; color: var(--text-dim); }
.hero-streak {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 18px;
}
.streak-flame { font-size: 1.4rem; }
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
.stat-card--accent::before { background: var(--accent); }
.stat-card--blue::before   { background: #61afef; }
.stat-card--green::before  { background: var(--green); }
.stat-card--purple::before { background: var(--purple); }
.stat-card--orange::before { background: var(--orange); }
.stat-card--red::before    { background: var(--red); }
.stat-card:hover { border-color: var(--border-lit); }
.stat-card-icon { font-size: 1.3rem; flex-shrink: 0; }
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
.section { margin-bottom: 28px; }
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
.section-header .section-title { margin-bottom: 0; }
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

/* ── WPM Trend ── */
.trend-chart {
  display: flex;
  gap: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 18px 12px;
  height: 200px;
}
.trend-y-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: var(--font-code);
  font-size: 0.6rem;
  color: var(--text-faint);
  min-width: 28px;
  text-align: right;
  padding-bottom: 20px;
}
.trend-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 3px;
  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 0 6px 0 8px;
}
.trend-bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  height: 100%;
}
.trend-bar {
  width: 100%;
  max-width: 32px;
  min-height: 3px;
  background: linear-gradient(180deg, var(--accent), rgba(var(--accent-rgb), 0.4));
  border-radius: 3px 3px 0 0;
  transition: height 0.4s var(--ease);
}
.trend-bar--latest {
  background: linear-gradient(180deg, var(--green), rgba(var(--green-rgb), 0.5));
  box-shadow: 0 0 12px rgba(var(--green-rgb), 0.3);
}
.trend-bar-label {
  font-family: var(--font-code);
  font-size: 0.55rem;
  color: var(--text-faint);
  margin-top: 4px;
  padding-bottom: 2px;
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
.lang-card:hover { border-color: var(--border-lit); }
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
.lang-stat { text-align: center; }
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
.session-card:hover { border-color: var(--border-lit); }
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
.session-stat--wpm { color: var(--accent); min-width: 70px; }
.session-stat--dim { color: var(--text-dim); font-weight: 400; }
.session-stat--date {
  color: var(--text-faint);
  font-weight: 400;
  font-size: 0.68rem;
  min-width: 55px;
}

/* ── Clear Button ── */
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
  .hero { flex-direction: column; align-items: flex-start; gap: 16px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .extras-row { flex-wrap: wrap; gap: 16px; padding: 16px; }
  .extra-sep { display: none; }
  .extra-item { min-width: 40%; }
  .session-card { flex-direction: column; align-items: flex-start; gap: 8px; }
  .session-stats { flex-wrap: wrap; gap: 10px; }
  .trend-chart { height: 160px; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .lang-card-stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
