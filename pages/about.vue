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
