# Advanced SEO Brief — North Shore & Eastern Suburbs Coverage

**Prepared for:** JED Air Conditioning web dev team
**Scope:** technical SEO only. Marketing/positioning is covered separately — this is what to build.
**Grounded in:** a live audit of 24 competitor sites/ad accounts (Sep 2026) plus a direct read of this repo (`jed-air-solutions`, commit as of 10 Aug 2026).

JED currently has **zero organic ranking** across nine buyer-intent searches spanning the North Shore and Eastern Suburbs, and the competitors who *do* rank (ACG Air Conditioning Guys, ClimaCool — 6/9 searches each) share one structural trait: dedicated, indexable pages per suburb. This brief is how to build that, correctly.

---

## Status — implemented on branch `feat/astro-seo-north-east` (11 Sep 2026)

The site was migrated from a client-rendered Vite/React SPA to **Astro 7** rather than bolting prerendering onto the SPA (§5 below explains why). Everything in this brief is built unless listed under "still open":

- **Done:** 19 North Shore / Eastern Suburbs pages + the 5 existing regional pages, all driven from `src/data/suburbs.ts` (per-suburb copy) and `src/data/suburbGroups.ts` (housing-type issues + FAQs) through one template, `src/pages/service-area/[slug].astro`. Hub at `/service-areas`. `/service-area/sydney` now 301s to the hub (`vercel.json`). `HVACBusiness` + `Service` + `BreadcrumbList` + `FAQPage` JSON-LD on every suburb page, `sameAs` on the business entity. Canonicals are apex-domain everywhere. Sitemap is generated with per-page `lastmod` (`sitemap-index.xml`; `robots.txt` updated). Fonts moved out of the CSS `@import`. Footer areas point at the hub and real suburbs; the dead FAQ anchor points at `/services#faqs`.
- **Still open (business decisions, not dev work):** the Facebook link in `Footer.tsx` still points at the personal profile — swap it, and add the URL to `sameAs` in `src/data/site.ts`, once a real Business Page exists. The 5 regional pages (Newcastle, Central Coast, Blue Mountains, Wollongong, Canberra) were kept but now say visits are scheduled in advance — confirm JED still services them or remove them from `SUBURBS`. No pricing block was built: the competitor pattern needs JED's real indicative price bands, and nothing was invented. The homepage reviews link (`ReviewsSection.tsx`) still points at `g.page/r/YOUR_GOOGLE_BUSINESS_ID/review` — a placeholder that needs the real Google Business Profile review URL.

---

## 0. Fix these two things today (found in the repo, not hypothetical)

1. **`Footer.tsx:22`** links `Sydney (All Regions)` to `/service-area/sydney` — there is **no matching route** in `App.tsx`. Every visitor and every crawler hitting this footer link (which renders on every page) gets caught by the `*` → `NotFound` route. This is a live, site-wide internal 404.
2. **`Footer.tsx:50`** links the Facebook icon to `https://www.facebook.com/jed.airconditioning/` — this is a **personal Facebook profile** (Friends/Work/University fields), not a Business Page. It can't run ads, isn't indexed as a business entity, and actively signals "unclaimed/informal" to anyone who clicks through. A real Business Page needs to exist before this link is fixed to point at it.

Neither requires the rest of this document — fix both this week.

---

## 1. The core opportunity: you already built this pattern, just for the wrong cities

`src/pages/area/AreaPageTemplate.tsx` is a working, parameterised suburb-page component:

```tsx
export default function Newcastle() {
  return <AreaPageTemplate city="Newcastle" slug="newcastle" />;
}
```

Five of these exist today: **Newcastle, Central Coast, Blue Mountains, Wollongong, Canberra** — none of which are the North Shore or Eastern Suburbs the business is actually targeting (everything east of Homebush, per brief). The infrastructure (component, route wiring, `react-helmet-async` per-page `<title>`/meta, per-page JSON-LD, sitemap entry pattern) is proven and cheap to extend. The job isn't a rebuild — it's pointing the existing mechanism at the right 15–20 suburbs (§10) and giving each page real substance (§2).

---

## 2. Don't just copy-paste the template — this is where it currently fails

Open any of the five existing area pages and the only thing that changes between them is the word `{city}`. The intro paragraph, the "What we do" list, and the JSON-LD are byte-for-byte identical otherwise. At 5 pages that's a minor inefficiency; at 15–20 pages of near-identical text, it's exactly the pattern Google's spam policies call **scaled/doorway content** — pages that exist to rank rather than to inform. It can suppress the whole batch, not just the weak ones.

