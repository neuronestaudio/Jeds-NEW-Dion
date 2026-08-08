/**
 * Fire a sample lead so GoHighLevel can capture it and build its field mapping.
 *
 * The payload here is byte-for-byte the shape `api/quote.ts` forwards to the GHL
 * inbound webhook, so whatever GHL learns from this sample is exactly what it
 * receives from a real submission. Keep the two in sync if either changes.
 *
 * Usage
 *   # 1. In GHL: Automation > Workflows > new workflow > Inbound Webhook trigger.
 *   #    Copy the webhook URL, then set it listening for a sample.
 *   node scripts/send-sample-lead.mjs --url "https://services.leadconnectorhq.com/hooks/..."
 *
 *   # See the payload without sending anything
 *   node scripts/send-sample-lead.mjs --print
 *
 *   # A typed (unverified) address instead of a Google-selected one
 *   node scripts/send-sample-lead.mjs --url "..." --variant unverified
 *
 *   # Exercise the whole chain through the live API instead of hitting GHL direct.
 *   # WARNING: this fires real Twilio SMS to the owner and the test number.
 *   node scripts/send-sample-lead.mjs --via-api https://hooks.jedairconditioning.com.au
 *
 * Flags: --url --via-api --variant(verified|unverified) --service --urgency
 *        --print --name --email --phone
 */

const args = (() => {
  const raw = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < raw.length; i++) {
    if (!raw[i].startsWith('--')) continue;
    const key = raw[i].replace(/^--/, '');
    const next = raw[i + 1];
    out[key] = next && !next.startsWith('--') ? raw[++i] : true;
  }
  return out;
})();

const URGENCY_LABELS = {
  asap: 'ASAP / Today if possible',
  'few-days': 'Within the next few days',
  flexible: 'Planning ahead / Flexible',
};

const service = args.service || 'repair';
const urgency = args.urgency || 'asap';
const verified = (args.variant || 'verified') !== 'unverified';

if (!URGENCY_LABELS[urgency]) {
  console.error(`Unknown --urgency "${urgency}". Use: ${Object.keys(URGENCY_LABELS).join(', ')}`);
  process.exit(1);
}

const name = args.name || 'Sample Lead';
const email = args.email || 'sample.lead@example.com';
// Australian mobile in E.164 — api/quote.ts normalises before forwarding, so the
// sample carries the already-normalised form GHL will actually see.
const phone = args.phone || '+61434308070';

/** Structured address exactly as the Places proxy returns it. */
const addressDetails = {
  placeId: 'ChIJSAMPLE_PLACE_ID_0000000',
  formatted: '12/88 Wentworth Park Road, Glebe NSW 2037, Australia',
  unit: '12',
  streetNumber: '88',
  street: 'Wentworth Park Road',
  addressLine1: '12/88 Wentworth Park Road',
  suburb: 'Glebe',
  state: 'NSW',
  postcode: '2037',
  country: 'Australia',
  countryCode: 'AU',
  lat: -33.8785,
  lng: 151.1926,
};

const typedAddress = '5 George Street, Parramatta';
const addressText = verified ? addressDetails.formatted : typedAddress;

/** Mirrors the ghlAddress branch in api/quote.ts. */
const ghlAddress = verified
  ? {
      address1: addressDetails.addressLine1,
      city: addressDetails.suburb,
      state: addressDetails.state,
      postal_code: addressDetails.postcode,
      country: addressDetails.countryCode,
      postalCode: addressDetails.postcode,
      full_address: addressDetails.formatted,
      latitude: addressDetails.lat,
      longitude: addressDetails.lng,
      addressVerified: true,
      googlePlaceId: addressDetails.placeId,
    }
  : {
      address1: typedAddress,
      full_address: typedAddress,
      country: 'AU',
      addressVerified: false,
    };

/** What the browser sends to /api/quote (honeypot omitted — it is stripped before forwarding). */
const clientPayload = {
  name,
  phone,
  email,
  address: addressText,
  serviceType: service,
  urgency,
  message: 'Sample submission for GoHighLevel field mapping. Safe to delete.',
  ...(verified ? { addressDetails } : {}),
  source: 'sample-lead-script',
};

