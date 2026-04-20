<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="intro-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Code Typewriter"
      >
        <Transition name="scale-fade">
          <div v-if="visible" class="intro-card">
            <button class="close-btn" aria-label="Close intro" @click="dismiss">✕</button>

            <!-- Header -->
            <div class="intro-header">
              <div class="intro-badge">WELCOME</div>
              <h1 class="intro-title"><span class="title-prefix">// </span>code-typewriter</h1>
              <p class="intro-tagline">
                A typing tutor for developers. Practice real source code fetched directly from
                GitHub — build muscle memory with authentic syntax, not lorem ipsum.
              </p>
            </div>

            <!-- Feature list -->
            <div class="features-list">
              <div
                v-for="(feat, i) in features"
                :key="i"
                class="feature-item"
                :style="`animation-delay: ${0.15 + i * 0.07}s`"
              >
                <div class="feature-icon">{{ feat.icon }}</div>
                <div class="feature-body">
                  <div class="feature-title">{{ feat.title }}</div>
                  <div class="feature-desc">{{ feat.desc }}</div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="intro-footer">
              <a
                href="https://ko-fi.com"
                target="_blank"
                rel="noopener noreferrer"
                class="donate-link"
              >
                <span class="donate-heart">♥</span>
                Support the project
              </a>
              <button class="start-btn" @click="dismiss">
                Start Typing
                <span class="start-arrow">→</span>
              </button>
            </div>

            <p class="dismiss-hint">Press <kbd>Esc</kbd> or click outside to close</p>
          </div>
        </Transition>

        <!-- Backdrop click to dismiss -->
        <div class="intro-backdrop" @click="dismiss" />
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
