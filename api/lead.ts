/**
 * Server-side lead handler.
 *
 * WHY THIS EXISTS
 * The browser posts straight to a GoHighLevel inbound webhook, and a workflow
 * ("Lead Enquiry - Website") turns that into a contact. Tested end to end on
 * 17 Sep 2026, that workflow maps four things — full_name, address, email,
 * phone — and nothing else. City, state and postcode were dropped, every
 * custom field stayed empty (the detail survived only as a note), no owner was
 * assigned, and the auto-reply to the customer opened with "Hey !" because the
 * name never landed. The workflow builder is the one part of GHL the public API
 * cannot edit, so the mapping is done here instead, with the private
 * integration token held server-side.
 *
 * WHAT IT DOES, in order:
 *   1. Upserts the contact with every field mapped, including the custom
 *      fields, tags and Anthony as the assigned owner. This runs BEFORE the
 *      webhook forward on purpose: the workflow's auto-reply email reads
 *      {{contact.first_name}}, so the name has to be on the record first.
 *   2. Forwards the same payload to the existing webhook, so everything already
 *      built there (auto-reply email, opportunity, Meta attribution) still runs
 *      and nothing has to be rebuilt.
 *   3. Texts the lead's details to Anthony's mobile from JED's LeadConnector
 *      number, so a lead reaches him even if he is not in the app.
 *   4. In the background, names the opportunity the workflow just created and
 *      assigns it, since it is created unnamed with a $1 value.
 *
 * It also refuses to process the same phone number twice inside 30 seconds, so
 * a double tap, a refresh or a network retry cannot produce a second contact,
 * a second opportunity or a second alert text.
 *
 * It never throws a 5xx at the browser for a GHL failure: the client falls back
 * to posting the webhook itself (see src/lib/ghl.ts), so a bad token or a GHL
 * outage degrades to exactly the behaviour the site had before this existed.
 *
 * ENV (Vercel project jeds-new-dion, all server-side — none of this is in the
 * bundle):
 *   GHL_PIT_TOKEN        private integration token, the only secret here
 *   GHL_LOCATION_ID      JED sub-account
 *   GHL_OWNER_USER_ID    Anthony, for contact + opportunity assignment
 *   GHL_ALERT_CONTACT_ID the contact record holding Anthony's mobile
 *   GHL_LC_NUMBER        JED's LeadConnector number, the SMS sender
 *   GHL_WEBHOOK_URL      the inbound hook to forward to
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';

const TOKEN = process.env.GHL_PIT_TOKEN || '';
const LOCATION_ID = process.env.GHL_LOCATION_ID || '9xaMmBgvB2Brx7l670cB';
const OWNER_USER_ID = process.env.GHL_OWNER_USER_ID || '';
const ALERT_CONTACT_ID = process.env.GHL_ALERT_CONTACT_ID || '';
const LC_NUMBER = process.env.GHL_LC_NUMBER || '';
const WEBHOOK_URL =
  process.env.GHL_WEBHOOK_URL ||
  'https://services.leadconnectorhq.com/hooks/9xaMmBgvB2Brx7l670cB/webhook-trigger/469c88fa-a552-41f9-be5e-398e6cb92045';

type Json = Record<string, unknown>;

/** Repeat submissions from the same number inside this window are ignored. */
const DUPLICATE_WINDOW_MS = 30_000;

