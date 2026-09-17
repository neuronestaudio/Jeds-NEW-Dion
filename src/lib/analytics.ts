type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initAnalytics() {
  const measurementId = import.meta.env.VITE_GA_ID as string | undefined;
  if (!measurementId || typeof window === 'undefined' || initialized) return;
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
 * Every interaction event goes to the dataLayer, where Google Tag Manager
 * picks it up. Until GTM was installed this only called gtag, which only exists
 * when VITE_GA_ID is set — it never was, so every CTA click, quote step and
 * submit was silently dropped. The direct gtag call stays for that setup.
 */
export function trackEvent(action: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: action, ...params });
  if (window.gtag && import.meta.env.VITE_GA_ID) window.gtag('event', action, params);
}

export function pushDataLayerEvent(event: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
