<template>
  <div class="flex-1 min-h-0 overflow-y-auto max-w-[960px] mx-auto w-full">
    <!-- Hero -->
    <header
      class="flex items-center justify-between mb-[28px] pb-[24px] border-b border-c-border max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-[16px]"
    >
      <div>
        <h1 class="font-code text-[1.5rem] font-bold text-c-text mb-[4px]">
          Your <span class="text-c-accent">Profile</span>
        </h1>
        <p class="text-[0.82rem] text-c-text-dim">Track your progress and become a faster coder</p>
      </div>
      <div
        v-if="h.totalSessions > 0"
        class="flex items-center gap-[10px] bg-bg-surface border border-c-border rounded-base px-[18px] py-[12px]"
      >
        <div class="text-[1.4rem]">{{ h.currentStreak > 0 ? '&#128293;' : '&#10060;' }}</div>
        <div>
          <span class="font-code text-[1.4rem] font-bold text-c-text leading-none">{{
            h.currentStreak
          }}</span>
          <span class="block text-[0.62rem] text-c-text-faint uppercase tracking-[0.08em] mt-[2px]"
            >day streak</span
          >
        </div>
      </div>
    </header>

    <!-- Summary Cards -->
    <div
      v-if="h.totalSessions > 0"
      class="grid grid-cols-3 gap-[10px] mb-[32px] max-[768px]:grid-cols-2 max-[480px]:grid-cols-2"
    >
      <div
        v-for="card in statCards"
        :key="card.label"
        class="stat-card flex items-center gap-[14px] bg-bg-surface border border-c-border rounded-base px-[16px] py-[18px] relative overflow-hidden transition-colors duration-200 hover:border-c-border-lit"
        :class="card.colorClass"
      >
        <div class="text-[1.3rem] flex-shrink-0">{{ card.icon }}</div>
        <div>
          <span
            class="block font-code text-[1.35rem] font-bold text-c-text leading-none"
            v-html="card.value"
          />
          <span
            class="block text-[0.62rem] font-semibold text-c-text-faint uppercase tracking-[0.1em] mt-[4px]"
            >{{ card.label }}</span
          >
        </div>
      </div>
    </div>

    <!-- WPM Trend — SVG Line Chart -->
    <section v-if="h.wpmTrend.length > 1" class="mb-[28px]">
      <h2
        class="font-ui text-[0.95rem] font-semibold text-c-text mb-[14px] flex items-center gap-[10px]"
      >
        WPM Trend
        <span
          class="font-code text-[0.6rem] font-medium text-c-text-faint bg-bg-raised px-[10px] py-[3px] rounded-[10px] border border-c-border"
          >Last {{ h.wpmTrend.length }} sessions</span
        >
      </h2>
      <div
        class="flex gap-[8px] bg-bg-surface border border-c-border rounded-base px-[18px] pt-[20px] pb-[12px] h-[200px] max-[768px]:h-[160px]"
      >
        <div
          class="flex flex-col justify-between font-code text-[0.6rem] text-c-text-faint min-w-[28px] text-right pb-[8px]"
        >
          <span>{{ trendMax }}</span>
          <span>{{ Math.round(trendMax / 2) }}</span>
          <span>0</span>
        </div>
        <svg
          class="flex-1 h-full border-l border-c-border border-b border-b-c-border overflow-visible"
          :viewBox="`0 0 ${LC_W} ${LC_H}`"
          preserveAspectRatio="none"
        >
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
          <path :d="areaPath" class="chart-area" />
          <polyline :points="chartPoints" class="chart-line" />
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
    <section v-if="h.totalSessions > 0" class="mb-[28px]">
      <h2
        class="font-ui text-[0.95rem] font-semibold text-c-text mb-[14px] flex items-center gap-[10px]"
      >
        Practice Calendar
        <span
          class="font-code text-[0.6rem] font-medium text-c-text-faint bg-bg-raised px-[10px] py-[3px] rounded-[10px] border border-c-border"
          >Last 52 weeks</span
        >
      </h2>
      <div class="bg-bg-surface border border-c-border rounded-base px-[20px] py-[16px]">
        <div class="flex gap-[3px] overflow-x-auto pb-[6px]">
          <div v-for="(week, wi) in h.calendarData" :key="wi" class="flex flex-col gap-[3px]">
            <div
              v-for="(day, di) in week"
              :key="di"
              :class="[
                'cal-day w-[11px] h-[11px] rounded-[2px] flex-shrink-0',
                calDayClass(day.count),
                { 'cal-day--today': day.isToday },
              ]"
              :title="
                day.date + (day.count ? ` · ${day.count} session${day.count > 1 ? 's' : ''}` : '')
              "
            />
          </div>
        </div>
        <div class="flex items-center gap-[4px] mt-[10px] justify-end">
          <span class="font-code text-[0.58rem] text-c-text-faint">Less</span>
          <div class="flex gap-[3px] items-center">
            <div
              v-for="n in 5"
              :key="n"
              :class="['cal-day w-[11px] h-[11px] rounded-[2px]', `cal-level-${n - 1}`]"
            />
          </div>
          <span class="font-code text-[0.58rem] text-c-text-faint">More</span>
        </div>
      </div>
    </section>

    <!-- Language Breakdown -->
    <section v-if="h.languageStats.length > 0" class="mb-[28px]">
      <h2 class="font-ui text-[0.95rem] font-semibold text-c-text mb-[14px]">Language Breakdown</h2>
      <div class="grid [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))] gap-[10px]">
        <div
          v-for="lang in h.languageStats"
          :key="lang.id"
          class="bg-bg-surface border border-c-border rounded-base px-[18px] py-[16px] transition-colors duration-200 hover:border-c-border-lit"
        >
          <div class="flex items-center justify-between mb-[12px]">
            <span class="font-code text-[0.82rem] font-semibold text-c-accent">{{ lang.id }}</span>
            <span class="text-[0.62rem] text-c-text-faint"
              >{{ lang.sessions }} {{ lang.sessions === 1 ? 'session' : 'sessions' }}</span
            >
          </div>
          <div class="grid grid-cols-4 gap-[8px] mb-[12px] max-[480px]:grid-cols-2">
            <div class="text-center">
              <span class="block font-code text-[0.85rem] font-semibold text-c-text leading-none">{{
                lang.avgWpm
              }}</span>
              <span
                class="block text-[0.55rem] text-c-text-faint uppercase tracking-[0.06em] mt-[3px]"
                >avg wpm</span
              >
            </div>
            <div class="text-center">
              <span class="block font-code text-[0.85rem] font-semibold text-c-text leading-none">{{
                lang.bestWpm
              }}</span>
              <span
                class="block text-[0.55rem] text-c-text-faint uppercase tracking-[0.06em] mt-[3px]"
                >best</span
              >
            </div>
            <div class="text-center">
              <span class="block font-code text-[0.85rem] font-semibold text-c-text leading-none"
                >{{ lang.avgAccuracy }}%</span
              >
              <span
                class="block text-[0.55rem] text-c-text-faint uppercase tracking-[0.06em] mt-[3px]"
                >accuracy</span
              >
            </div>
            <div class="text-center">
              <span class="block font-code text-[0.85rem] font-semibold text-c-text leading-none">{{
                formatChars(lang.totalChars)
              }}</span>
              <span
                class="block text-[0.55rem] text-c-text-faint uppercase tracking-[0.06em] mt-[3px]"
                >chars</span
              >
            </div>
          </div>
          <div class="h-[3px] bg-bg-raised rounded-[2px] overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-c-accent to-c-purple rounded-[2px] transition-[width] duration-400"
              :style="{ width: langBarWidth(lang) }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Mistake Heatmap -->
    <section v-if="h.errorHeatmap.length > 0" class="mb-[28px]">
      <h2
        class="font-ui text-[0.95rem] font-semibold text-c-text mb-[14px] flex items-center gap-[10px]"
      >
        Mistake Heatmap
        <span
          class="font-code text-[0.6rem] font-medium text-c-text-faint bg-bg-raised px-[10px] py-[3px] rounded-[10px] border border-c-border"
          >Most-errored keys</span
        >
      </h2>
      <div class="flex flex-wrap gap-[8px] max-[480px]:gap-[6px]">
        <div
          v-for="item in h.errorHeatmap"
          :key="item.char"
          class="heatmap-cell flex flex-col items-center gap-[3px] rounded-base px-[14px] py-[10px] min-w-[56px] transition-transform duration-150 hover:scale-[1.06] max-[480px]:min-w-[48px] max-[480px]:px-[10px] max-[480px]:py-[8px]"
          :style="{ '--heat': heatIntensity(item.count) }"
          :title="`'${displayChar(item.char)}' — ${item.count} errors`"
        >
          <span class="font-code text-[1.1rem] font-bold text-c-text">{{
            displayChar(item.char)
          }}</span>
          <span class="font-code text-[0.6rem] text-c-text-faint">{{ item.count }}</span>
        </div>
      </div>
    </section>

    <!-- Extra Stats Row -->
    <section v-if="h.totalSessions > 0" class="mb-[28px]">
      <h2 class="font-ui text-[0.95rem] font-semibold text-c-text mb-[14px]">Lifetime Numbers</h2>
      <div
        class="flex items-center bg-bg-surface border border-c-border rounded-base py-[20px] max-[768px]:flex-wrap max-[768px]:gap-[16px] max-[768px]:p-[16px]"
      >
        <div class="flex-1 text-center max-[768px]:min-w-[40%]">
          <span class="block font-code text-[1.1rem] font-bold text-c-text leading-none">{{
            formatChars(h.totalCharsTyped)
          }}</span>
          <span
            class="block text-[0.58rem] font-semibold text-c-text-faint uppercase tracking-[0.08em] mt-[5px]"
            >Characters Typed</span
          >
        </div>
        <div class="w-px h-[32px] bg-c-border flex-shrink-0 max-[768px]:hidden" />
        <div class="flex-1 text-center max-[768px]:min-w-[40%]">
          <span class="block font-code text-[1.1rem] font-bold text-c-text leading-none">{{
            h.totalErrors.toLocaleString()
          }}</span>
          <span
            class="block text-[0.58rem] font-semibold text-c-text-faint uppercase tracking-[0.08em] mt-[5px]"
            >Total Errors</span
          >
        </div>
        <div class="w-px h-[32px] bg-c-border flex-shrink-0 max-[768px]:hidden" />
        <div class="flex-1 text-center max-[768px]:min-w-[40%]">
          <span class="block font-code text-[1.1rem] font-bold text-c-text leading-none"
            >{{ h.bestAccuracy }}%</span
          >
          <span
            class="block text-[0.58rem] font-semibold text-c-text-faint uppercase tracking-[0.08em] mt-[5px]"
            >Best Accuracy</span
          >
        </div>
        <div class="w-px h-[32px] bg-c-border flex-shrink-0 max-[768px]:hidden" />
        <div class="flex-1 text-center max-[768px]:min-w-[40%]">
          <span class="block font-code text-[1.1rem] font-bold text-c-text leading-none">{{
            h.currentStreak
          }}</span>
          <span
            class="block text-[0.58rem] font-semibold text-c-text-faint uppercase tracking-[0.08em] mt-[5px]"
            >Current Streak</span
          >
        </div>
      </div>
    </section>

    <!-- Recent Sessions -->
    <section v-if="h.recentEntries.length > 0" class="mb-[28px]">
      <div
        class="flex items-center justify-between mb-[14px] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-[8px]"
      >
        <h2
          class="font-ui text-[0.95rem] font-semibold text-c-text flex items-center gap-[10px] mb-0"
        >
          Recent Sessions
        </h2>
        <div class="flex items-center gap-[8px]">
          <button
            class="px-[14px] py-[6px] rounded-[6px] border border-c-border bg-transparent text-c-text-faint font-code text-[0.68rem] font-medium cursor-pointer transition-all duration-200 hover:bg-[rgba(var(--accent-rgb),0.08)] hover:text-c-accent hover:border-[rgba(var(--accent-rgb),0.25)]"
            title="Export history as CSV"
            @click="exportCSV"
          >
            ↓ Export CSV
          </button>
          <button
            :class="[
              'px-[14px] py-[6px] rounded-[6px] border font-code text-[0.68rem] font-medium cursor-pointer transition-all duration-200',
              confirmingClear
                ? 'bg-[rgba(var(--red-rgb),0.15)] text-c-red border-[rgba(var(--red-rgb),0.4)]'
                : 'bg-transparent text-c-text-faint border-c-border hover:bg-[rgba(var(--red-rgb),0.08)] hover:text-c-red hover:border-[rgba(var(--red-rgb),0.25)]',
            ]"
            @click="confirmClear"
          >
            {{ confirmingClear ? 'Confirm Clear?' : 'Clear History' }}
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-[4px]">
        <div
          v-for="entry in h.recentEntries"
          :key="entry.id"
          class="flex items-center justify-between gap-[16px] bg-bg-surface border border-c-border rounded-[6px] px-[16px] py-[12px] transition-colors duration-150 hover:border-c-border-lit max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-[8px]"
        >
          <div class="flex items-center gap-[10px] min-w-0 flex-1">
            <span
              class="font-code text-[0.72rem] font-medium text-c-text overflow-hidden text-ellipsis whitespace-nowrap"
              >{{ entry.fileName }}</span
            >
            <span
              class="font-code text-[0.58rem] text-c-text-faint bg-bg-raised px-[8px] py-[2px] rounded-[10px] border border-c-border flex-shrink-0 whitespace-nowrap"
              >{{ entry.language }}</span
            >
          </div>
          <div
            class="flex items-center gap-[16px] flex-shrink-0 max-[768px]:flex-wrap max-[768px]:gap-[10px]"
          >
            <span
              class="font-code text-[0.75rem] font-semibold text-c-accent min-w-[70px] whitespace-nowrap"
              >{{ entry.wpm }}
              <small class="text-[0.8em] font-normal text-c-text-dim">wpm</small></span
            >
            <span class="font-code text-[0.75rem] font-semibold text-c-text whitespace-nowrap"
              >{{ entry.accuracy }}%</span
            >
            <span class="font-code text-[0.75rem] font-normal text-c-text-dim whitespace-nowrap">{{
              entry.time
            }}</span>
            <span
              class="font-code text-[0.68rem] font-normal text-c-text-faint min-w-[55px] whitespace-nowrap"
              >{{ formatDate(entry.date) }}</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div
      v-if="h.totalSessions === 0"
      class="text-center py-[72px] px-[20px] bg-bg-surface border border-c-border rounded-lg"
    >
      <pre class="font-code text-[0.78rem] text-c-text-faint opacity-50 leading-[1.5] mb-[24px]">
  ╔═══════════════════════════╗
  ║  no sessions recorded yet ║
  ╚═══════════════════════════╝</pre
      >
      <p class="text-c-text-dim text-[0.88rem] mb-[20px]">
        Complete a typing session to start tracking your progress.
      </p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-[6px] px-[24px] py-[10px] rounded-[6px] bg-[rgba(var(--accent-rgb),0.15)] text-c-accent border border-[rgba(var(--accent-rgb),0.25)] no-underline font-semibold text-[0.82rem] transition-all duration-200 hover:bg-[rgba(var(--accent-rgb),0.25)] hover:[box-shadow:0_0_24px_rgba(var(--accent-rgb),0.12)]"
      >
        Start Typing
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHistoryStore } from '~/stores/history'
  import type { LanguageStat } from '~/types'

  const h = useHistoryStore()

  const confirmingClear = ref(false)
  let clearTimer: ReturnType<typeof setTimeout> | null = null

  // ── Stat cards data ──
  const statCards = computed(() => [
    { icon: '&#9881;', value: h.totalSessions, label: 'Sessions', colorClass: 'stat-card--accent' },
    { icon: '&#9889;', value: h.averageWpm, label: 'Avg WPM', colorClass: 'stat-card--blue' },
    { icon: '&#127942;', value: h.bestWpm, label: 'Best WPM', colorClass: 'stat-card--green' },
    {
      icon: '&#127919;',
      value: `${h.averageAccuracy}<small class="text-[0.55em] text-c-text-dim font-medium">%</small>`,
      label: 'Avg Accuracy',
      colorClass: 'stat-card--purple',
    },
    {
      icon: '&#9201;',
      value: h.totalPracticeFormatted,
      label: 'Total Practice',
      colorClass: 'stat-card--orange',
    },
    {
      icon: '&#128293;',
      value: h.longestStreak,
      label: 'Best Streak',
      colorClass: 'stat-card--red',
    },
  ])

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
