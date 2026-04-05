<template>
  <div class="about-page">
    <header class="about-hero">
      <h1 class="about-title">About <span class="about-accent">Code Typewriter</span></h1>
      <p class="about-sub">A typing tutor built for developers, by developers</p>
    </header>

    <div class="about-body">
      <section class="about-card">
        <div class="about-card-icon">&#128187;</div>
        <h2 class="about-card-title">What is it?</h2>
        <p class="about-card-text">
          Code Typewriter is a browser-based typing practice tool that lets you type real source
          code fetched directly from GitHub. Instead of lorem ipsum, you practice with actual
          production code — improving both your typing speed and your familiarity with real
          codebases.
        </p>
      </section>

      <section class="about-card">
        <div class="about-card-icon">&#128640;</div>
        <h2 class="about-card-title">How it works</h2>
        <p class="about-card-text">
          Select a language, load a random file from a curated list of open-source repositories, and
          start typing. The editor highlights syntax in real time, tracks your WPM, raw WPM, CPM,
          and accuracy, and saves every session to your local history so you can monitor your
          progress over time.
        </p>
      </section>

      <section class="about-card">
        <div class="about-card-icon">&#128274;</div>
        <h2 class="about-card-title">Privacy</h2>
        <p class="about-card-text">
          Everything runs in your browser. No account, no server, no tracking. Your session history
          and settings are stored exclusively in your browser's
          <code>localStorage</code> and never leave your device.
        </p>
      </section>

      <section class="about-card">
        <div class="about-card-icon">&#10084;</div>
        <h2 class="about-card-title">Support the project</h2>
        <p class="about-card-text">
          Code Typewriter is free and open source. If it has helped you level up your typing speed,
          consider buying me a coffee — it keeps the project alive and motivates new features.
        </p>
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          class="donate-btn"
        >
          Donate
        </a>
      </section>
    </div>
  </div>
</template>

<style scoped>
  .about-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 24px 0 48px;
  }

  /* Hero */
  .about-hero {
    margin-bottom: 40px;
  }

  .about-title {
    font-family: var(--font-code);
    font-size: 2rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 10px;
  }

  .about-accent {
    color: var(--accent);
  }

  .about-sub {
    font-size: 0.9rem;
    color: var(--text-dim);
    margin: 0;
  }

  /* Cards */
  .about-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .about-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.2s var(--ease);
  }

  .about-card:hover {
    border-color: var(--border-lit);
  }

  .about-card-icon {
    font-size: 1.6rem;
    line-height: 1;
  }

  .about-card-title {
    font-family: var(--font-code);
    font-size: 1rem;
    font-weight: 600;
    color: var(--text);
    margin: 0;
  }

  .about-card-text {
    font-size: 0.85rem;
    color: var(--text-dim);
    line-height: 1.7;
    margin: 0;
  }

  .about-card-text code {
    font-family: var(--font-code);
    font-size: 0.8rem;
    color: var(--accent);
    background: rgba(var(--accent-rgb), 0.1);
    padding: 1px 5px;
    border-radius: 4px;
  }

  /* Donate button */
  .donate-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    align-self: flex-start;
    font-family: var(--font-code);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--yellow);
    text-decoration: none;
    padding: 8px 20px;
    border-radius: 8px;
    border: 1px solid rgba(210, 153, 34, 0.35);
    background: rgba(210, 153, 34, 0.08);
    transition: all 0.2s var(--ease);
  }

  .donate-btn:hover {
    background: rgba(210, 153, 34, 0.16);
    border-color: rgba(210, 153, 34, 0.5);
  }

  @media (max-width: 768px) {
    .about-title {
      font-size: 1.5rem;
    }

    .about-card {
      padding: 20px;
    }
  }
</style>
