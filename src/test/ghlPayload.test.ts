import { describe, it, expect } from 'vitest';
import {
  buildGhlPayload,
  normaliseAuPhone,
  URGENCY_LABELS,
  type LeadInput,
  type StructuredAddress,
} from '@/lib/ghl';

/**
 * Locks the payload shape sent to the GoHighLevel inbound webhook.
 *
 * GHL silently drops inbound keys it has no field for, so a renamed or missing
 * key never errors anywhere — the lead just arrives with the data quietly
 * absent. That failure is invisible in production, which is exactly why the
 * contract is pinned here.
 *
 * scripts/send-sample-lead.mjs reproduces this same shape for GHL's field
 * mapper; if this test changes, update that script to match.
 */

const DETAILS: StructuredAddress = {
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
};

const BASE: LeadInput = {
  name: 'Sample Lead',
  phone: '0434 308 070',
  email: 'sample@example.com',
  address: '12/88 Wentworth Park Road, Glebe NSW 2037, Australia',
  serviceType: 'repair',
  urgency: 'asap',
  message: 'Test',
  addressDetails: DETAILS,
  source: 'hero-inline',
  formFillMs: 24000,
};

describe('normaliseAuPhone', () => {
  it.each([
    ['0434 308 070', '+61434308070'],
    ['0434308070', '+61434308070'],
    ['+61 434 308 070', '+61434308070'],
    ['61434308070', '+61434308070'],
    ['(02) 9876 5432', '+61298765432'],
    ['434308070', '+61434308070'],
  ])('normalises %s to %s', (input, expected) => {
    expect(normaliseAuPhone(input)).toBe(expected);
  });

  it.each([['+1 555 0100'], ['12345'], [''], ['not a phone'], ['0134308070']])(
    'rejects %s',
    (input) => {
      expect(normaliseAuPhone(input)).toBeNull();
    }
  );
});

describe('buildGhlPayload', () => {
  it('maps a verified address onto GHL standard contact fields', () => {
    const p = buildGhlPayload(BASE);

    // These five put the job address on the native contact record.
    expect(p.address1).toBe('12/88 Wentworth Park Road');
    expect(p.city).toBe('Glebe');
    expect(p.state).toBe('NSW');
    expect(p.postal_code).toBe('2037');
    expect(p.country).toBe('AU');
  });

  it('normalises the phone to E.164 so GHL dedupes contacts correctly', () => {
    expect(buildGhlPayload(BASE).phone).toBe('+61434308070');
  });

  it('carries urgency as value, label and boolean flag', () => {
    const p = buildGhlPayload(BASE);
    expect(p.urgency).toBe('asap');
    expect(p.urgencyLabel).toBe(URGENCY_LABELS.asap);
    expect(p.isUrgent).toBe(true);
  });

  it('marks a non-ASAP lead as not urgent', () => {
    const p = buildGhlPayload({ ...BASE, urgency: 'flexible' });
    expect(p.isUrgent).toBe(false);
    expect(p.urgencyLabel).toBe('Planning ahead / Flexible');
  });

  it('falls back to "Not specified" when urgency is missing', () => {
    const p = buildGhlPayload({ ...BASE, urgency: '' });
    expect(p.urgencyLabel).toBe('Not specified');
    expect(p.isUrgent).toBe(false);
  });

  it('flags a typed address as unverified and omits the split fields', () => {
    const p = buildGhlPayload({
      ...BASE,
      address: '5 George Street, Parramatta',
      addressDetails: null,
    });

    expect(p.addressVerified).toBe(false);
    expect(p.address1).toBe('5 George Street, Parramatta');
    expect(p.country).toBe('AU');
    // Nothing to split, so these must be absent rather than empty strings —
    // an empty string would overwrite good data on an existing GHL contact.
    expect(p.city).toBeUndefined();
    expect(p.state).toBeUndefined();
    expect(p.postal_code).toBeUndefined();
  });

  it('reassembles the unit into address1 rather than dropping it', () => {
    // Google returns the unit separately as `subpremise`, never joined.
    expect(buildGhlPayload(BASE).address1).toBe('12/88 Wentworth Park Road');
  });

  it('never includes the honeypot and always carries the bot signal', () => {
    const p = buildGhlPayload(BASE);
    expect(p).not.toHaveProperty('website');
    expect(p.formFillMs).toBe(24000);
  });

  it('trims whitespace so GHL does not store padded values', () => {
    const p = buildGhlPayload({
      ...BASE,
      name: '  Sample Lead  ',
      email: ' sample@example.com ',
      message: '  Test  ',
    });
    expect(p.name).toBe('Sample Lead');
    expect(p.email).toBe('sample@example.com');
    expect(p.message).toBe('Test');
  });
});
