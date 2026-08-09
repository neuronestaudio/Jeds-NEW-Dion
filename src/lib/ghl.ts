/**
 * Direct-to-GoHighLevel lead submission.
 *
 * The form POSTs straight to the GHL inbound webhook from the browser — there is
 * no server hop. GHL's hook endpoint returns `Access-Control-Allow-Origin: *`,
 * so a cross-origin POST from the site is allowed.
 *
 * Everything here is pure data shaping that used to run in the serverless
 * handler: AU phone normalisation, Google address components mapped onto GHL's
 * standard contact fields, urgency expanded to a label and a boolean. None of
 * it needed a secret, which is why it can move client-side.
 *
 * TRADE-OFF, on purpose: `VITE_GHL_WEBHOOK_URL` ships in the JS bundle and is
 * therefore public. Anyone who reads the bundle can POST fake leads to it.
 * There is no way around that with a browser-direct architecture — the
 * honeypot and fill-time signals below are the mitigation, and they are hints
 * for a GHL workflow filter, not a guarantee. If lead spam ever becomes a real
 * problem, the fix is to put the endpoint back behind a server.
 */

export type StructuredAddress = {
  placeId: string;
  formatted: string;
  unit: string;
  streetNumber: string;
  street: string;
  addressLine1: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  countryCode: string;
  lat: number | null;
  lng: number | null;
};

export const URGENCY_LABELS: Record<string, string> = {
  asap: 'ASAP / Today if possible',
  'few-days': 'Within the next few days',
  flexible: 'Planning ahead / Flexible',
};

/**
 * Normalise an Australian number to E.164. GHL matches and dedupes contacts on
 * phone, so "0434 308 070" and "+61434308070" must not become two contacts.
 * Returns null when it cannot be read as a valid AU number.
 */
export function normaliseAuPhone(input: string): string | null {
  if (!input) return null;
  let candidate = input.trim().replace(/[^\d+]/g, '');

  if (candidate.startsWith('+61')) {
    candidate = '+61' + candidate.slice(3);
  } else if (candidate.startsWith('61')) {
    candidate = '+' + candidate;
  } else if (candidate.startsWith('0')) {
    candidate = '+61' + candidate.slice(1);
  } else if (/^[23478]\d{8}$/.test(candidate)) {
    candidate = '+61' + candidate;
  }

  // AU mobile +614XXXXXXXX, or landline +612/3/7/8XXXXXXXX
  return /^\+61[23478]\d{8}$/.test(candidate) ? candidate : null;
}

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceType: string;
  urgency: string;
  message: string;
  addressDetails: StructuredAddress | null;
  source: string;
  /** Milliseconds between the form mounting and submission. Bots submit instantly. */
  formFillMs?: number;
};

/**
 * Build the payload GHL receives.
 *
 * `address1` / `city` / `state` / `postal_code` / `country` are GHL *standard*
 * contact fields, so they populate the native contact record and are usable in
 * workflow triggers and merge fields. Every other key needs a custom field
 * created in GHL first — GHL silently drops inbound keys it has no field for.
 */
export function buildGhlPayload(lead: LeadInput): Record<string, unknown> {
  const details = lead.addressDetails;
  const addressText = lead.address.trim();
  const urgencyKey = (lead.urgency || '').trim();

  const address = details
    ? {
        address1: details.addressLine1 || addressText,
        city: details.suburb || '',
        state: details.state || '',
        postal_code: details.postcode || '',
        country: details.countryCode || 'AU',
        // GHL accepts either casing depending on how the hook was mapped.
        postalCode: details.postcode || '',
        full_address: details.formatted || addressText,
        latitude: details.lat ?? '',
        longitude: details.lng ?? '',
        addressVerified: true,
        googlePlaceId: details.placeId || '',
      }
    : {
        address1: addressText,
        full_address: addressText,
        country: 'AU',
        addressVerified: false,
      };

  return {
    name: lead.name.trim(),
    // Fall back to the raw input rather than dropping the number entirely; the
    // form validates before calling this, so a failure here is worth seeing.
    phone: normaliseAuPhone(lead.phone) || lead.phone.trim(),
    email: lead.email.trim(),
    address: addressText,
    serviceType: lead.serviceType,
    urgency: urgencyKey,
    urgencyLabel: URGENCY_LABELS[urgencyKey] || urgencyKey || 'Not specified',
    isUrgent: urgencyKey === 'asap',
    message: lead.message.trim(),
    ...address,
    source: lead.source,
    formFillMs: lead.formFillMs ?? null,
    // Advisory only — filter on this in a GHL workflow rather than blocking in
    // the browser, so a fast real visitor is never silently discarded.
    likelyBot: typeof lead.formFillMs === 'number' && lead.formFillMs < MIN_HUMAN_FILL_MS,
    submittedAt: new Date().toISOString(),
  };
}

/** Nothing human taps two cards and types four fields faster than this. */
export const MIN_HUMAN_FILL_MS = 3000;

export class GhlNotConfiguredError extends Error {
  constructor() {
    super('Lead destination is not configured.');
    this.name = 'GhlNotConfiguredError';
  }
}

/**
 * POST the lead to the GHL inbound webhook.
 *
 * GHL answers 200 with `{"status":"Success: request sent to trigger execution
 * server"}`. That confirms the hook accepted it — it does NOT mean a contact or
 * opportunity was created; those come from the workflow's own actions.
 */
export async function submitLeadToGhl(lead: LeadInput): Promise<Record<string, unknown>> {
  const webhookUrl = import.meta.env.VITE_GHL_WEBHOOK_URL as string | undefined;
  if (!webhookUrl) throw new GhlNotConfiguredError();

  const payload = buildGhlPayload(lead);

  const resp = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    throw new Error(`Lead submission failed (${resp.status})`);
  }

  return payload;
}
