import colors from 'vuetify/es5/util/colors'
import webpack from 'webpack'

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

export default {
  mode: 'universal',
  generate: {
    fallback: true,
    routes: ['/', '/clips', '/replaysync', '/player', '/en', '/en/clips', '/en/replaysync', '/en/player']
  },
  head: {
    titleTemplate: '%s',
    title: 'TwitchBuddy' || process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'og:image', name: 'og:image', property: 'og:image', content: 'https://twitchbuddy.app/icon.png' },
      { hid: 'twitter:description', name: 'twitter:description', property: 'twitter:description', content: 'A Twitch.tv toolbox for clips and replays' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  css: [
    '~/assets/main.scss'
  ],
  plugins: [
    '~/plugins/load-script',
    '~/plugins/i18n.js'
  ],
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv'
  ],
  router: {
    middleware: 'i18n'
  },
  modules: [
    '@nuxtjs/pwa',
    ['vue-handy-ga/nuxt', {
      gaID: process.env.GA_ID,
      mandatory: true
    }]
  ],
  vuetify: {
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  pwa: {
    meta: {
      theme_color: '#424242',
      name: 'TwitchBuddy'
    },
    manifest: {
      name: 'TwitchBuddy',
      short_name: 'TwitchBuddy',
      theme_color: '#424242',
      background_color: '#303030'
    }
  },
  layoutTransition: {
    name: 'layout'
  },
  build: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  }
}
