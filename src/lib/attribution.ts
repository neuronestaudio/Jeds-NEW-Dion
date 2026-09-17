/**
 * First-touch attribution.
 *
 * Until now a lead arrived with no idea where it came from: no campaign, no
 * keyword, no click id, not even a referrer. This captures that on the FIRST
 * page a visitor lands on and keeps it, so the enquiry three days later still
 * credits the ad that actually earned it.
 *
 * First touch, not last: someone clicks the Google ad, leaves, then returns by
 * typing the domain and enquires. Last touch would call that "direct" and the
 * ad would look like it did nothing. The current visit's source is carried
 * alongside as `last*` so a change of channel is still visible.
 *
 * Stored in localStorage (first touch, written once and never overwritten) and
 * sessionStorage (this visit). Both are wrapped: Safari in private mode throws
 * on write, and a visitor with storage blocked must still be able to enquire —
 * attribution simply degrades to whatever the current URL says.
 *
 * No cookies, no third-party calls, no fingerprinting: it only reads the query
 * string and document.referrer, which is why the privacy page can describe it
 * in one sentence.
 */

const FIRST_TOUCH_KEY = 'jed-attr-first';
const LAST_TOUCH_KEY = 'jed-attr-last';

export type Attribution = {
  channel: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  gclid: string;
  fbclid: string;
  msclkid: string;
  referrer: string;
  landingPage: string;
  firstSeen: string;
};

const EMPTY: Attribution = {
  channel: '', source: '', medium: '', campaign: '', term: '', content: '',
  gclid: '', fbclid: '', msclkid: '', referrer: '', landingPage: '', firstSeen: '',
};

function read(key: string, store: Storage | undefined): Attribution | null {
  try {
    const raw = store?.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    return { ...EMPTY, ...parsed };
  } catch {
    return null;
  }
}

function write(key: string, store: Storage | undefined, value: Attribution) {
  try {
    store?.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode, or storage blocked — the visit still works */
  }
}

/**
 * The one line a human reads first. Paid is decided by a click id or by
 * utm_medium, never by the referring host alone: an organic click from
 * google.com and a paid one look identical without it.
 */
function deriveChannel(a: Attribution): string {
  const medium = a.medium.toLowerCase();
  const source = a.source.toLowerCase();
  const ref = a.referrer.toLowerCase();
  const paidMedium = /^(cpc|ppc|paid|paidsocial|paid_social|display|retargeting)/.test(medium);

  if (a.gclid) return 'Google Ads';
  if (a.msclkid) return 'Microsoft Ads';
  if (a.fbclid) return 'Meta Ads';
  if (paidMedium && /google/.test(source)) return 'Google Ads';
  if (paidMedium && /(facebook|instagram|meta|fb|ig)/.test(source)) return 'Meta Ads';
  if (paidMedium) return `Paid — ${a.source || 'unknown'}`;
  if (medium === 'email') return 'Email';
  if (/^(organic|seo)/.test(medium)) return 'Organic Search';
  if (medium === 'referral') return `Referral — ${a.source || 'unknown'}`;
  if (a.source) return a.source;

  if (!ref) return 'Direct';
  if (/google\./.test(ref)) return 'Google Organic';
  if (/bing\.|duckduckgo\.|yahoo\./.test(ref)) return 'Organic Search';
  if (/(facebook|instagram|fb\.com|l\.facebook)/.test(ref)) return 'Meta Organic';
  if (/(linkedin|t\.co|twitter|x\.com|youtube|tiktok)/.test(ref)) return 'Social';
  return 'Referral';
}

/** What the current URL and referrer say, before any storage is consulted. */
function fromCurrentVisit(): Attribution {
  if (typeof window === 'undefined') return { ...EMPTY };
  const q = new URLSearchParams(window.location.search);
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = q.get(k);
      if (v) return v.slice(0, 250);
    }
    return '';
  };

  const a: Attribution = {
    channel: '',
    source: get('utm_source', 'source'),
    medium: get('utm_medium', 'medium'),
    campaign: get('utm_campaign', 'campaign', 'utm_campaign_name'),
    term: get('utm_term', 'keyword'),
    content: get('utm_content', 'ad', 'creative'),
    // gbraid/wbraid are what Google Ads sends instead of gclid on iOS; they go
    // in the same field, which is what Google's own offline import expects.
    gclid: get('gclid', 'gbraid', 'wbraid'),
    fbclid: get('fbclid'),
    msclkid: get('msclkid'),
    referrer: (document.referrer || '').slice(0, 250),
    landingPage: (window.location.origin + window.location.pathname).slice(0, 250),
    firstSeen: new Date().toISOString(),
  };
  a.channel = deriveChannel(a);
  return a;
}

/**
 * Call once per page load. Records the first touch if there is not one already,
 * and always records this visit.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  const visit = fromCurrentVisit();

  // A click from one page of this site to the next is not a new touch. Without
  // this test every ad visitor who reads a second page before enquiring would
  // be recorded as "Google Ads -> Direct", because the second URL carries no
  // campaign parameters and its referrer is our own domain.
  const sameSite = visit.referrer.startsWith(window.location.origin);
  const carriesSignal = Boolean(
    visit.source || visit.medium || visit.gclid || visit.fbclid || visit.msclkid,
  );
  if (carriesSignal || (!sameSite && !read(LAST_TOUCH_KEY, window.sessionStorage))) {
    write(LAST_TOUCH_KEY, window.sessionStorage, visit);
  }

  const existing = read(FIRST_TOUCH_KEY, window.localStorage);
  if (existing && (existing.channel || existing.source || existing.landingPage)) return;
  write(FIRST_TOUCH_KEY, window.localStorage, visit);
}

/**
 * Flat keys for the lead payload. First touch wins; anything it is missing is
 * filled from this visit, so a visitor whose localStorage was cleared still
 * arrives attributed.
 */
export function attributionPayload(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const visit = fromCurrentVisit();
  const first = read(FIRST_TOUCH_KEY, window.localStorage) || visit;
  const last = read(LAST_TOUCH_KEY, window.sessionStorage) || visit;

  const pick = (key: keyof Attribution) => first[key] || visit[key] || '';

  return {
    attr_channel: pick('channel'),
    attr_source: pick('source'),
    attr_medium: pick('medium'),
    attr_campaign: pick('campaign'),
    attr_term: pick('term'),
    attr_content: pick('content'),
    attr_gclid: pick('gclid'),
    attr_fbclid: pick('fbclid'),
    attr_msclkid: pick('msclkid'),
    attr_referrer: pick('referrer'),
    attr_landing_page: pick('landingPage'),
    attr_first_seen: first.firstSeen || visit.firstSeen,
    // Carried for the record even though they have no field of their own: the
    // handler folds them into the channel when they differ from first touch.
    attr_last_channel: last.channel || '',
    attr_last_source: last.source || '',
  };
}
