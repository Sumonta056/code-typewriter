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

<style scoped>
  .intro-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
  }

  .intro-backdrop {
    position: absolute;
    inset: 0;
    background: var(--bg-overlay);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .intro-card {
    position: relative;
    z-index: 1;
    background: var(--bg-surface);
    border: 1px solid var(--border-lit);
    border-radius: 16px;
    padding: 40px 44px 32px;
    max-width: 560px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--bg-raised) transparent;
  }

  .intro-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 16px 16px 0 0;
    background: linear-gradient(90deg, var(--accent), var(--purple), var(--green));
  }

  /* Close button */
  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text-faint);
    font-size: 0.75rem;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s var(--ease);
    line-height: 1;
  }

  .close-btn:hover {
    border-color: var(--border-lit);
    color: var(--text-dim);
    background: var(--bg-hover);
  }

  /* Header */
  .intro-header {
    margin-bottom: 28px;
  }

  .intro-badge {
    display: inline-block;
    font-family: var(--font-code);
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: var(--accent);
    background: rgba(var(--accent-rgb), 0.08);
    border: 1px solid rgba(var(--accent-rgb), 0.2);
    padding: 4px 12px;
    border-radius: 4px;
    margin-bottom: 14px;
  }

  .intro-title {
    font-family: var(--font-code);
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
    line-height: 1.2;
  }

  .title-prefix {
    color: var(--text-faint);
    font-weight: 400;
  }

  .intro-tagline {
    font-family: var(--font-ui);
    font-size: 0.88rem;
    color: var(--text-dim);
    line-height: 1.6;
  }

  /* Features */
  .features-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 28px;
  }

  .feature-item {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 14px 16px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--bg-raised);
    animation: featureReveal 0.5s var(--ease) both;
    transition: border-color 0.2s var(--ease);
  }

  .feature-item:hover {
    border-color: var(--border-lit);
  }

  .feature-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
    margin-top: 1px;
    width: 24px;
    text-align: center;
    line-height: 1.4;
  }

  .feature-body {
    flex: 1;
    min-width: 0;
  }

  .feature-title {
    font-family: var(--font-code);
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 4px;
    letter-spacing: 0.02em;
  }

  .feature-desc {
    font-family: var(--font-ui);
    font-size: 0.78rem;
    color: var(--text-dim);
    line-height: 1.55;
  }

  /* Footer */
  .intro-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .donate-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-code);
    font-size: 0.72rem;
    color: var(--text-faint);
    text-decoration: none;
    padding: 8px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: all 0.2s var(--ease);
  }

  .donate-link:hover {
    color: var(--red);
    border-color: rgba(var(--red-rgb), 0.3);
    background: rgba(var(--red-rgb), 0.06);
  }

  .donate-heart {
    color: var(--red);
    font-size: 0.85rem;
  }

  .start-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-code);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--bg-root);
    background: var(--accent);
    border: none;
    border-radius: 8px;
    padding: 10px 22px;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: all 0.2s var(--ease);
    box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.25);
  }

  .start-btn:hover {
    background: #79b8ff;
    box-shadow: 0 0 28px rgba(var(--accent-rgb), 0.4);
    transform: translateY(-1px);
  }

  .start-arrow {
    font-size: 1rem;
    transition: transform 0.2s var(--ease);
  }

  .start-btn:hover .start-arrow {
    transform: translateX(3px);
  }

  .dismiss-hint {
    text-align: center;
    font-family: var(--font-code);
    font-size: 0.62rem;
    color: var(--text-faint);
  }

  .dismiss-hint kbd {
    font-family: var(--font-code);
    font-size: 0.6rem;
    background: var(--bg-raised);
    border: 1px solid var(--border-lit);
    border-radius: 3px;
    padding: 1px 5px;
    color: var(--text-dim);
  }

  /* Staggered reveal animation */
  @keyframes featureReveal {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mobile */
  @media (max-width: 600px) {
    .intro-card {
      padding: 28px 20px 24px;
      border-radius: 12px;
    }

    .intro-title {
      font-size: 1.25rem;
    }

    .intro-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .donate-link,
    .start-btn {
      justify-content: center;
      text-align: center;
    }
  }
</style>
