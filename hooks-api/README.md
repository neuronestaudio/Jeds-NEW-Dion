# JED Hooks API (Vercel)

This folder is deployed as a **separate Vercel project** and mapped to `hooks.jedairconditioning.com.au`.

## Endpoints

- `GET /api/health`
- `GET /api/ping`
- `POST /api/quote`
- `POST /api/twilio-status`
- `POST /api/twilio-inbound`

## Environment variables

- `CORS_ALLOW_ORIGIN` (recommended: `https://jedairconditioning.com.au`)
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
