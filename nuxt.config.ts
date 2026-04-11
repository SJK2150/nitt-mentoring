// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate(title) {
        return `${title} | NITT Mentoring`;
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "NITT Mentoring Portal",
        },
        {
          hid: "site-name",
          name: "og:site-name",
          content: "NITT Mentoring",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  
  // Performance optimizations
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    viewTransition: true,
  },
  
  // Optimized builds
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('xlsx')) return 'xlsx';
              if (id.includes('zod')) return 'zod';
              return 'vendor';
            }
          },
        },
      },
    },
  },
  
  // Route prefetching
  router: {
    options: {
      linkPrefetchedClass: 'nuxt-link-prefetched',
    },
  },

  // Security configuration
  runtimeConfig: {
    // Private keys available only on server side
    jwtKey: process.env.JWT_KEY,
    bcryptSalt: process.env.BCRYPT_SALT,
    databaseUrl: process.env.DATABASE_URL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    emailFrom: process.env.EMAIL_FROM,
    
    // Public keys available on both client and server
    public: {
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      env: process.env.NODE_ENV || 'development',
    },
  },

  // Security headers and performance
  nitro: {
    compressPublicAssets: true,
    minify: true,
    prerender: {
      crawlLinks: false,
      routes: ['/login'],
    },
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        },
        cors: true, // Enable CORS for API routes
      },
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Credentials': 'true',
        },
      },
    },
  },
});