/** What api/quote.ts actually POSTs to the GHL inbound webhook. */
const ghlPayload = {
  ...clientPayload,
  ...ghlAddress,
  address: addressText,
  phone,
  urgency,
  urgencyLabel: URGENCY_LABELS[urgency],
  isUrgent: urgency === 'asap',
  source: clientPayload.source,
  submittedAt: new Date().toISOString(),
};

const STANDARD_FIELDS = {
  first_name_or_name: 'name',
  email: 'email',
  phone: 'phone',
  address1: 'address1',
  city: 'city',
  state: 'state',
  postal_code: 'postal_code',
  country: 'country',
};

function printMappingGuide() {
  console.log('\n── Maps to GHL STANDARD contact fields (no setup needed) ──');
  for (const key of ['name', 'email', 'phone', 'address1', 'city', 'state', 'postal_code', 'country']) {
    if (key in ghlPayload) {
      console.log(`  ${key.padEnd(14)} ${JSON.stringify(ghlPayload[key])}`);
    }
  }

  console.log('\n── Needs a CUSTOM FIELD in GHL, or it is silently dropped ──');
  for (const key of Object.keys(ghlPayload)) {
    if (key in STANDARD_FIELDS || Object.values(STANDARD_FIELDS).includes(key)) continue;
    if (['name', 'email', 'phone', 'address1', 'city', 'state', 'postal_code', 'country'].includes(key)) continue;
    if (key === 'addressDetails') {
      console.log(`  ${key.padEnd(16)} (nested object — GHL flattens as addressDetails.*)`);
      continue;
    }
    console.log(`  ${key.padEnd(16)} ${JSON.stringify(ghlPayload[key])}`);
  }
  console.log('');
}

async function main() {
  const viaApi = typeof args['via-api'] === 'string' ? args['via-api'] : null;
  const url = typeof args.url === 'string' ? args.url : process.env.GHL_WEBHOOK_URL;

  console.log(`\nVariant : ${verified ? 'verified (Google-selected address)' : 'unverified (typed address)'}`);
  console.log(`Service : ${service}`);
  console.log(`Urgency : ${urgency} — ${URGENCY_LABELS[urgency]}`);

  if (viaApi) {
    console.log('\n=== PAYLOAD THE BROWSER SENDS TO /api/quote ===');
    console.log(JSON.stringify(clientPayload, null, 2));
  } else {
    console.log('\n=== PAYLOAD GHL RECEIVES ===');
    console.log(JSON.stringify(ghlPayload, null, 2));
    printMappingGuide();
  }

  if (args.print) {
    console.log('--print set: nothing sent.\n');
    return;
  }

  if (viaApi) {
    const target = `${viaApi.replace(/\/$/, '')}/api/quote`;
    console.log(`\n!! Sending through the LIVE API: ${target}`);
    console.log('!! This forwards to GHL *and* fires real Twilio SMS.\n');
    const resp = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientPayload),
    });
    console.log(`HTTP ${resp.status}`);
    console.log(await resp.text());
    return;
  }

  if (!url) {
    console.error(
      '\nNo target. Pass --url "<GHL inbound webhook URL>", set GHL_WEBHOOK_URL,\n' +
        'or use --print to inspect the payload without sending.\n'
    );
    process.exit(1);
  }

  console.log(`\nPOSTing to: ${url}`);
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ghlPayload),
  });
  const body = await resp.text();
  console.log(`HTTP ${resp.status} ${resp.statusText}`);
  if (body) console.log(body.slice(0, 500));
  console.log(
    resp.ok
      ? '\nSent. GHL should now show this sample in the trigger\'s field mapper.\n'
      : '\nSend failed — check the webhook URL is the inbound-webhook trigger URL.\n'
  );
}

main().catch((err) => {
  console.error('Failed:', err?.message || err);
  process.exit(1);
});
