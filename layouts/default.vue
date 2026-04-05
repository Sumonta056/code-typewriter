<template>
  <div class="app-layout">
    <AppScanlines />
    <div class="app">
      <nav class="app-nav">
        <NuxtLink to="/" class="nav-link" active-class="active"> Practice </NuxtLink>
        <NuxtLink to="/profile" class="nav-link" active-class="active"> Profile </NuxtLink>
      </nav>
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .app-layout {
    min-height: 100vh;
  }

  .app {
    max-width: 1440px;
    margin: 0 auto;
    padding: 20px 24px 32px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-nav {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
  }

  .nav-link {
    font-family: var(--font-code);
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--text-faint);
    text-decoration: none;
    padding: 5px 14px;
    border-radius: 6px;
    border: 1px solid transparent;
    transition: all 0.2s var(--ease);
  }

  .nav-link:hover {
    color: var(--text-dim);
    background: var(--bg-hover);
  }

  .nav-link.active {
    color: var(--accent);
    background: rgba(var(--accent-rgb), 0.08);
    border-color: rgba(var(--accent-rgb), 0.2);
  }

  @media (max-width: 768px) {
    .app {
      padding: 12px;
    }
  }
</style>
