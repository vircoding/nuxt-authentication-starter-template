// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  runtimeConfig: {
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtVerificationSecret: process.env.JWT_VERIFICATION_SECRET,
    nodemailerHost: process.env.EMAIL_HOST,
    nodemailerUser: process.env.EMAIL_USER,
    nodemailerPassword: process.env.EMAIL_PASSWORD,
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
})
