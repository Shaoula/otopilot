import { cdnUrl } from "./app/constants";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxthub/core',
    'nuxt-resend',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n'
  ],

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  runtimeConfig: {
    public: {
      auth: {
        redirectUserTo: '/auth/login',
        redirectGuestTo: '/auth/login',
      },
    },
  },

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  app: {
    head: {
      htmlAttrs: { lang: 'tr' },
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'OtoPilot, otomasyon ile taşımacılık sektöründe hizmet veriyor.' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
  },

  hub: {
    database: true,
    kv: true,
    blob: true,
  },

  image: {
    domains: ['otopilot.shaoula.com'],
    provider: 'cloudflare',
    alias: {
      cdn: cdnUrl
    },
    cloudflare: {
      baseUrl: cdnUrl
    },
    quality: 80,
    formats: ['webp'],
  },

  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en',
        file: 'en.json',
      },
      {
        name: 'Türkçe',
        code: 'tr',
        file: 'tr.json',
      },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  compatibilityDate: '2024-11-27'
})