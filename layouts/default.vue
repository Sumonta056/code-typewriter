<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <div class="min-h-screen">
    <OverlayIntroOverlay />
    <div
      class="app max-w-[1440px] mx-auto px-[24px] pt-[20px] pb-[12px] h-screen [height:100svh] overflow-hidden flex flex-col max-[768px]:px-[12px] max-[768px]:pt-[10px] max-[480px]:px-[8px] max-[480px]:pt-[8px]"
    >
      <nav class="flex items-center justify-between mb-[12px] gap-[8px]">
        <div class="flex items-center gap-[4px]">
          <NuxtLink to="/" class="nav-link" active-class="active"> Practice </NuxtLink>
          <NuxtLink to="/profile" class="nav-link" active-class="active"> Profile </NuxtLink>
          <NuxtLink to="/settings" class="nav-link" active-class="active"> Settings </NuxtLink>
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