**Concrete fix, using a prop that already exists but is never used:** `AreaPageTemplate` accepts an optional `blurb?: string` — every current instance omits it and falls back to the generic template sentence. Every new suburb page must pass real content through this (or an expanded version of it):

- A genuine local detail: nearby streets/landmarks, or a distinguishing housing pattern (Bondi/Double Bay strata apartments vs. Mosman/Lane Cove standalone homes — different install/access considerations, worth actually saying)
- A real proof point specific to that suburb if one exists (a recent job, a review that mentions the suburb, a response-time claim that's actually true for that drive distance)
- Suburb-specific FAQ content where it's genuinely different (body-corporate approval for split systems in an apartment building is a real Bondi/Randwick question; it isn't a Mosman one)

Do **not** additionally build a full suburb × service matrix (e.g. `/bondi/ducted-air-conditioning`, `/bondi/split-system`, `/bondi/repairs` ×15 suburbs = 45+ pages). That multiplies the thin-content risk faster than it captures search volume. Keep one strong page per suburb; let the three existing service pages (`/service/*`) handle the service dimension.

---

## 3. Structured data upgrades

Current `index.html` JSON-LD is a reasonable `LocalBusiness` + `Service` pair, but generic. Per-suburb pages should carry their own, tighter block:

```json
{
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  "name": "JED Air Conditioning",
  "url": "https://jedairconditioning.com.au/service-area/bondi",
  "areaServed": {
    "@type": "City",
    "name": "Bondi",
    "containedInPlace": { "@type": "AdministrativeArea", "name": "New South Wales" }
  },
  "sameAs": [
    "https://www.facebook.com/<real-business-page>",
    "https://www.instagram.com/jed_airconditioning/",
    "https://www.linkedin.com/company/jed-air-conditioning/"
  ]
}
```

- **`HVACBusiness`** is a real schema.org subtype of `LocalBusiness` — more precise than the generic type currently used everywhere, and free.
- **`areaServed` as a proper `City` entity**, not a bare string (`AreaPageTemplate.tsx` currently does `areaServed: city` — a plain string, not an object).
- **`sameAs`** is entirely missing today. It's how search engines tie the website entity to your other verified profiles (GBP, socials) — add it once the real Facebook Page exists.
- Add `BreadcrumbList` on suburb pages (Home → Service Areas → Bondi) once the hub page in §4 exists.

---

## 4. Build the missing hub — stop the pages being orphaned by convention

There is currently no page that lists all service-area pages together — only the broken `/service-area/sydney` link in the footer, which was clearly meant to be this. Build a real `/service-areas` (or repurpose the `sydney` slug) hub page that:

- Lists every suburb page, grouped by North Shore / Eastern Suburbs (mirrors the structure your competitors use, e.g. CB Climate Control and Peninsula/PenAir's per-suburb URL patterns)
- Cross-links each suburb page to 2–3 geographically adjacent suburbs ("Also servicing: Rose Bay, Double Bay, Vaucluse")
- Fix the footer's `areas` array to point here plus the individual suburb links, replacing the dead `sydney` route

This closes the "how does anyone — human or crawler — discover a suburb page" gap, and gives internal link equity somewhere to flow from.

---

## 5. Rendering & crawlability — resolved by the Astro migration

The site *was* a pure client-side-rendered app: Vite + React + `react-router-dom`, no SSR/SSG, with `vercel.json` rewriting every path to `index.html`. Page content only existed after JavaScript ran — a second-pass, queued, budget-limited crawl for Google and a near-miss for everyone else, and the risk scaled with page count.

It is now **Astro 7, static output**: every page ships as complete HTML with the copy, headings and JSON-LD in the document. The React components were kept, not rewritten — the interactive ones (`Header`, `HeroSection`, the quote wizard, the carousels) are hydrated islands (`client:load` above the fold, `client:visible` below it), and the purely presentational ones render to static HTML with zero client JS. Tailwind v3 stays on PostCSS. `VITE_*` env vars keep working unchanged via `vite.envPrefix` in `astro.config.ts`, so nothing in Vercel had to be renamed.

Two things to know for future work on it:

- **Image imports in React components need `?url`** (`import logo from '@/assets/x.jpg?url'`). Under Astro a bare image import is a metadata object, and `<img src={logo}>` renders `src="[object Object]"` — the header and footer logos did exactly that on the first build. `import.meta.glob` calls need `query: '?url'` for the same reason.
- **The SPA rewrite is gone.** `vercel.json` no longer rewrites everything to `index.html`; unknown routes hit Astro's `404.astro` properly, and `/service-area/sydney` is a real 301.

---

## 6. On-page & metadata standards

- **Every new suburb page must pass a real `blurb`** (§2) — don't ship the template default.
- `index.html`'s `<meta name="keywords">` tag is inert (Google hasn't used it in over a decade) — harmless, low priority to remove, don't spend time on it.
- Canonical URLs are **inconsistent between files**: `index.html` uses `https://jedairconditioning.com.au/` (apex, no `www`), but `AreaPageTemplate.tsx` builds canonicals as `https://www.jedairconditioning.com.au/service-area/${slug}` (with `www`). Pick one (apex matches the current live domain and the rest of the site) and make every canonical, `og:url`, and JSON-LD `url` field consistent — a canonical/www mismatch tells search engines these might be two different sites.

