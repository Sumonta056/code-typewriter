<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 flex items-center justify-center z-[200] p-[20px]"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Code Typewriter"
      >
        <Transition name="scale-fade">
          <div
            v-if="visible"
            class="intro-card relative z-[1] bg-bg-surface border border-c-border-lit rounded-[16px] px-[44px] pt-[40px] pb-[32px] max-w-[820px] w-full h-[600px] flex flex-col max-[700px]:px-[20px] max-[700px]:pt-[28px] max-[700px]:pb-[24px] max-[700px]:rounded-[12px] max-[700px]:h-auto max-[700px]:max-h-[90vh] max-[700px]:overflow-y-auto"
          >
            <button
              class="absolute top-[16px] right-[16px] bg-transparent border border-c-border rounded-[6px] text-c-text-faint text-[0.75rem] w-[28px] h-[28px] flex items-center justify-center cursor-pointer transition-all duration-200 leading-none hover:border-c-border-lit hover:text-c-text-dim hover:bg-bg-hover"
              aria-label="Close intro"
              @click="dismiss"
            >
              ✕
            </button>

            <!-- Header -->
            <div class="mb-[28px]">
              <div
                class="inline-block font-code text-[0.58rem] font-bold tracking-[0.18em] text-c-accent bg-[rgba(var(--accent-rgb),0.08)] border border-[rgba(var(--accent-rgb),0.2)] px-[12px] py-[4px] rounded-[4px] mb-[14px]"
              >
                WELCOME
              </div>
              <h1
                class="font-code text-[1.6rem] font-bold text-c-text mb-[12px] leading-[1.2] max-[700px]:text-[1.25rem]"
              >
                <span class="text-c-text-faint font-normal">// </span>code-typewriter
              </h1>
              <p class="font-ui text-[0.88rem] text-c-text-dim leading-[1.6]">
                A typing tutor for developers. Practice real source code fetched directly from
                GitHub — build muscle memory with authentic syntax, not lorem ipsum.
              </p>
            </div>

            <!-- Feature list -->
            <div
              class="grid grid-cols-2 gap-[8px] mb-[24px] flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--bg-raised)_transparent] max-[700px]:grid-cols-1 max-[700px]:overflow-y-visible"
            >
              <div
                v-for="(feat, i) in features"
                :key="i"
                class="flex gap-[12px] items-start px-[14px] py-[12px] rounded-[10px] border border-c-border bg-bg-raised border-c-border transition-all duration-200 hover:border-c-border-lit last:odd:[grid-column:1/-1] max-[700px]:last:odd:[grid-column:auto]"
                :style="`animation: featureReveal 0.5s var(--ease) ${0.15 + i * 0.07}s both`"
              >
                <div
                  class="text-[1.1rem] flex-shrink-0 mt-[1px] w-[24px] text-center leading-[1.4]"
                >
                  {{ feat.icon }}
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="font-code text-[0.8rem] font-semibold text-c-text mb-[4px] tracking-[0.02em]"
                  >
                    {{ feat.title }}
                  </div>
                  <div class="font-ui text-[0.78rem] text-c-text-dim leading-[1.55]">
                    {{ feat.desc }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="flex items-center justify-between gap-[12px] mb-[14px] max-[700px]:flex-col max-[700px]:items-stretch"
            >
              <a
                href="https://forms.gle/S1FJaEpzGcnMQbm77"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-[6px] font-code text-[0.72rem] text-c-text-faint no-underline px-[14px] py-[8px] border border-c-border rounded-[8px] transition-all duration-200 hover:text-c-red hover:border-[rgba(var(--red-rgb),0.3)] hover:bg-[rgba(var(--red-rgb),0.06)] max-[700px]:justify-center"
              >
                <span class="text-c-red text-[0.85rem]">♥</span>
                Support the project
              </a>
              <button
                class="inline-flex items-center gap-[8px] font-code text-[0.82rem] font-semibold text-bg-root bg-c-accent border-none rounded-[8px] px-[22px] py-[10px] cursor-pointer tracking-[0.02em] transition-all duration-200 [box-shadow:0_0_20px_rgba(var(--accent-rgb),0.25)] hover:bg-[#79b8ff] hover:shadow-[0_0_28px_rgba(var(--accent-rgb),0.4)] hover:-translate-y-[1px] max-[700px]:justify-center"
                @click="dismiss"
              >
                Start Typing
                <span
                  class="text-[1rem] transition-transform duration-200 group-hover:translate-x-[3px]"
                  >→</span
                >
              </button>
            </div>

            <p class="text-center font-code text-[0.62rem] text-c-text-faint">
              Press
              <kbd
                class="font-code text-[0.6rem] bg-bg-raised border border-c-border-lit rounded-[3px] px-[5px] py-[1px] text-c-text-dim"
                >Esc</kbd
              >
              or click outside to close
            </p>
          </div>
        </Transition>

        <!-- Backdrop click to dismiss -->
        <div
          class="absolute inset-0 bg-bg-overlay [backdrop-filter:blur(4px)] [-webkit-backdrop-filter:blur(4px)]"
          @click="dismiss"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  const STORAGE_KEY = 'code-typewriter-intro-seen'
  const visible = ref(false)

  onMounted(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      visible.value = true
    }
  })

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    visible.value = false
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') dismiss()
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))

  const features = [
    {
      icon: '⌨',
      title: 'Type Real Code',
      desc: 'Select a language from the sidebar and hit the random button to load an authentic source file from GitHub. Start typing — every keystroke is tracked for speed and accuracy.',
    },
    {
      icon: '🎨',
      title: 'Change the Theme',
      desc: 'Open the Settings panel (gear icon in the toolbar) to switch between Dark, Monokai, and Solarized themes. You can also adjust font size, line count, and other preferences.',
    },
    {
      icon: '🔗',
      title: 'Use Your Own GitHub File',
      desc: 'Click the URL button in the toolbar and paste any raw GitHub link to practice typing files from your own repos or any public repository.',
    },
    {
      icon: '📊',
      title: 'Profile & Contributors',
      desc: 'The Profile page shows your WPM trend, accuracy history, per-language stats, and a 52-week activity heatmap — all stored locally in your browser.',
    },
    {
      icon: '♥',
      title: 'Donate',
      desc: 'Code Typewriter is free and open-source. If it helps sharpen your coding speed, consider supporting the project — every contribution keeps development alive.',
    },
  ]
</script>
