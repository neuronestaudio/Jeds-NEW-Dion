type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

/**
 * Legacy loader. GA4 is loaded by the GTM container, and Base.astro defines a
 * window.gtag that feeds it before this module ever runs — so this returns
 * early rather than loading a second GA4 tag. Kept only so a VITE_GA_ID set on
 * a future project without GTM still works.
 */
export function initAnalytics() {
  const measurementId = import.meta.env.VITE_GA_ID as string | undefined;
  if (typeof window === 'undefined' || window.gtag) return;
  if (!measurementId || initialized) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });
}

/**
 * Every interaction event goes two ways:
 *   - gtag('event') for GA4, whose Google tag GTM loads;
 *   - a plain { event } object on the dataLayer for Google Tag Manager, where
 *     the Google Ads and Meta tags are triggered.
 * These do not double count: gtag.js only acts on gtag() calls, and GTM only
 * fires tags someone has configured for that event name.
 *
 * Until GTM went in this only called gtag, which never existed on this site,
 * so every CTA click, quote step and submit had been silently dropped.
 */
export function trackEvent(action: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: action, ...params });
  if (window.gtag) window.gtag('event', action, params);
}

export function pushDataLayerEvent(event: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
