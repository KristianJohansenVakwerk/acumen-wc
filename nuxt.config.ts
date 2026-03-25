// https://nuxt.com/docs/api/configuration/nuxt-config
const env =
  (
    globalThis as {
      process?: {
        env?: Record<string, string | undefined>;
      };
    }
  ).process?.env ?? {};

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    HUBSPOT_TOKEN: env.HUBSPOT_TOKEN,
    public: {
      HUBSPOT_PORTAL_ID: env.NUXT_PUBLIC_HUBSPOT_PORTAL_ID,
      HUBSPOT_FORM_ID: env.NUXT_PUBLIC_HUBSPOT_FORM_ID,
    },
  },
  app: {
    head: {
      title: "Acumen WC",
      htmlAttrs: {
        lang: "en-GB",
      },
      meta: [
        {
          name: "description",
          content: "Acumen boilerplate app",
        },
      ],
      link: [
        { rel: "icon", sizes: "32x32", href: "/favicon.ico" },
        { rel: "stylesheet", href: "https://use.typekit.net/pzv2tcy.css" },
      ],
    },
  },
  modules: [
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/eslint",
    "nuxt-gtag",
    "@pinia/nuxt",
  ],
  gtag: {
    id: "G-V0LRFNH5BY",
  },
  ssr: false,

  // Fonts
  fonts: {
    families: [
      {
        name: "GellixBold",
        provider: "local",
        src: "/fonts/GellixBold.woff",
      },
      {
        name: "GellixRegular",
        provider: "local",
        src: "/fonts/GellixRegular.woff",
      },
      {
        name: "GellixBlack",
        provider: "local",
        src: "/fonts/Gellix-Black.woff",
      },
    ],
  },
  // Vite
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/_globals.scss" as *;
          `,
        },
      },
    },
  },

  css: ["~/assets/scss/_main.scss"],
});
