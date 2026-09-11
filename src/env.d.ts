/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_GA_ID?: string;
  readonly VITE_GHL_WEBHOOK_URL?: string;
  readonly VITE_GOOGLE_PLACES_API_KEY?: string;
  readonly VITE_HERO_VIDEO_URL?: string;
  readonly VITE_THANK_YOU_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
