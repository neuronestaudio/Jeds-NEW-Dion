/**
 * Lift the GoHighLevel chat widget clear of the mobile CTA bar.
 *
 * The widget pins its launcher and its greeting bubble to `bottom: 20px`, and
 * our own fixed CTA bar is ~70px tall, so on a phone the bubble lands directly
 * on top of "Get Quote" — the page's primary action is behind a chat button.
 *
 * The widget lives in a closed-ish shadow tree, so a rule in index.css cannot
 * reach it; the stylesheet has to be adopted into the shadow root itself.
 *
 * Written to fail quietly. If GoHighLevel renames those ids or drops the
 * shadow root, the selectors stop matching and the widget simply sits where it
 * always did — nothing throws and nothing else on the page is affected.
 */

/** Tall enough to clear the CTA bar (~70px) plus the home indicator. */
const MOBILE_OFFSET = '104px';

/** The widget hydrates well after us; give it a while, then stop looking. */
const POLL_MS = 400;
const MAX_WAIT_MS = 20000;

const CSS = `
  @media (max-width: 1023px) {
    #lc_text-widget,
    #lc_text-widget--btn {
      bottom: calc(${MOBILE_OFFSET} + env(safe-area-inset-bottom, 0px)) !important;
    }
  }
`;

function applyTo(host: Element): boolean {
  const root = (host as HTMLElement & { shadowRoot: ShadowRoot | null }).shadowRoot;
  if (!root) return false;
  if (root.querySelector('style[data-jed-offset]')) return true;
  const style = document.createElement('style');
  style.setAttribute('data-jed-offset', '');
  style.textContent = CSS;
  root.appendChild(style);
  return true;
}

export function initChatWidgetOffset() {
  if (typeof window === 'undefined') return;

  const started = Date.now();
  const timer = window.setInterval(() => {
    const host = document.querySelector('chat-widget');
    if (host && applyTo(host)) {
      window.clearInterval(timer);
      return;
    }
    if (Date.now() - started > MAX_WAIT_MS) window.clearInterval(timer);
  }, POLL_MS);
}
