export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  modules: ['@pinia/nuxt'],
  ssr: false,
  css: ['~/assets/css/variables.css', '~/assets/css/base.css', '~/assets/css/transitions.css'],
  app: {
    head: {
      title: 'Code Typewriter — Practice Real Code',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
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
