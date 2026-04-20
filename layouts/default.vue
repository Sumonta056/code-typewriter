<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div class="min-h-screen">
    <OverlayIntroOverlay />
    <div class="app">
      <nav class="app-nav">
        <div class="nav-links">
          <NuxtLink to="/" class="nav-link" active-class="active"> Practice </NuxtLink>
          <NuxtLink to="/profile" class="nav-link" active-class="active"> Profile </NuxtLink>
          <NuxtLink to="/about" class="nav-link" active-class="active"> About </NuxtLink>
          <a
            href="https://forms.gle/S1FJaEpzGcnMQbm77"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-link nav-donate"
          >
            Donate
          </a>
        </div>
        <StatsNavStats />
      </nav>
      <slot />
    </div>
  </div>
</template>
