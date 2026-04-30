<template>
  <div
    class="about-page flex-1 min-h-0 mx-auto w-full max-w-5xl p-6 md:p-12 lg:p-16 flex flex-col md:flex-row gap-12 md:gap-16"
  >
    <!-- ambient glow orbs -->
    <div class="about-orb about-orb--left" aria-hidden="true" />
    <div class="about-orb about-orb--right" aria-hidden="true" />

    <!-- ── LEFT PANEL: who I am ── -->
    <aside class="about-left">
      <div class="about-avatar-wrap">
        <div class="about-avatar-ring">
          <img
            src="https://github.com/Sumonta056.png"
            alt="Sumonta Saha Mridul"
            class="about-avatar"
            loading="eager"
          />
        </div>
        <div class="about-status-dot" title="Open to opportunities" />
      </div>

      <div class="about-identity">
        <p class="about-handle">@Sumonta056</p>
        <h1 class="about-name">Sumonta Saha Mridul</h1>
        <div class="about-role-row">
          <span class="about-role-badge">Software Engineer</span>
          <span class="about-role-sep">·</span>
          <span class="about-role-sub">Open Source Builder</span>
        </div>
      </div>

      <p class="about-tagline">"Building things<br />one commit at a time."</p>

      <div class="about-divider" />

      <div class="about-socials">
        <a
          href="https://github.com/Sumonta056"
          target="_blank"
          rel="noopener noreferrer"
          class="about-social-link"
          aria-label="GitHub"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.745 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/sumonta-saha-mridul-b35bb61a0/"
          target="_blank"
          rel="noopener noreferrer"
          class="about-social-link"
          aria-label="LinkedIn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            />
          </svg>
          <span>LinkedIn</span>
        </a>
        <a href="mailto:sumontasaha80@gmail.com" class="about-social-link" aria-label="Email">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>Email</span>
        </a>
      </div>
    </aside>

    <!-- ── RIGHT PANEL: the story ── -->
    <main class="about-right">
      <div class="about-story-eyebrow">
        <span class="about-story-prompt">~/story</span>
        <span class="about-story-cursor" aria-hidden="true" />
      </div>

      <h2 class="about-story-title">How Code Typewriter<br />came to be</h2>

      <div class="about-story-body">
        <p class="about-story-para">
          We're living in the AI era. Copilot fills in the blanks before you finish thinking.
          ChatGPT architects entire systems in seconds. It's impressive — and somewhere along the
          way, I realized I hadn't actually <em>typed</em> a function from scratch in weeks.
        </p>
        <p class="about-story-para">
          I missed it. That tactile rhythm of fingers on keys, the flow of a well-structured file
          moving through your hands. The muscle memory you spent years building — quietly fading.
          Writing code used to feel like something. I wanted that feeling back.
        </p>
        <p class="about-story-para about-story-para--highlight">
          So I built this. Paste any public GitHub URL — or just pick a language — and type through
          real production code. You get the satisfaction of actually writing code
          <em>and</em> a WPM score to track your progress. It scratches both itches at once.
        </p>
        <p class="about-story-para">
          It's a base project. A starting point. Open source, no accounts, nothing leaves your
          browser. If you find a bug, have an idea, or just want to say hi — don't be a stranger.
          Knock me anytime.
        </p>
      </div>

      <div class="about-contact-row">
        <a
          href="https://github.com/Sumonta056/code-typewriter/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="about-contact-btn"
        >
          <Icon name="ph:git-pull-request-bold" size="14" />
          Open an Issue
        </a>
        <a
          href="https://github.com/Sumonta056/code-typewriter"
          target="_blank"
          rel="noopener noreferrer"
          class="about-contact-btn about-contact-btn--ghost"
        >
          <Icon name="ph:star-bold" size="14" />
          Star on GitHub
        </a>
      </div>
    </main>
  </div>
</template>
