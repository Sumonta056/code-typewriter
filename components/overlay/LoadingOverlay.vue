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
