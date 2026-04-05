<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="loading-overlay" role="alert" aria-live="assertive">
        <div class="loader-ring">
          <div />
          <div />
          <div />
          <div />
        </div>
        <p class="loading-text">Fetching from GitHub<span class="loading-dots" /></p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  defineProps<{ visible: boolean }>()
</script>

<style scoped>
  .loading-overlay {
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    z-index: 200;
  }
  .loader-ring {
    width: 44px;
    height: 44px;
    position: relative;
  }
  .loader-ring div {
    position: absolute;
    width: 36px;
    height: 36px;
    border: 3px solid transparent;
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: loaderSpin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  .loader-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .loader-ring div:nth-child(2) {
    animation-delay: -0.3s;
    border-top-color: var(--purple);
  }
  .loader-ring div:nth-child(3) {
    animation-delay: -0.15s;
    border-top-color: var(--green);
  }
  .loading-text {
    font-family: var(--font-code);
    font-size: 0.8rem;
    color: var(--text-dim);
  }
  .loading-dots::after {
    content: '';
    animation: dots 1.5s steps(4, end) infinite;
  }
</style>
