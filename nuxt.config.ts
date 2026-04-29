export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  srcDir: '.',
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/icon'],
  ssr: false,
  css: [
    '~/assets/css/variables.css',
    '~/assets/css/base.css',
    '~/assets/css/transitions.css',
    '~/assets/css/components.css',
  ],
  app: {
    head: {
      titleTemplate: 'Code Typewriter',
      title: 'Practice Typing Real Code',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },

        // Primary SEO
        {
          name: 'description',
          content:
            'Code Typewriter — a typing tutor built for developers. Practice typing real source code from GitHub, track your WPM, accuracy, and improve your coding speed.',
        },
        {
          name: 'keywords',
          content:
            'typing practice, developer typing, code typing, WPM, typing speed, programming, typing tutor, keyboard practice, coding speed',
        },
        { name: 'author', content: 'Code Typewriter' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0d1117' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Code Typewriter' },
        { property: 'og:title', content: 'Code Typewriter — Type Real Code, Get Faster' },
        {
          property: 'og:description',
          content:
            'A typing tutor built for developers. Practice typing real source code fetched from GitHub. Track WPM, accuracy, and coding speed.',
        },
        { property: 'og:image', content: '/favicon.png' },
        { property: 'og:locale', content: 'en_US' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Code Typewriter — Type Real Code, Get Faster' },
        {
          name: 'twitter:description',
          content:
            'A typing tutor built for developers. Practice typing real source code from GitHub and track your WPM.',
        },
        { name: 'twitter:image', content: '/favicon.png' },
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },

        // Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})
