<template>
  <div class="typing-placeholder">
    <div class="placeholder-art">
      <pre class="ascii-art">
  ╔══════════════════════╗
  ║   &gt;_ code typewriter  ║
  ╚══════════════════════╝</pre
      >
    </div>
    <p class="placeholder-text">Select a language &amp; hit <kbd>Random File</kbd> to begin</p>
    <p class="placeholder-sub">or paste a GitHub URL using the link icon above</p>
  </div>
</template>

<style scoped>
  .typing-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 420px;
    gap: 20px;
    color: var(--text-faint);
    user-select: none;
  }
  .ascii-art {
    font-family: var(--font-code);
    font-size: 0.8rem;
    color: var(--text-faint);
    opacity: 0.5;
    line-height: 1.5;
  }
  .placeholder-text {
    font-size: 0.9rem;
    color: var(--text-dim);
  }
  .placeholder-text kbd {
    font-family: var(--font-code);
    font-size: 0.78rem;
    background: rgba(var(--accent-rgb), 0.1);
    color: var(--accent);
    padding: 3px 10px;
    border-radius: 4px;
    border: 1px solid rgba(var(--accent-rgb), 0.2);
  }
  .placeholder-sub {
    font-size: 0.75rem;
    color: var(--text-faint);
  }
</style>
