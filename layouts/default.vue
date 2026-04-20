<template>
  <div class="min-h-screen">
    <AppScanlines />
    <OverlayIntroOverlay />
    <div class="app">
      <nav class="flex gap-1 mb-4">
        <NuxtLink to="/" class="nav-link" active-class="active"> Practice </NuxtLink>
        <NuxtLink to="/profile" class="nav-link" active-class="active"> Profile </NuxtLink>
        <NuxtLink to="/about" class="nav-link" active-class="active"> About </NuxtLink>
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-link nav-donate"
        >
          Donate
        </a>
      </nav>
      <slot />
    </div>
  </div>
</template>
