<template>
  <div
    class="rules-page flex-1 min-h-0 overflow-y-auto mx-auto w-full px-[28px] pt-[18px] pb-[52px]"
  >
    <header
      class="relative overflow-hidden border border-c-border rounded-lg bg-bg-surface px-[32px] py-[30px] mb-[22px] max-[720px]:px-[18px] max-[720px]:py-[22px]"
    >
      <div class="rules-hero-grid" aria-hidden="true" />
      <div class="relative z-[1] max-w-[720px]">
        <p
          class="font-code text-[0.68rem] font-bold uppercase tracking-[0.14em] text-c-accent m-0 mb-[12px]"
        >
          Score guide
        </p>
        <h1
          class="font-code text-[2rem] leading-[1.15] font-bold text-c-text m-0 mb-[12px] max-[720px]:text-[1.45rem]"
        >
          Rules and how scoring works
        </h1>
        <p class="text-[0.9rem] leading-[1.75] text-c-text-dim m-0 max-w-[620px]">
          Code Typewriter scores what actually happened in the session: clean progress, real
          keystrokes, durable mistakes, and pause-aware time. The result is simple on the surface
          and honest underneath.
        </p>
      </div>
      <div
        class="relative z-[1] grid grid-cols-4 gap-[10px] mt-[24px] max-[820px]:grid-cols-2 max-[460px]:grid-cols-1"
      >
        <div
          v-for="metric in heroMetrics"
          :key="metric.label"
          class="rules-metric rounded-base border border-c-border bg-[rgba(22,28,46,0.78)] px-[16px] py-[14px]"
        >
          <span class="block font-code text-[1.35rem] leading-none font-bold" :class="metric.color">
            {{ metric.value }}
          </span>
          <span
            class="block mt-[6px] font-code text-[0.6rem] uppercase tracking-[0.1em] text-c-text-faint"
          >
            {{ metric.label }}
          </span>
        </div>
      </div>
    </header>

    <section
      class="grid [grid-template-columns:1.1fr_0.9fr] gap-[14px] mb-[22px] max-[900px]:grid-cols-1"
    >
      <div
        class="border border-c-border rounded-lg bg-bg-surface px-[24px] py-[22px] max-[720px]:px-[18px]"
      >
        <h2 class="rules-section-title">The core rules</h2>
        <div class="grid gap-[10px]">
          <div
            v-for="rule in rules"
            :key="rule.title"
            class="flex gap-[14px] rounded-base border border-c-border bg-bg-raised px-[16px] py-[14px] transition-colors duration-200 hover:border-c-border-lit max-[520px]:gap-[10px]"
          >
            <span
              class="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] border border-c-border-lit bg-bg-main font-code text-[0.72rem] font-bold text-c-accent"
            >
              {{ rule.step }}
            </span>
            <div>
              <h3 class="font-code text-[0.88rem] text-c-text m-0 mb-[5px]">
                {{ rule.title }}
              </h3>
              <p class="text-[0.8rem] leading-[1.65] text-c-text-dim m-0">
                {{ rule.body }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <aside
        class="border border-c-border rounded-lg bg-bg-surface px-[24px] py-[22px] max-[720px]:px-[18px]"
      >
        <h2 class="rules-section-title">Input pipeline</h2>
        <div class="flex flex-col gap-[10px]">
          <div
            v-for="item in pipeline"
            :key="item.title"
            class="rounded-base border border-c-border bg-bg-main px-[15px] py-[13px]"
          >
            <div class="flex items-center justify-between gap-[12px] mb-[6px]">
              <h3 class="font-code text-[0.8rem] text-c-text m-0">{{ item.title }}</h3>
              <span
                class="font-code text-[0.58rem] uppercase tracking-[0.08em] text-c-text-faint whitespace-nowrap"
              >
                {{ item.tag }}
              </span>
            </div>
            <p class="text-[0.76rem] leading-[1.55] text-c-text-dim m-0">
              {{ item.body }}
            </p>
          </div>
        </div>
      </aside>
    </section>

    <section class="mb-[22px]">
      <div class="flex items-end justify-between gap-[16px] mb-[14px] max-[640px]:items-start">
        <div>
          <h2 class="rules-section-title mb-[4px]">Formula reference</h2>
          <p class="text-[0.8rem] text-c-text-dim m-0">
            Final stats are recomputed once at completion for the cleanest result.
          </p>
        </div>
      </div>
      <div
        class="grid [grid-template-columns:repeat(4,minmax(0,1fr))] gap-[10px] max-[940px]:grid-cols-2 max-[520px]:grid-cols-1"
      >
        <article
          v-for="formula in formulas"
          :key="formula.label"
          class="rounded-lg border border-c-border bg-bg-surface px-[18px] py-[18px] transition-colors duration-200 hover:border-c-border-lit"
        >
          <div class="flex items-center justify-between gap-[12px] mb-[12px]">
            <h3 class="font-code text-[0.88rem] text-c-text m-0">{{ formula.label }}</h3>
            <span
              class="rounded-[6px] border border-c-border-lit bg-bg-main px-[8px] py-[3px] font-code text-[0.62rem] text-c-text-faint"
            >
              {{ formula.badge }}
            </span>
          </div>
          <code
            class="block min-h-[44px] rounded-base border border-c-border bg-bg-main px-[12px] py-[10px] font-code text-[0.72rem] leading-[1.55] text-c-accent whitespace-pre-wrap"
            >{{ formula.equation }}</code
          >
          <p class="text-[0.76rem] leading-[1.6] text-c-text-dim m-0 mt-[12px]">
            {{ formula.note }}
          </p>
        </article>
      </div>
    </section>

    <section class="mb-[22px]">
      <h2 class="rules-section-title">The full scoring flow</h2>
      <div
        class="grid [grid-template-columns:repeat(5,minmax(0,1fr))] gap-[10px] max-[980px]:grid-cols-2 max-[560px]:grid-cols-1"
      >
        <article
          v-for="phase in phases"
          :key="phase.title"
          class="rounded-lg border border-c-border bg-bg-surface px-[16px] py-[16px] transition-colors duration-200 hover:border-c-border-lit"
        >
          <span
            class="inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] border border-c-border-lit bg-bg-main px-[8px] font-code text-[0.62rem] font-bold text-c-accent"
          >
            {{ phase.step }}
          </span>
          <h3 class="font-code text-[0.82rem] text-c-text m-0 mt-[12px] mb-[6px]">
            {{ phase.title }}
          </h3>
          <p class="text-[0.74rem] leading-[1.6] text-c-text-dim m-0">
            {{ phase.body }}
          </p>
        </article>
      </div>
    </section>

    <section
      class="grid [grid-template-columns:0.9fr_1.1fr] gap-[14px] mb-[22px] max-[900px]:grid-cols-1"
    >
      <div
        class="rounded-lg border border-c-border bg-bg-surface px-[24px] py-[22px] max-[720px]:px-[18px]"
      >
        <h2 class="rules-section-title">Counters that matter</h2>
        <div class="grid gap-[9px]">
          <div
            v-for="counter in counters"
            :key="counter.name"
            class="rounded-base border border-c-border bg-bg-main px-[14px] py-[12px]"
          >
            <div class="flex items-center justify-between gap-[10px] mb-[5px]">
              <code class="font-code text-[0.72rem] text-c-accent">{{ counter.name }}</code>
              <span class="font-code text-[0.58rem] uppercase tracking-[0.08em] text-c-text-faint">
                {{ counter.starts }}
              </span>
            </div>
            <p class="text-[0.76rem] leading-[1.55] text-c-text-dim m-0">
              {{ counter.body }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="rounded-lg border border-c-border bg-bg-surface px-[24px] py-[22px] max-[720px]:px-[18px]"
      >
        <h2 class="rules-section-title">Example setup</h2>
        <div
          class="rounded-base border border-c-border bg-bg-main p-[14px] font-code text-[0.78rem] leading-[1.8] text-c-text"
        >
          <div><span class="text-c-text-faint">Code:</span> const x = 1;\n</div>
          <div><span class="text-c-text-faint">Length:</span> 13 characters</div>
          <div>
            <span class="text-c-text-faint">Typed:</span> c o n s t Space y Backspace x = 1 ; Enter
          </div>
          <div><span class="text-c-text-faint">Time:</span> 30 seconds</div>
        </div>
        <p class="text-[0.8rem] leading-[1.65] text-c-text-dim m-0 mt-[14px]">
          The wrong <code class="rules-inline-code">y</code> is counted as one error because the app
          expected <code class="rules-inline-code">x</code>. Backspace lets you fix the visible
          code, but it does not erase the cost of that missed key or remove the extra keystroke.
        </p>
      </div>
    </section>

    <section class="mb-[22px]">
      <div class="flex items-end justify-between gap-[16px] mb-[14px] max-[640px]:items-start">
        <div>
          <h2 class="rules-section-title mb-[4px]">Full keystroke walkthrough</h2>
          <p class="text-[0.8rem] text-c-text-dim m-0">
            This is the real flow from the deep-dive doc, condensed into a readable trace.
          </p>
        </div>
      </div>
      <div class="rules-table-wrap">
        <table class="rules-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Key</th>
              <th>Expected</th>
              <th>Match</th>
              <th>Index</th>
              <th>Keys</th>
              <th>Errors</th>
              <th>State / note</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in walkthroughRows" :key="row.step">
              <td>{{ row.step }}</td>
              <td>{{ row.key }}</td>
              <td>{{ row.expected }}</td>
              <td>
                <span
                  :class="
                    row.match === 'yes'
                      ? 'text-c-green'
                      : row.match === 'no'
                        ? 'text-c-red'
                        : 'text-c-text-faint'
                  "
                >
                  {{ row.match }}
                </span>
              </td>
              <td>{{ row.index }}</td>
              <td>{{ row.keys }}</td>
              <td>{{ row.errors }}</td>
              <td>{{ row.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section
      class="grid [grid-template-columns:1.05fr_0.95fr] gap-[14px] mb-[22px] max-[900px]:grid-cols-1"
    >
      <div
        class="rounded-lg border border-c-border bg-bg-surface px-[24px] py-[22px] max-[720px]:px-[18px]"
      >
        <h2 class="rules-section-title">Walkthrough result</h2>
        <div class="grid grid-cols-5 gap-[8px] max-[720px]:grid-cols-2">
          <div
            v-for="result in exampleResults"
            :key="result.label"
            class="rounded-base border border-c-border bg-bg-raised px-[14px] py-[13px]"
          >
            <span
              class="block font-code text-[1.1rem] font-bold leading-none"
              :class="result.color"
            >
              {{ result.value }}
            </span>
            <span
              class="block mt-[6px] font-code text-[0.56rem] uppercase tracking-[0.08em] text-c-text-faint"
            >
              {{ result.label }}
            </span>
          </div>
        </div>
        <div class="mt-[14px] rounded-base border border-c-border bg-bg-main px-[14px] py-[12px]">
          <p class="font-code text-[0.68rem] text-c-text-dim leading-[1.7] m-0">
            WPM = round(13 / 5 / 0.5) = 5<br />
            Raw WPM = round(14 / 5 / 0.5) = 6<br />
            Accuracy = round((14 - 1) / 14 * 100) = 93%
          </p>
        </div>
      </div>

      <div
        class="rounded-lg border border-c-border bg-bg-surface px-[24px] py-[22px] max-[720px]:px-[18px]"
      >
        <h2 class="rules-section-title">Final saved result</h2>
        <div class="grid gap-[8px]">
          <div
            v-for="item in finalStats"
            :key="item.label"
            class="flex items-center justify-between gap-[12px] rounded-base border border-c-border bg-bg-main px-[14px] py-[10px]"
          >
            <span class="font-code text-[0.7rem] text-c-text-dim">{{ item.label }}</span>
            <span class="font-code text-[0.78rem] font-semibold text-c-text">{{ item.value }}</span>
          </div>
        </div>
        <p class="text-[0.78rem] leading-[1.6] text-c-text-dim m-0 mt-[14px]">
          The result is stored in history with file name, language, WPM, raw WPM, CPM, accuracy,
          elapsed time, character count, total errors, date, and the error map.
        </p>
      </div>
    </section>

    <section
      class="rounded-lg border border-c-border bg-bg-surface px-[24px] py-[22px] max-[720px]:px-[18px]"
    >
      <h2 class="rules-section-title">Important edge cases</h2>
      <div
        class="grid [grid-template-columns:repeat(3,minmax(0,1fr))] gap-[10px] max-[900px]:grid-cols-1"
      >
        <article
          v-for="edge in edgeCases"
          :key="edge.title"
          class="rounded-base border border-c-border bg-bg-main px-[15px] py-[14px]"
        >
          <h3 class="font-code text-[0.8rem] text-c-text m-0 mb-[7px]">{{ edge.title }}</h3>
          <p class="text-[0.76rem] leading-[1.6] text-c-text-dim m-0">{{ edge.body }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const heroMetrics = [
    { value: '5', label: 'chars per word', color: 'text-c-accent' },
    { value: '200ms', label: 'live stat tick', color: 'text-c-green' },
    { value: '1s', label: 'accuracy sample', color: 'text-c-yellow' },
    { value: '350ms', label: 'result delay', color: 'text-c-purple' },
  ]

  const rules = [
    {
      step: '01',
      title: 'The clock starts on your first keypress',
      body: 'Loading a snippet does not start the timer. The session becomes timed only when you type the first real character.',
    },
    {
      step: '02',
      title: 'Every typed character is matched in order',
      body: 'The current key is compared with the expected character at the cursor. Correct keys advance cleanly; wrong keys still advance and mark that position incorrect.',
    },
    {
      step: '03',
      title: 'Mistakes stay on the scoreboard',
      body: 'Backspace moves the cursor back and resets the visible character to pending, but total errors and total keystrokes are not decremented.',
    },
    {
      step: '04',
      title: 'Pause time is excluded',
      body: 'Elapsed time subtracts finished pauses and the current pause, so your score reflects active typing time only.',
    },
  ]

  const pipeline = [
    {
      title: 'Tab',
      tag: 'spaces',
      body: 'Tabs are expanded into the configured number of spaces before matching, so the source and your input stay aligned.',
    },
    {
      title: 'Enter',
      tag: 'newline',
      body: 'Enter is converted to a newline character and matched exactly like any other character.',
    },
    {
      title: 'Backspace',
      tag: 'rewind',
      body: 'Backspace rewinds one position and makes that character pending again without changing previous totals.',
    },
    {
      title: 'Modifier keys',
      tag: 'ignored',
      body: 'Command, control, alt combinations, arrow keys, function keys, and other non-printing keys are ignored.',
    },
  ]

  const formulas = [
    {
      label: 'WPM',
      badge: 'net',
      equation: 'round(correctChars / 5 / minutes)',
      note: 'Uses the standard typing-test word size: five characters, including spaces.',
    },
    {
      label: 'Raw WPM',
      badge: 'gross',
      equation: 'round(totalKeystrokes / 5 / minutes)',
      note: 'Includes wrong keys, which makes wasted motion visible.',
    },
    {
      label: 'CPM',
      badge: 'speed',
      equation: 'round(correctChars / minutes)',
      note: 'Shows character throughput without converting to word units.',
    },
    {
      label: 'Accuracy',
      badge: 'quality',
      equation: 'round((totalKeystrokes - totalErrors) / totalKeystrokes * 100)',
      note: 'Defaults to 100 percent before typing, then tracks correct keystrokes over total keystrokes.',
    },
  ]

  const exampleResults = [
    { value: '13', label: 'chars', color: 'text-c-accent' },
    { value: '14', label: 'keys', color: 'text-c-purple' },
    { value: '1', label: 'error', color: 'text-c-red' },
    { value: '5', label: 'wpm', color: 'text-c-green' },
    { value: '93%', label: 'accuracy', color: 'text-c-yellow' },
  ]

  const phases = [
    {
      step: '01',
      title: 'Bootstrap',
      body: 'The loaded code becomes the session string, every character starts pending, counters reset to zero, and the timer stays off.',
    },
    {
      step: '02',
      title: 'Normalize input',
      body: 'Keyboard events become plain characters: Tab becomes spaces, Enter becomes newline, Backspace becomes rewind.',
    },
    {
      step: '03',
      title: 'Match character',
      body: 'The typed character is compared with the expected character at currentIndex, then the cursor advances.',
    },
    {
      step: '04',
      title: 'Update live stats',
      body: 'Every 200ms, WPM, raw WPM, CPM, accuracy, elapsed time, and progress are refreshed for the HUD.',
    },
    {
      step: '05',
      title: 'Complete and save',
      body: 'At the end, stats are computed one final time, the session is saved to history, and results appear after a short delay.',
    },
  ]

  const counters = [
    {
      name: 'currentIndex',
      starts: 'starts 0',
      body: 'The cursor position in the code string. Correct and incorrect character attempts both move it forward.',
    },
    {
      name: 'charStates',
      starts: 'pending',
      body: 'One status per character: pending, correct, or incorrect. Backspace changes the previous character back to pending.',
    },
    {
      name: 'totalKeystrokes',
      starts: 'starts 0',
      body: 'Counts every right or wrong character attempt. Backspace itself is not added, and previous attempts are not removed.',
    },
    {
      name: 'totalErrors',
      starts: 'starts 0',
      body: 'Counts wrong character attempts. Once an error is recorded, correcting it later does not subtract from this total.',
    },
    {
      name: 'sessionErrorMap',
      starts: 'cleared',
      body: 'Tracks the expected character that was missed. If you type y when x was expected, the map records x.',
    },
  ]

  const walkthroughRows = [
    {
      step: '0',
      key: '-',
      expected: '-',
      match: '-',
      index: '0',
      keys: '0',
      errors: '0',
      note: 'Session loaded; all character states are pending.',
    },
    {
      step: '1',
      key: 'c',
      expected: 'c',
      match: 'yes',
      index: '1',
      keys: '1',
      errors: '0',
      note: 'Timer starts.',
    },
    {
      step: '2',
      key: 'o',
      expected: 'o',
      match: 'yes',
      index: '2',
      keys: '2',
      errors: '0',
      note: 'Character 1 becomes correct.',
    },
    {
      step: '3',
      key: 'n',
      expected: 'n',
      match: 'yes',
      index: '3',
      keys: '3',
      errors: '0',
      note: 'Clean progress continues.',
    },
    {
      step: '4',
      key: 's',
      expected: 's',
      match: 'yes',
      index: '4',
      keys: '4',
      errors: '0',
      note: 'Correct key advances cursor.',
    },
    {
      step: '5',
      key: 't',
      expected: 't',
      match: 'yes',
      index: '5',
      keys: '5',
      errors: '0',
      note: 'No error recorded.',
    },
    {
      step: '6',
      key: 'Space',
      expected: 'Space',
      match: 'yes',
      index: '6',
      keys: '6',
      errors: '0',
      note: 'Spaces count as characters.',
    },
    {
      step: '7',
      key: 'y',
      expected: 'x',
      match: 'no',
      index: '7',
      keys: '7',
      errors: '1',
      note: 'Position 6 becomes incorrect; errorMap records x: 1.',
    },
    {
      step: '8',
      key: 'Backspace',
      expected: '-',
      match: '-',
      index: '6',
      keys: '7',
      errors: '1',
      note: 'Cursor rewinds; counters stay unchanged.',
    },
    {
      step: '9',
      key: 'x',
      expected: 'x',
      match: 'yes',
      index: '7',
      keys: '8',
      errors: '1',
      note: 'Visible code is fixed, but the earlier error remains.',
    },
    {
      step: '10',
      key: 'Space',
      expected: 'Space',
      match: 'yes',
      index: '8',
      keys: '9',
      errors: '1',
      note: 'Correct space.',
    },
    {
      step: '11',
      key: '=',
      expected: '=',
      match: 'yes',
      index: '9',
      keys: '10',
      errors: '1',
      note: 'Operator typed correctly.',
    },
    {
      step: '12',
      key: 'Space',
      expected: 'Space',
      match: 'yes',
      index: '10',
      keys: '11',
      errors: '1',
      note: 'Correct space.',
    },
    {
      step: '13',
      key: '1',
      expected: '1',
      match: 'yes',
      index: '11',
      keys: '12',
      errors: '1',
      note: 'Number typed correctly.',
    },
    {
      step: '14',
      key: ';',
      expected: ';',
      match: 'yes',
      index: '12',
      keys: '13',
      errors: '1',
      note: 'Semicolon typed correctly.',
    },
    {
      step: '15',
      key: 'Enter',
      expected: '\\n',
      match: 'yes',
      index: '13',
      keys: '14',
      errors: '1',
      note: 'currentIndex equals char count; session completes.',
    },
  ]

  const finalStats = [
    { label: 'WPM', value: '5 WPM' },
    { label: 'Raw WPM', value: '6 raw WPM' },
    { label: 'CPM', value: '26 CPM' },
    { label: 'Accuracy', value: '93%' },
    { label: 'Mistakes', value: '1' },
    { label: 'Error map', value: '{ x: 1 }' },
    { label: 'Progress', value: '100%' },
  ]

  const edgeCases = [
    {
      title: 'Backspace does not forgive errors',
      body: 'It resets the visible character state and moves the cursor back, but totalErrors and totalKeystrokes keep the true cost of the mistake.',
    },
    {
      title: 'Pause time is excluded',
      body: 'Elapsed time subtracts total paused milliseconds and any active pause, so your score reflects active typing time.',
    },
    {
      title: 'Raw WPM exposes wasted motion',
      body: 'If raw WPM is much higher than WPM, you typed many extra wrong keys. That gap is a useful practice signal.',
    },
    {
      title: 'Accuracy samples power charts',
      body: 'During typing, accuracy is sampled every second up to 120 points so trends can be shown without overloading updates.',
    },
    {
      title: 'Tab always becomes spaces',
      body: 'The loaded source has tabs converted to configured spaces, and the Tab key sends that many spaces to match it.',
    },
    {
      title: 'Results wait 350ms',
      body: 'The final panel is delayed briefly so the last character update can land before the overlay appears.',
    },
  ]
</script>

<style scoped>
  .rules-page {
    scrollbar-width: thin;
    scrollbar-color: var(--border-lit) transparent;
  }

  .rules-hero-grid {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(var(--accent-rgb), 0.1) 1px, transparent 1px),
      linear-gradient(0deg, rgba(var(--accent-rgb), 0.08) 1px, transparent 1px),
      linear-gradient(135deg, transparent 0%, rgba(var(--green-rgb), 0.12) 48%, transparent 72%),
      linear-gradient(28deg, rgba(var(--purple-rgb), 0.1), transparent 38%);
    background-size:
      34px 34px,
      34px 34px,
      auto,
      auto;
    opacity: 0.48;
  }

  .rules-metric {
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }

  .rules-section-title {
    font-family: var(--font-code);
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 14px;
  }

  .rules-inline-code {
    font-family: var(--font-code);
    font-size: 0.76rem;
    color: var(--accent);
    background: rgba(var(--accent-rgb), 0.09);
    border: 1px solid rgba(var(--accent-rgb), 0.16);
    border-radius: 5px;
    padding: 1px 5px;
  }

  .rules-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--bg-surface);
  }

  .rules-table {
    width: 100%;
    min-width: 820px;
    border-collapse: collapse;
    font-size: 0.72rem;
  }

  .rules-table th,
  .rules-table td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }

  .rules-table th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--bg-raised);
    color: var(--text);
    font-family: var(--font-code);
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .rules-table td {
    color: var(--text-dim);
    font-family: var(--font-code);
    line-height: 1.45;
  }

  .rules-table tr:last-child td {
    border-bottom: 0;
  }

  @media (max-width: 520px) {
    .rules-hero-grid {
      background-size:
        24px 24px,
        24px 24px,
        auto,
        auto;
    }
  }
</style>