function ghl(path: string, method: string, body?: Json) {
  return fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Version: VERSION,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

/** GHL dedupes on phone, so "0434 308 070" and "+61434308070" must not split. */
function normaliseAuPhone(input: string): string | null {
  if (!input) return null;
  let c = String(input).trim().replace(/[^\d+]/g, '');
  if (c.startsWith('+61')) c = '+61' + c.slice(3);
  else if (c.startsWith('61')) c = '+' + c;
  else if (c.startsWith('0')) c = '+61' + c.slice(1);
  else if (/^[23478]\d{8}$/.test(c)) c = '+61' + c;
  return /^\+61[23478]\d{8}$/.test(c) ? c : null;
}

/** "Jeff Nguyen-Smith" -> ["Jeff", "Nguyen-Smith"]; a single word has no surname. */
function splitName(full: string): [string, string] {
  const parts = String(full || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ['', ''];
  if (parts.length === 1) return [parts[0], ''];
  return [parts[0], parts.slice(1).join(' ')];
}

function str(v: unknown): string {
  if (v === null || v === undefined) return '';
  return typeof v === 'string' ? v : String(v);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const lead = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}) as Json;

  const name = str(lead.name).trim();
  const phone = normaliseAuPhone(str(lead.phone)) || str(lead.phone).trim();
  const email = str(lead.email).trim();
  if (!phone && !email) {
    res.status(400).json({ ok: false, error: 'A phone number or an email address is required.' });
    return;
  }

  const [firstName, lastName] = splitName(name);
  const suburb = str(lead.city);
  const serviceType = str(lead.serviceType);
  const urgencyLabel = str(lead.urgencyLabel) || str(lead.urgency);
  const source = str(lead.source) || 'website';
  // "Google Ads" on its own, or "Google Ads -> Direct" when they first arrived
  // on an ad and came back another way to enquire.
  const firstChannel = str(lead.attr_channel);
  const lastChannel = str(lead.attr_last_channel);
  const channel =
    firstChannel && lastChannel && firstChannel !== lastChannel
      ? `${firstChannel} -> ${lastChannel}`
      : firstChannel || lastChannel;
  // The workflow reads this key for the contact's name; the browser sends it
  // too, so the fallback path names the contact even when this handler is not
  // reached. Keeping it here means the forward below carries it either way.
  const forwarded: Json = { ...lead, full_name: name || `${firstName} ${lastName}`.trim() };

  const result: Json = { ok: true, contactId: null, mapped: false, forwarded: false, alerted: false };

  // ---- 0. the 30-second guard ------------------------------------------
  // A double tap, a refresh, a flaky-network retry or a second device would
  // otherwise each produce a contact update, an opportunity and an alert text.
  // If this person already came through within the window, acknowledge and
  // stop. `forwarded: true` is deliberate: it tells the browser not to fall
  // back to posting the webhook itself, which would undo the guard.
  if (TOKEN && phone) {
    try {
      const look = await ghl(
        `/contacts/?locationId=${LOCATION_ID}&query=${encodeURIComponent(phone)}`,
        'GET',
      );
      const existing = (((await look.json().catch(() => ({}))) as Json).contacts as Json[] | undefined) || [];
      const recent = existing.find((c) => {
        const seen = Date.parse(str(c.dateUpdated) || str(c.dateAdded));
        return Number.isFinite(seen) && Date.now() - seen < DUPLICATE_WINDOW_MS;
      });
      if (recent) {
        res.status(200).json({ ...result, contactId: str(recent.id), duplicate: true, forwarded: true });
        return;
      }
    } catch {
      // A failed lookup must never block a real lead; fall through and write.
    }
  }

  // ---- 1. the contact, fully mapped -------------------------------------
  let contactId = '';
  if (TOKEN) {
    try {
      const customFields = [
        ['service_type', serviceType],
        ['urgency', str(lead.urgency)],
        ['is_urgent', lead.isUrgent ? 'Yes' : 'No'],
        ['message', str(lead.message)],
        ['full_address', str(lead.full_address) || str(lead.address)],
        ['submitted_at', str(lead.submittedAt) || new Date().toISOString()],
        ['likely_bot', lead.likelyBot ? 'Yes' : 'No'],
        ['address_verified', lead.addressVerified ? 'Yes' : 'No'],
        // Attribution, captured on the visitor's first page (src/lib/
        // attribution.ts). The channel carries the current visit's channel too
        // when it differs, so "Google Ads -> Direct" is visible on one line
        // rather than needing two fields to compare.
        ['attr_channel', channel],
        ['attr_source', str(lead.attr_source)],
        ['attr_medium', str(lead.attr_medium)],
        ['attr_campaign', str(lead.attr_campaign)],
        ['attr_term', str(lead.attr_term)],
        ['attr_content', str(lead.attr_content)],
        ['attr_gclid', str(lead.attr_gclid)],
        ['attr_fbclid', str(lead.attr_fbclid)],
        ['attr_msclkid', str(lead.attr_msclkid)],
        ['attr_referrer', str(lead.attr_referrer)],
        ['attr_landing_page', str(lead.attr_landing_page)],
        ['attr_first_seen', str(lead.attr_first_seen)],
      ]
        .filter(([, value]) => value !== '')
        .map(([key, field_value]) => ({ key, field_value }));

      const upsert = await ghl('/contacts/upsert', 'POST', {
        locationId: LOCATION_ID,
        firstName,
        lastName,
        name,
        email,
        phone,
        address1: str(lead.address1) || str(lead.address),
        city: suburb,
        state: str(lead.state),
        postalCode: str(lead.postal_code) || str(lead.postalCode),
        country: str(lead.country) || 'AU',
        source,
        tags: ['website-lead', source, channel ? `src:${channel}` : ''].filter(Boolean),
        ...(OWNER_USER_ID ? { assignedTo: OWNER_USER_ID } : {}),
        customFields,
      });
      const body = (await upsert.json().catch(() => ({}))) as Json;
      contactId = str(((body.contact as Json) || {}).id);
      result.mapped = upsert.ok;
      result.contactId = contactId || null;
      if (!upsert.ok) result.mapError = upsert.status;
    } catch (err) {
      result.mapError = String(err);
    }
  } else {
    result.mapError = 'GHL_PIT_TOKEN is not set';
  }

  // ---- 2. hand the same lead to the existing workflow --------------------
  try {
    const hook = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forwarded),
    });
    result.forwarded = hook.ok;
  } catch (err) {
    result.forwardError = String(err);
  }

  // ---- 3. text the lead to Anthony --------------------------------------
  if (TOKEN && ALERT_CONTACT_ID && LC_NUMBER) {
    const lines = [
      `NEW JED LEAD — ${name || 'No name given'}`,
      phone,
      [serviceType, urgencyLabel].filter(Boolean).join(' • '),
      suburb ? `Suburb: ${suburb}` : '',
      channel ? `Source: ${channel}` : '',
      str(lead.message) ? `"${str(lead.message).slice(0, 140)}"` : '',
      'Open LeadConnector to reply.',
    ].filter(Boolean);
    try {
      const sms = await ghl('/conversations/messages', 'POST', {
        type: 'SMS',
        contactId: ALERT_CONTACT_ID,
        fromNumber: LC_NUMBER,
        message: lines.join('\n'),
      });
      result.alerted = sms.ok;
      if (!sms.ok) result.alertError = sms.status;
    } catch (err) {
      result.alertError = String(err);
    }
  }

  // Answer the browser now; the opportunity tidy-up below does not need to
  // hold the form open.
  res.status(200).json(result);

  // ---- 4. name and assign the opportunity the workflow creates -----------
  // It arrives a few seconds after the forward, unnamed and worth $1.
  if (!TOKEN || !contactId) return;
  try {
    for (let attempt = 0; attempt < 4; attempt++) {
      await new Promise((r) => setTimeout(r, 2500));
      const search = await ghl(
        `/opportunities/search?location_id=${LOCATION_ID}&contact_id=${contactId}`,
        'GET',
      );
      const found = ((await search.json().catch(() => ({}))) as Json).opportunities as Json[] | undefined;
      const opp = (found || [])[0];
      if (!opp) continue;
      const title = [name || phone, serviceType].filter(Boolean).join(' — ');
      await ghl(`/opportunities/${str(opp.id)}`, 'PUT', {
        name: title,
        ...(OWNER_USER_ID ? { assignedTo: OWNER_USER_ID } : {}),
      });
      break;
    }
  } catch {
    // Best effort: the opportunity still exists, it just keeps its blank name.
  }
}
