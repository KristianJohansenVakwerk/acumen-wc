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
    FUNRAISE_API_KEY: env.FUNRAISE_API_KEY,
    public: {
      HUBSPOT_PORTAL_ID: env.NUXT_PUBLIC_HUBSPOT_PORTAL_ID,
      HUBSPOT_FORM_ID: env.NUXT_PUBLIC_HUBSPOT_FORM_ID,
    },
  },

  nitro: {
    preset: "cloudflare-pages",
  },

  app: {
    head: {
      title: "Acumen – Love the world game. Love the world more.",
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
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "stylesheet", href: "https://use.typekit.net/pzv2tcy.css" },
      ],
      script: [
        {
          innerHTML:
            '(function(f,u,n,r,a,i,s,e){var data={window:window,document:document,tag:"script",data:"funraise",orgId:f,uri:u,common:n,client:r,script:a};var scripts;var funraiseScript;data.window[data.data]=data.window[data.data]||[];if(data.window[data.data].scriptIsLoading||data.window[data.data].scriptIsLoaded)return;data.window[data.data].loading=true;data.window[data.data].push("init",data);scripts=data.document.getElementsByTagName(data.tag)[0];funraiseScript=data.document.createElement(data.tag);funraiseScript.async=true;funraiseScript.src=data.uri+data.common+data.script+"?orgId="+data.orgId;scripts.parentNode.insertBefore(funraiseScript,scripts)})("d3718487-d043-4e2e-bed0-ebd0002d534c","https://assets.funraise.io","/widget/common/2.0","/widget/client","/inject-form.js");',
        },
        {
          innerHTML:
            "window.funraise.push('create', { form: 49591 }, {  defaultValues: { amount: 100} });",
        },
        {
          innerHTML:
            "window.funraise.push('config', { form: 49591 }, { defaultValues: { amount: 100 }, i18n: { locale: window.navigator.language, phrases: { donor_information_email_opt_in: { 'en': 'By adding your name and email, you are agreeing to receive Acumen email communications, consent to our Terms of Use and Privacy Policy (as linked below), and confirm that you are at least eighteen (18) years of age.*' }} } });",
        },
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
