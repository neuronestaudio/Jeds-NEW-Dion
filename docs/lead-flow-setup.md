# Lead flow — setup, env vars and GHL mapping

The quote form POSTs **directly to the GoHighLevel inbound webhook from the browser**.
There is no server in between.

```
Browser (QuoteWizard)
  ├─ address autocomplete ──► https://places.googleapis.com   (Google Places New)
  └─ on submit ────────────► VITE_GHL_WEBHOOK_URL             (GHL inbound webhook)
```

Both endpoints return permissive CORS headers, which is what makes this possible:
GHL answers `Access-Control-Allow-Origin: *`, and Places echoes the requesting origin.

---

## 1. Environment variables

Set on the **main site** Vercel project. Both are `VITE_`-prefixed, meaning they are
**baked into the JavaScript bundle and are publicly readable**. That is expected here —
see the security note below.

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_GHL_WEBHOOK_URL` | **yes** | The GHL inbound webhook URL. Without it the form shows an error and no lead is sent. |
| `VITE_GOOGLE_PLACES_API_KEY` | no | Browser key for address autocomplete. Without it the address field becomes a plain text input and leads arrive with `addressVerified: false`. |

`VITE_API_BASE` is no longer used and can be deleted.

### Security, stated plainly

The webhook URL is in the bundle, so **anyone can read it and POST fake leads**. That is
an unavoidable consequence of a browser-direct architecture, not an oversight. The
mitigations are:

- a honeypot field, which hard-blocks naive bots
- `formFillMs` / `likelyBot`, sent as data so a GHL workflow can filter on them
- AU phone validation in the browser, so malformed numbers never reach GHL

None of these stop a determined attacker. If lead spam becomes a real problem, the fix is
to put the endpoint back behind a server.

---

## 2. Google Places browser key

Roughly ten minutes, once.

1. <https://console.cloud.google.com/> → create a project, e.g. `jed-air-website`.
2. **Enable billing.** Places will not serve requests without a billing account attached,
   even inside the free allowance.
3. **APIs & Services → Library →** enable **Places API (New)**. Note the *(New)* — the
   legacy "Places API" is a different product and this code will not work against it.
4. **Credentials → Create credentials → API key.**
5. Restrict it. The key is public, so **the restrictions are the only protection**:
   - **Application restrictions → Websites**, and add:
     `https://jedairconditioning.com.au/*` and `https://www.jedairconditioning.com.au/*`
     (add your Vercel preview domain too if you want autocomplete on previews)
   - **API restrictions → Restrict key →** tick **Places API (New)** only
6. **Set a quota cap** so a leaked key cannot produce a surprise bill:
   **APIs & Services → Places API (New) → Quotas →** cap requests/day at e.g. `1000`.

### Cost

Google gives **10,000 free calls per SKU per month**. A session token means one lead is
one billed session no matter how many characters are typed. Realistic cost: **$0/month**,
with step 6 as the backstop.

---

## 3. What GHL receives

The first eight are GHL **standard contact fields** — they populate the native contact
record and work in workflow triggers, filters and merge fields.

| Key sent | GHL field | Example |
| --- | --- | --- |
| `name` | Full Name | `Sample Lead` |
| `email` | Email | `sample@example.com` |
| `phone` | Phone | `+61434308070` — normalised to E.164 |
| `address1` | Address | `12/88 Wentworth Park Road` |
| `city` | City | `Glebe` |
| `state` | State | `NSW` |
| `postal_code` | Postal Code | `2037` |
| `country` | Country | `AU` |
| `serviceType` | *custom* | `installation` / `repair` / `maintenance` / `commercial` / `other` |
| `urgency` | *custom* | `asap` / `few-days` / `flexible` |
| `urgencyLabel` | *custom* | `ASAP / Today if possible` |
| `isUrgent` | *custom* | `true` only when urgency is `asap` |
| `addressVerified` | *custom* | `true` if picked from Google, `false` if typed |
| `full_address` | *custom* | full formatted address |
| `googlePlaceId` | *custom* | `ChIJ…` |
| `latitude` / `longitude` | *custom* | `-33.8785` / `151.1926` |
| `message` | *custom* | free text |
| `source` | *custom* | `hero-inline` or `bottom-quote` |
| `formFillMs` / `likelyBot` | *custom* | bot signals |
| `submittedAt` | *custom* | ISO timestamp |

Phone is normalised **before** sending so GHL dedupes contacts correctly — `0434 308 070`
and `+61434308070` must not become two contacts.

Unit numbers are reassembled into `address1` as `12/88 Wentworth Park Road`; Google
returns the unit separately as `subpremise` and never joined to the street line.

When the address was typed rather than selected, `city` / `state` / `postal_code` are
**omitted entirely** rather than sent empty — an empty string would overwrite good data
on an existing GHL contact.

### GHL side — what you must configure

1. **Create custom fields** for every row marked *custom* above. GHL silently drops
   inbound keys that have no matching field: the lead still arrives, minus those values.
2. An Inbound Webhook is only a **trigger**. It does not create anything by itself. The
   workflow needs a **Create/Update Contact** action, and a **Create Opportunity** action
   with a pipeline *and* stage if you want opportunities. A workflow left in **Draft**
   accepts webhooks and does nothing.
3. Worth wiring to conditions:
   - `isUrgent = true` → immediate-callback branch instead of the 24h nurture
   - `addressVerified = false` → customer typed the address; confirm before dispatching
   - `likelyBot = true` → hold for review

---

## 4. Capturing a sample for the field mapper

GHL's inbound-webhook trigger learns the payload shape from a real request:

```sh
# Set the trigger listening for sample data, then:
node scripts/send-sample-lead.mjs --url "https://services.leadconnectorhq.com/hooks/..."
node scripts/send-sample-lead.mjs --url "<same>" --variant unverified

# Inspect without sending
node scripts/send-sample-lead.mjs --print
```

Send **both** variants. The verified payload carries ten keys the unverified one does
not, and a mapping built from only the unverified sample will never show `city`,
`state` or `postal_code`.

`src/test/ghlPayload.test.ts` pins this exact shape, so the script and production cannot
silently drift apart.

---

## 5. Verifying after deploy

```sh
# Autocomplete reachable with the deployed key
curl -X POST "https://places.googleapis.com/v1/places:autocomplete" \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: <your key>" \
  -H "Referer: https://jedairconditioning.com.au/" \
  -d '{"input":"42 Wentworth","includedRegionCodes":["au"]}'
```

Then submit the real form once and confirm the lead lands in GHL. If the address field
shows *"Enter your full street address, suburb and postcode"* instead of suggestions, the
Places key is missing, unrestricted for this origin, or unbilled — check the browser
console, which logs the rejection status.

---

## 6. What changed, and what broke on purpose

The form used to POST to `hooks.jedairconditioning.com.au/api/quote`, which forwarded to
GHL **and sent two Twilio SMS** — one alerting the owner, one confirming to the customer.

Going browser-direct removes that server hop, so **both SMS stop firing**. They must be
rebuilt as GoHighLevel workflow actions off the same inbound webhook. GHL sends SMS
natively, so this is a like-for-like replacement and arguably where the logic belonged.

Until those workflow actions exist, **nobody at JED gets an SMS when a lead arrives.**

`hooks-api/` is still in the repo and still deployed. It is no longer in the lead path,
but it still serves `/api/twilio-inbound` and `/api/twilio-status`, which the Twilio
console points at. Do not delete that Vercel project until those Twilio webhooks have
been repointed or retired.
