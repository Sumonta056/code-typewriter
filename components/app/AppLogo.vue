<template>
  <div class="logo">
    <div class="logo-terminal">
      <span class="terminal-dot red" />
      <span class="terminal-dot yellow" />
      <span class="terminal-dot green" />
    </div>
    <span class="logo-text">code<span class="logo-accent">type</span></span>
    <span class="logo-version">v2.0</span>
  </div>
</template>

<style scoped>
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-terminal {
    display: flex;
    gap: 6px;
    padding: 6px 10px;
    background: var(--bg-surface);
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .terminal-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .terminal-dot.red {
    background: var(--red);
  }
  .terminal-dot.yellow {
    background: var(--yellow);
  }
  .terminal-dot.green {
    background: var(--green);
  }

  .logo-text {
    font-family: var(--font-code);
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-dim);
    letter-spacing: -0.03em;
  }

  .logo-accent {
    color: var(--accent);
  }

  .logo-version {
    font-family: var(--font-code);
    font-size: 0.65rem;
    color: var(--text-faint);
    background: var(--bg-surface);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid var(--border);
  }
</style>
