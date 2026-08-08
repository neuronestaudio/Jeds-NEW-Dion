import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// The deployed handler. Imported directly so this asserts real behaviour rather
// than a copy of it — if the GHL contract drifts, this fails.
import handler from '../../hooks-api/api/quote';

/**
 * Locks the payload shape sent to the GoHighLevel inbound webhook.
 *
 * GHL silently drops inbound keys it has no field for, so a renamed or missing
 * key does not error anywhere — the lead just arrives with the data quietly
 * absent. That failure is invisible in production, which is exactly why it is
 * worth pinning here.
 *
 * scripts/send-sample-lead.mjs reproduces this same shape for GHL's field
 * mapper; if this test changes, update that script to match.
 */

type MockRes = {
  statusCode: number;
  body: unknown;
  headers: Record<string, string>;
  setHeader(k: string, v: string): void;
  status(code: number): MockRes;
  json(payload: unknown): MockRes;
  end(): MockRes;
};

const makeRes = (): MockRes => {
  const res: MockRes = {
    statusCode: 0,
    body: undefined,
    headers: {},
    setHeader(k: string, v: string) {
      this.headers[k] = v;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
};

const BASE_BODY = {
  name: 'Sample Lead',
  phone: '0434 308 070',
  email: 'sample.lead@example.com',
  address: '12/88 Wentworth Park Road, Glebe NSW 2037, Australia',
  serviceType: 'repair',
  urgency: 'asap',
  message: 'Test',
  website: '', // honeypot
  source: 'hero-inline',
  addressDetails: {
    placeId: 'ChIJSAMPLE',
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
  },
};

const WEBHOOK = 'https://services.leadconnectorhq.com/hooks/test/webhook-trigger/abc';

let fetchMock: ReturnType<typeof vi.fn>;

/** Body of the call the handler made to the GHL webhook. */
const forwardedBody = () => {
  const call = fetchMock.mock.calls.find((c) => String(c[0]) === WEBHOOK);
  return call ? JSON.parse(String(call[1].body)) : null;
};

beforeEach(() => {
  vi.stubEnv('GHL_WEBHOOK_URL', WEBHOOK);
  // No Twilio credentials in env => the SMS branches are skipped entirely.
  vi.stubEnv('TWILIO_ACCOUNT_SID', '');
  vi.stubEnv('TWILIO_AUTH_TOKEN', '');
  vi.stubEnv('TWILIO_FROM_NUMBER', '');
  fetchMock = vi.fn(() =>
    Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve('ok') } as Response)
  );
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('quote -> GoHighLevel payload', () => {
  it('maps a verified address onto GHL standard contact fields', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: BASE_BODY }, res);

    expect(res.statusCode).toBe(200);
    const sent = forwardedBody();
    expect(sent).not.toBeNull();

    // These five are what put the job address on the native contact record.
    expect(sent.address1).toBe('12/88 Wentworth Park Road');
    expect(sent.city).toBe('Glebe');
    expect(sent.state).toBe('NSW');
    expect(sent.postal_code).toBe('2037');
    expect(sent.country).toBe('AU');
  });

  it('normalises the AU phone to E.164 before forwarding', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: BASE_BODY }, res);
    expect(forwardedBody().phone).toBe('+61434308070');
  });

  it('carries urgency through as value, label and boolean flag', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: BASE_BODY }, res);

    const sent = forwardedBody();
    expect(sent.urgency).toBe('asap');
    expect(sent.urgencyLabel).toBe('ASAP / Today if possible');
    expect(sent.isUrgent).toBe(true);
  });

  it('marks a non-ASAP lead as not urgent', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: { ...BASE_BODY, urgency: 'flexible' } }, res);

    const sent = forwardedBody();
    expect(sent.isUrgent).toBe(false);
    expect(sent.urgencyLabel).toBe('Planning ahead / Flexible');
  });

  it('never forwards the honeypot field', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: BASE_BODY }, res);
    expect(forwardedBody()).not.toHaveProperty('website');
  });

  it('flags a typed address as unverified and still forwards it', async () => {
    const { addressDetails: _drop, ...typed } = BASE_BODY;
    const res = makeRes();
    await handler(
      { method: 'POST', headers: {}, body: { ...typed, address: '5 George Street, Parramatta' } },
      res
    );

    const sent = forwardedBody();
    expect(sent.addressVerified).toBe(false);
    expect(sent.address1).toBe('5 George Street, Parramatta');
    expect(sent.country).toBe('AU');
    // No Google data to split, so these must be absent rather than empty strings.
    expect(sent.city).toBeUndefined();
  });

  it('still accepts a lead when urgency is missing entirely', async () => {
    const { urgency: _drop, ...noUrgency } = BASE_BODY;
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: noUrgency }, res);

    expect(res.statusCode).toBe(200);
    expect(forwardedBody().urgencyLabel).toBe('Not specified');
  });

  it('rejects a submission with no address', async () => {
    const { address: _drop, ...noAddress } = BASE_BODY;
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: noAddress }, res);

    expect(res.statusCode).toBe(400);
    expect(forwardedBody()).toBeNull();
  });

  it('rejects a non-Australian phone number', async () => {
    const res = makeRes();
    await handler({ method: 'POST', headers: {}, body: { ...BASE_BODY, phone: '+1 555 0100' } }, res);

    expect(res.statusCode).toBe(400);
    expect(forwardedBody()).toBeNull();
  });
});