---

## 7. Sitemap & robots hygiene

- `sitemap.xml` has no `<lastmod>` on any entry — add it, and update it on real content changes so crawlers can prioritise re-crawls.
- Add every new suburb URL as it ships.
- **Flag for the business, not just dev:** the sitemap currently lists Newcastle, Central Coast, Blue Mountains, Wollongong, and Canberra as service areas — none of which match the stated North/East Sydney focus. If JED genuinely doesn't service these anymore, they should come out of both the sitemap and the footer (they're diluting topical focus on exactly the query set you're trying to win); if it does still service them, keep them, but they shouldn't crowd out the new North/East pages in the footer's area list.
- `robots.txt` is already correct (`Allow: /` + sitemap reference) — no change needed.

---

## 8. Core Web Vitals (Vite/React specifics)

- `App.tsx` currently statically imports every page component up front. Fine at 8 routes; at 20+ it bloats the initial JS bundle for every visitor regardless of which page they land on. Switch area/service page imports to `React.lazy()` + `<Suspense>` so each suburb page is its own chunk, loaded on demand.
- `public/hero-bg.mp4` / `hero-bg-mobile.mp4` — if any suburb page reuses this hero, make sure it's not eagerly loading and blocking LCP; `preload="none"` or defer until after first paint if it's below the fold.
- New suburb-specific imagery should ship as WebP/AVIF with a fallback, sized for the actual display area (not full-res drops).
- Once pages are live, check field data (not just lab scores) via PageSpeed Insights / CrUX — target LCP < 2.5s, INP < 200ms, CLS < 0.1.

---

## 9. Cross-functional (dev + whoever owns the Business Page)

- Create the real Facebook **Business Page**, then update `Footer.tsx:50` and the `sameAs` array (§3) to point at it.
- NAP consistency: confirm the phone number in Google Business Profile matches `0434308070` exactly as it appears in the site's JSON-LD and footer — mismatches undermine local-pack trust signals.

---

## 10. Suburb build list (priority order, from the competitive audit)

**North Shore & Northern Sydney** — Chatswood, Mosman, North Sydney, Lane Cove, Willoughby, Hornsby, Ku-ring-gai (Turramurra/Pymble/Gordon), Northern Beaches (Manly/Dee Why/Mona Vale)

**Eastern Suburbs** — Bondi, Bondi Junction, Double Bay, Rose Bay, Randwick, Edgecliff, Paddington, Coogee, Vaucluse

These are the exact suburbs where the competitor audit found dedicated location pages already ranking (Peninsula/PenAir, ABC Air, CB Climate Control, Innovation Air Conditioning, Lawson Air) — matching this list is matching the format that's already proven to work in this market.

---

## 11. Per-page QA checklist before a new suburb page ships

- [ ] Unique `<title>` and meta description (not the template's generic fallback)
- [ ] Real `blurb` prop with genuine local specificity — not just `{city}` substitution
- [ ] Canonical uses the site's single agreed domain form (§6)
- [ ] `HVACBusiness` JSON-LD with a proper `City` `areaServed` and `sameAs` (§3)
- [ ] Added to `sitemap.xml` with `<lastmod>`
- [ ] Linked from the Service Areas hub (§4) and from 2+ geographically adjacent suburb pages
- [ ] `curl -I https://jedairconditioning.com.au/service-area/<slug>` returns `200`, not a silent catch by `NotFound`
- [ ] Passes a mobile Lighthouse/PageSpeed check
