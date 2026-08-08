# Address Autocomplete — setup & GHL mapping

The quote forms now capture the **job site address** with Google-backed autocomplete.
This document covers the Google Cloud key, the Vercel env vars, and what has to be
configured on the GoHighLevel side so the address lands on the contact record.

---

## 1. How it fits together

```
Browser (QuoteForm / QuoteFormInline)
  │  the Google API key is NEVER in the bundle
  ▼
POST hooks.jedairconditioning.com.au/api/places   ← proxy, holds the key
  │   action: 'autocomplete'  → suggestion list
  │   action: 'details'       → structured address
  ▼
Google Places API (New)

… then on submit:

POST hooks.jedairconditioning.com.au/api/quote
  ├─→ GoHighLevel inbound webhook   (address1 / city / state / postal_code / country)
  └─→ Twilio SMS to owner + customer
```

The key lives only on the server. Nothing to lock down with HTTP-referrer rules,
and nothing leaks if someone views source.

---

## 2. Create the Google Cloud key

Roughly ten minutes, once.

1. Go to <https://console.cloud.google.com/> and create a project — e.g. `jed-air-website`.
2. **Billing must be enabled** on the project. Places will not serve requests without a
   billing account attached, even inside the free allowance.
3. **APIs & Services → Library →** enable **Places API (New)**.
   Note the *(New)*. The legacy "Places API" is a different product and this code
   will not work against it.
4. **APIs & Services → Credentials → Create credentials → API key.**
5. Restrict the key — this matters, it is a billable key:
   - **Application restrictions:** `None`.
     It is called server-to-server from Vercel, so there is no referrer to match and
     Vercel's egress IPs are not static. The key is never exposed publicly, so this
     is safe here — but it means step 6 is doing the real work.
   - **API restrictions:** `Restrict key` → tick **Places API (New)** only.
6. **Set a quota cap** so a runaway loop can never produce a surprise bill:
   **APIs & Services → Places API (New) → Quotas** → set requests/day to something
   sane like `1000`.

### What this costs

Google gives **10,000 free calls per SKU per month**. Session tokens mean one lead
= one billed session regardless of how many characters they type. A lead form doing
even a few hundred quotes a month sits comfortably inside the free tier.

Realistic cost: **$0/month**. The quota cap in step 6 guarantees it stays that way.

---

## 3. Vercel environment variables

Set on the **hooks-api** project (the one serving `hooks.jedairconditioning.com.au`),
not the main site project.

| Variable | Required | Notes |
| --- | --- | --- |
| `GOOGLE_PLACES_API_KEY` | yes | The key from step 2. `PLACES_API_KEY` also works. |
| `CORS_ALLOW_ORIGIN` | yes | Comma-separated list is supported, e.g. `https://jedairconditioning.com.au,https://www.jedairconditioning.com.au` |
| `PLACES_REGION_CODES` | no | Defaults to `au`. Comma-separated ISO country codes. |
| `PLACES_LANGUAGE_CODE` | no | Defaults to `en-AU`. |

Redeploy the hooks-api project after setting these.

On the **main site** project, `VITE_API_BASE` must already point at
`https://hooks.jedairconditioning.com.au` — that is unchanged.

### If the key is missing

`/api/places` returns **503** and the front end silently falls back to a plain typed
address box with the hint *"Enter your full street address, suburb and postcode."*
Leads still submit and still reach GHL, just flagged `addressVerified: false`.
A missing key degrades the form; it never breaks it.

---

## 4. What gets sent to GoHighLevel

On submit, `/api/quote` forwards these keys to the GHL inbound webhook. The first
five are GHL **standard contact fields** — they populate the native contact record,
so they show on the contact card and are usable in workflow triggers, filters and
merge fields.

| Key sent | GHL contact field | Example |
| --- | --- | --- |
| `address1` | Address | `2/42 Wentworth Ave` |
| `city` | City | `Mascot` |
| `state` | State | `NSW` |
| `postal_code` *(and `postalCode`)* | Postal Code | `2020` |
| `country` | Country | `AU` |
| `full_address` | *custom field* | `42 Wentworth Ave, Mascot NSW 2020, Australia` |
| `addressVerified` | *custom field* | `true` if picked from Google, `false` if typed |
| `googlePlaceId` | *custom field* | `ChIJ…` |
| `latitude` / `longitude` | *custom field* | `-33.9`, `151.2` |

Unit numbers are reassembled into `address1` as `2/42 Wentworth Ave` — Google returns
the unit separately as `subpremise` and never as part of the street line.

### GHL side — what you must configure

1. In the inbound webhook's field mapping, confirm `address1`, `city`, `state`,
   `postal_code` and `country` are mapped to the **standard** contact fields.
2. If you want `addressVerified`, `full_address`, `googlePlaceId`, `latitude` or
   `longitude` retained, create **custom fields** for them first. GHL silently drops
   inbound keys that have no matching field — the lead still arrives, minus those values.
3. `addressVerified: false` is worth a workflow condition. It means the customer typed
   an address rather than selecting a real one, so it should be confirmed before a
   truck is dispatched.

---

## 5. Testing it

```sh
# Autocomplete — expect a suggestions array
curl -X POST https://hooks.jedairconditioning.com.au/api/places \
  -H 'Content-Type: application/json' \
  -d '{"action":"autocomplete","input":"42 Wentworth Ave","sessionToken":"test-1"}'

# Details — expect a structured address
curl -X POST https://hooks.jedairconditioning.com.au/api/places \
  -H 'Content-Type: application/json' \
  -d '{"action":"details","placeId":"PLACE_ID_FROM_ABOVE","sessionToken":"test-1"}'
```

A `503 {"reason":"missing_api_key"}` means the env var is not set or the project has
not been redeployed since it was.

Front-end behaviour is covered by `src/test/AddressAutocomplete.test.tsx` (`npm test`),
including both failure paths — missing key and upstream error.

Full end-to-end against production:

```sh
node scripts/test-site-form.mjs --address "1 Martin Place, Sydney NSW 2000"
```

---

## 6. Abuse protection

`/api/places` proxies a billable API, so it carries a best-effort throttle of
**60 requests per IP per minute**, a 3-character minimum before any call is made,
a 250 ms debounce in the browser, and a hard `au` region restriction. Because Vercel
recycles instances the throttle is not a hard guarantee — the quota cap in step 2.6
is the real backstop.

---

## 7. Known duplication

`api/` (repo root) and `hooks-api/api/` contain near-identical copies of these
handlers. Only **`hooks-api/`** is deployed — the root `vercel.json` builds the static
site only and declares no functions. Both copies were updated together here to stop
them drifting further, but the root `api/` folder is dead code and is a candidate for
deletion in a separate cleanup.
