import { appDescription } from './config/constants'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    [
      '@nuxthq/ui',
      { prefix: 'ui' },
    ],
    '@pinia/nuxt',
  ],

  imports: {
    dirs: ['stores'],
  },

  pinia: {
    autoImports: [
      'defineStore', 'acceptHMRUpdate',
    ],
  },

  css: ['~/assets/main.css'],

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  devtools: {
    enabled: true,
  },

  plugins: ['~/plugins/auto_animate.ts'],
})
