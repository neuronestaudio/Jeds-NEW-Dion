# Twilio Routing SOP (JED Air Conditioning)

## Purpose
Provide a repeatable process to diagnose and resolve Twilio SMS routing failures for website form submissions.

## Scope
Applies to the public hooks API (`https://hooks.jedairconditioning.com.au`) and the website form submissions routed through `/api/quote`.

## Quick Health Checklist
- Hooks domain resolves to the **hooks API** project
- Deployment protection **disabled** on hooks API
- `/api/health` returns `200` with `{"ok": true}`
- `VITE_API_BASE` set on main site to `https://hooks.jedairconditioning.com.au`

---

## SOP: Failure → Action → Correction

### Failure 1: `NOT_FOUND` / `FUNCTION_INVOCATION_FAILED` on `/api/*`
**Symptoms**
- `404 NOT_FOUND` or `FUNCTION_INVOCATION_FAILED` on `https://hooks.jedairconditioning.com.au/api/health`

**Likely Causes**
- Domain points to the wrong Vercel project
- Deployment protection (SSO) enabled

**Action**
- Check current alias target
- Disable deployment protection on hooks project

**Correction**
- Point alias to latest hooks deployment:
  - `vercel alias set <deployment-url> hooks.jedairconditioning.com.au`
- Turn off protection in Vercel: **Project → Settings → Deployment Protection → None**
- Verify:
  - `GET /api/health` returns `200`

---

### Failure 2: `20001 Bad request` from Twilio
**Symptoms**
- API responds `ok: true` but `smsError` or `customerSmsError` shows Twilio `20001`

**Likely Causes**
- Trailing whitespace/newlines in env values
- Messaging Service SID invalid or missing sender pool
- From number not SMS-capable or not in Twilio account

**Action**
- Inspect Twilio request fields (To/From/MessagingServiceSid/StatusCallback)
- Remove Messaging Service SID if not needed
- Ensure From number is SMS-capable and in account

**Correction**
- Trim env values in API code (sanitize inputs)
- Remove `TWILIO_MESSAGING_SERVICE_SID` if not required
- Validate sender pool if using Messaging Service

---

### Failure 3: No SMS received by owner/customer
**Symptoms**
- API returns `ok: true` but no SMS arrives

**Likely Causes**
- Wrong destination numbers
- Twilio account messaging restrictions

**Action**
- Confirm `OWNER_SMS_TO` matches the intended owner number
- Run a controlled test submission

**Correction**
- Update `OWNER_SMS_TO` in Vercel env
- Re-deploy hooks API
- Test again

---

## Required Env Vars (Hooks API)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER` (SMS-capable)
- `OWNER_SMS_TO`
- `CORS_ALLOW_ORIGIN` (e.g., `https://jedairconditioning.com.au`)
- `TWILIO_STATUS_CALLBACK_URL` (e.g., `https://hooks.jedairconditioning.com.au/api/twilio-status`)
- `VITE_API_BASE` (set on main site, not hooks) = `https://hooks.jedairconditioning.com.au`

---

## Standard Verification Commands
```zsh
# Hooks health check
curl -i https://hooks.jedairconditioning.com.au/api/health

# Live test submission
curl -sS -X POST "https://hooks.jedairconditioning.com.au/api/quote" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"+61400000000","email":"test@example.com","serviceType":"installation","message":"Test submission","source":"live-test"}'
```

---

## Notes
- Keep the hooks API **public** (no deployment protection) for Twilio webhooks.
- Use **From number** routing unless you’ve confirmed the Messaging Service has a valid sender pool.
- If Twilio errors persist, verify account-level messaging restrictions and geo permissions.
