# JED Hooks API (Vercel)

This folder is deployed as a **separate Vercel project** and mapped to `hooks.jedairconditioning.com.au`.

## Endpoints

- `GET /api/health`
- `GET /api/ping`
- `POST /api/quote`
- `POST /api/places` — Google Places proxy for address autocomplete
- `POST /api/twilio-status`
- `POST /api/twilio-inbound`

## Environment variables

- `CORS_ALLOW_ORIGIN` (recommended: `https://jedairconditioning.com.au`; comma-separated list supported)
- `GOOGLE_PLACES_API_KEY` — required for address autocomplete. Without it `/api/places`
  returns 503 and the site falls back to a plain typed address field.
  See [`docs/lead-flow-setup.md`](../docs/lead-flow-setup.md).
- `PLACES_REGION_CODES` (optional, default `au`)
- `PLACES_LANGUAGE_CODE` (optional, default `en-AU`)
- `OWNER_SMS_TO`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER` (or use `TWILIO_MESSAGING_SERVICE_SID`)
- `TWILIO_MESSAGING_SERVICE_SID` (optional)
- `TWILIO_STATUS_CALLBACK_URL` (recommended: `https://hooks.jedairconditioning.com.au/api/twilio-status`)
- `TWILIO_SEND_CUSTOMER_SMS` (optional, default `true`)
- `TWILIO_AUTO_REPLY_ENABLED` (optional, default `false`)
- `TWILIO_AUTO_REPLY_BODY` (optional)
- `GHL_WEBHOOK_URL` (optional)
- `SKIP_GHL_FORWARD` (optional)

---

## ⚠️ No longer in the lead path

As of the direct-to-GHL change, the quote form POSTs straight to the GoHighLevel
inbound webhook from the browser. **`/api/quote` and `/api/places` are no longer
called by the site.**

What this means:

- The two Twilio SMS this handler sent (owner alert + customer confirmation) **no
  longer fire**. They must be rebuilt as GoHighLevel workflow actions off the same
  inbound webhook. See `docs/lead-flow-setup.md`.
- This project is still deployed and still serves `/api/twilio-inbound` and
  `/api/twilio-status`, which the Twilio console points at. **Do not delete the
  Vercel project** until those webhooks have been repointed or retired.
- Once Twilio is dealt with, this whole folder and its Vercel project can be removed.
