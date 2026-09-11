# Suburb Page Content Template — Modeled on the Top Performers

**Companion to** `docs/advanced-seo-brief-north-east.md` (the architecture/bug-fix brief). That doc says *where* the pages go and how they're wired up; this doc is *what goes inside them*.

**Where the content now lives (Astro build, Sep 2026):** each suburb's intro, tagline, meta description and neighbours are in `src/data/suburbs.ts`; the housing-type "common issues" and FAQ copy (§4, §8, and the groupings at the bottom of this doc) are in `src/data/suburbGroups.ts`; the page itself is `src/pages/service-area/[slug].astro`. Adding a suburb is one new entry in `SUBURBS` — the template, sitemap, hub and JSON-LD pick it up automatically.

**Method:** pulled apart the actual pages of the three strongest local-SEO performers in the competitive audit — not their marketing claims, their real page structure — and combined what each does best into one template. Sources, so the dev/content team can view them directly:

- [airconditioningguys.com.au/air-conditioning-chatswood](https://airconditioningguys.com.au/air-conditioning-chatswood/) — ACG, tied for #1 organic visibility in the audit
- [climacool.net.au/air-conditioning-mosman](https://climacool.net.au/air-conditioning-mosman/) — ClimaCool, tied for #1 organic visibility
- [cbclimatecontrol.com.au/service-areas/air-conditioning-randwick](https://cbclimatecontrol.com.au/service-areas/air-conditioning-randwick/) — the strongest *local-specificity* execution of the three, even though it ranks lower overall
- [innovationaircon.com.au/eastern-suburbs-sydney](https://innovationaircon.com.au/eastern-suburbs-sydney/) — the model for the **hub page** itself (§11 and the companion brief's §4), not an individual suburb page

**Key finding this template is built on:** the two SEO leaders (ACG, ClimaCool) win mostly on review volume, brand-dealer badges, and content depth — neither actually gets hyper-local. CB Climate Control does ("Avoca Street," "Darley Road," "Kensington, Kingsford, Coogee, Clovelly," a suburb-specific "Common Issues" section) and it's the single easiest thing here to out-execute the market leaders on. Don't stop at matching ACG/ClimaCool — beat them on the local-specificity axis, where the bar is lower than it looks.

---

## The section-by-section structure

### 1. H1 + positioning subheading
`Air Conditioning [Suburb]` as H1, with a subheading claiming the local-specialist position (ACG: *"Your Local Chatswood Air Conditioning Specialist"*). Simple, every top performer does it, costs nothing to skip if forgotten.

### 2. Trust bar, directly under the H1
Every single one of the three leads with rating + review count within the first screen: ACG "4.8★, 290+ reviews," ClimaCool "4.9/5, 143 Google Reviews," CB Climate Control "Rated 4.9, 428+ Reviews." JED's real number goes here once review volume exists — until then, lead with the Daikin & Haier certified-dealer badge instead (already true, already in JED's schema, currently invisible on the page itself).

### 3. Local-specificity intro paragraph — the actual differentiator
This is where ACG and ClimaCool are both weak — confirmed directly from the fetched pages: *"no specific streets or landmarks mentioned"* on either. CB Climate Control's Randwick page names real streets (Avoca Street, Darley Road) and real neighbouring suburbs (Kensington, Kingsford, Coogee, South Coogee, Clovelly, Queens Park, Eastlakes) in running prose, not a bare list.

**Rule: only use facts that are actually true.** Don't invent street names or landmarks — use real, verifiable local detail: proximity to the beach, density/building-stock pattern (apartments vs. federation houses), a real nearby landmark, genuine neighbouring suburbs. See the worked Bondi example below for what this looks like in practice.

### 4. "Common issues in [Suburb]" section
CB Climate Control's standout, and the one no one else in the audit runs: suburb-specific problem framing rather than generic HVAC copy — heritage-home retrofits, strata/body-corporate approval for apartments, heat-island density effects, older wiring load in period homes. This is genuinely differentiated content, not padding — write the real, technically accurate version per suburb type (see §7 below for the housing-type groupings to use).

### 5. Service breakdown
All three do this; table stakes. Split system, ducted, multi-split, repairs, maintenance — one line each, linking to the matching `/service/*` page rather than repeating that page's content.

### 6. Pricing transparency block
ClimaCool's standout: real indicative price bands by brand/system size (they show actual $ ranges for Daikin/Fujitsu/Samsung/Actron/Mitsubishi units). Neither ACG nor CB Climate Control does this — it's a live opportunity to beat two of the three leaders at once. Indicative ranges only (not fixed quotes, to protect against callback disputes), clearly labelled as a starting-from guide.

### 7. Local install/service process
CB Climate Control's 5-step numbered process (consultation → technician arrival → testing → cleanup & guidance → ongoing support). Reduces first-time-customer anxiety, costs nothing to write once and reuse across every suburb page.

### 8. FAQ — suburb-flavoured, not generic
CB Climate Control again: response time, heritage-home handling, strata approval, warranty terms, technician credentials — framed for that suburb's actual housing stock. Mark this up as `FAQPage` JSON-LD (see the schema section in the companion brief).

### 9. Reviews / testimonials with real names
All three show real reviewer names, not anonymised quotes. Needs a review-collection pipeline feeding it — cross-functional (whoever owns Google Business Profile / review requests), not a dev task on its own, but the *page slot* for it should exist now so it's a content swap later, not a rebuild.

### 10. Compliance & brand-authority badges
CB Climate Control shows its ARCtick licence and contractor licence numbers explicitly. ACG, ClimaCool, and All General all lean hard on "Authorised Daikin/Actron Dealer" status. JED already claims "Daikin & Haier certified dealer" in its `index.html` JSON-LD — that claim needs to be visible on the page itself (a badge, not just buried in schema a visitor never sees).

### 11. Internal links out
2–3 geographically real neighbouring suburb pages (mirrors CB Climate Control's pattern) + the relevant `/service/*` pages + the Service Areas hub (see the companion brief, §4). This is also what stops each suburb page being an SEO dead end.

### 12. CTA frequency
All three repeat the quote form / phone number multiple times down the page, not once at the bottom. Match that — every 2–3 sections, not just the footer.

---

## Worked example: Bondi

Shows the pattern applied with genuine, verifiable local detail — not filler. Use this as the reference for writing every other suburb; don't reuse this specific text elsewhere.

> **Air Conditioning Bondi**
> *Sydney's Eastern Suburbs air conditioning specialists*
>
> Bondi's mix of beachfront apartments and older federation homes each bring their own install considerations. Coastal salt air accelerates corrosion on outdoor condenser units faster than it does further inland — JED fits marine-grade corrosion protection as standard on any install within a few streets of the beach, not as a paid extra. For apartment blocks around Campbell Parade and Bondi Road, we handle strata approval paperwork for external unit placement as part of the quote, so it isn't a surprise partway through the job.
>
> **Common issues in Bondi**
> - **Salt-air corrosion** on outdoor units — the single most common early-failure cause we see on beachside installs
> - **Strata approval** for external condenser placement in apartment buildings — required before any external unit goes up
> - **Older wiring** in pre-war federation homes further back from the beach, which can undersize the circuit for a modern ducted system
>
> **FAQ**
> - *Does salt air really affect my air conditioner?* Yes — outdoor units within roughly 1km of the coast corrode faster without protection. We use marine-grade coating and stainless fixings on every Bondi install.
> - *Do I need body corporate approval to install a split system in my apartment?* In most Bondi/Bondi Junction buildings, yes, for the outdoor unit. We provide the technical specs strata typically asks for.

Note what makes this different from the generic template: it states something *true and checkable* (coastal corrosion is a real, well-documented HVAC issue), ties it to a real behaviour JED can actually deliver (marine-grade protection, handling strata paperwork), and only names real, verifiable local facts (the beach, real street names, apartment prevalence) — nothing invented.

---

## The hub page: model on Innovation Air Conditioning's Eastern Suburbs page

[innovationaircon.com.au/eastern-suburbs-sydney](https://innovationaircon.com.au/eastern-suburbs-sydney/) is a genuinely good example of the Service Areas hub the companion brief calls for (§4) — it's the pattern to copy for JED's own hub page:

- **H1** claims the whole region: *"Premier Air Conditioning Installation in Sydney's Eastern Suburbs"* — not just a suburb list, a real landing page in its own right.
- **Micro-local examples embedded in the hub copy itself**, not saved for the leaf pages — *"apartments in Darlinghurst,"* *"retail spaces in Rose Bay."* This is worth copying directly: even the hub page should name 2–3 real suburb-specific scenarios, not just link out to them.
- **A full list of every suburb page it serves** (27, in their case) as real links at the bottom — this is the internal-linking backbone the brief's §4 is asking for.
- Trust block (licensed/insured, 5-year warranty) and CTA repeated, same as every leaf page.

Build JED's hub with two sections — North Shore and Eastern Suburbs — each opening with 2–3 named micro-local examples in this style, then the full suburb link list underneath.

---

## Suburb groupings, for writing common-issues sections efficiently

Don't write 20 fully bespoke "common issues" sections from scratch — group suburbs by real housing-stock pattern and write one strong version per group, then localise the intro paragraph and FAQ per suburb:

- **Beachside / high salt exposure:** Bondi, Bondi Junction (nearby), Coogee, Manly, Dee Why, Mona Vale — corrosion protection, strata approval for apartments
- **Harbourside established / heritage:** Mosman, Double Bay, Rose Bay, Vaucluse, Lane Cove — heritage-home retrofit constraints, established-tree/access considerations for outdoor unit placement
- **Dense apartment / strata-heavy:** Chatswood, North Sydney, Randwick, Edgecliff, Paddington — body-corporate approval process as the recurring FAQ, noise/placement restrictions in shared walls
- **Established suburban / standalone homes:** Willoughby, Ku-ring-gai (Turramurra/Pymble/Gordon), Hornsby, Northern Beaches inland pockets — ducted-system retrofit into an existing roof space is the common technical question here, not strata

This keeps the "common issues" content genuinely differentiated per suburb *type* without inventing per-suburb specifics that aren't real.
