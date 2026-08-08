import { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressAutocomplete, {
  type StructuredAddress,
} from '@/components/AddressAutocomplete';

/**
 * The address field sits directly in JED's lead pipeline, so these cover the
 * paths where Google misbehaves — a broken lookup must never stop a lead being
 * submitted.
 */

const SUGGESTION = {
  placeId: 'place-abc',
  primary: '42 Wentworth Ave',
  secondary: 'Mascot NSW 2020, Australia',
  full: '42 Wentworth Ave, Mascot NSW 2020, Australia',
};

const DETAILS: StructuredAddress = {
  placeId: 'place-abc',
  formatted: '42 Wentworth Ave, Mascot NSW 2020, Australia',
  unit: '',
  streetNumber: '42',
  street: 'Wentworth Ave',
  addressLine1: '42 Wentworth Ave',
  suburb: 'Mascot',
  state: 'NSW',
  postcode: '2020',
  country: 'Australia',
  countryCode: 'AU',
  lat: -33.9,
  lng: 151.2,
};

/** Controlled wrapper mirroring how the quote forms drive the component. */
function Harness({ onSelect }: { onSelect: (a: StructuredAddress | null) => void }) {
  const [value, setValue] = useState('');
  const [confirmed, setConfirmed] = useState<StructuredAddress | null>(null);
  return (
    <AddressAutocomplete
      id="address"
      label="Site Address *"
      value={value}
      onChange={setValue}
      onSelect={(a) => {
        setConfirmed(a);
        onSelect(a);
      }}
      confirmedAddress={confirmed}
    />
  );
}

const jsonResponse = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('AddressAutocomplete', () => {
  it('does not call the Places proxy below the minimum query length', async () => {
    const user = userEvent.setup();
    render(<Harness onSelect={vi.fn()} />);

    await user.type(screen.getByLabelText('Site Address *'), 'ab');

    // Give the debounce window a chance to elapse before asserting silence.
    await new Promise((r) => setTimeout(r, 400));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows suggestions and returns a structured address on selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    fetchMock.mockImplementation((_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      if (body.action === 'autocomplete') return jsonResponse({ suggestions: [SUGGESTION] });
      if (body.action === 'details') return jsonResponse({ address: DETAILS });
      return jsonResponse({}, 400);
    });

    render(<Harness onSelect={onSelect} />);
    await user.type(screen.getByLabelText('Site Address *'), '42 Wentworth');

    const option = await screen.findByRole('option', {}, { timeout: 3000 });
    expect(option).toHaveTextContent('42 Wentworth Ave');
    expect(option).toHaveTextContent('Mascot NSW 2020');

    await user.click(option);

    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(DETAILS));

    // The suburb/state/postcode split is what GHL maps onto the contact record.
    const selected = onSelect.mock.calls.at(-1)?.[0] as StructuredAddress;
    expect(selected.addressLine1).toBe('42 Wentworth Ave');
    expect(selected.suburb).toBe('Mascot');
    expect(selected.state).toBe('NSW');
    expect(selected.postcode).toBe('2020');
  });

  it('sends one session token across keystrokes, then rotates it after details', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation((_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      if (body.action === 'autocomplete') return jsonResponse({ suggestions: [SUGGESTION] });
      return jsonResponse({ address: DETAILS });
    });

    render(<Harness onSelect={vi.fn()} />);
    await user.type(screen.getByLabelText('Site Address *'), '42 Wentworth');
    const option = await screen.findByRole('option', {}, { timeout: 3000 });
    await user.click(option);

    await waitFor(() => {
      const actions = fetchMock.mock.calls.map((c) => JSON.parse(String(c[1].body)));
      expect(actions.some((a) => a.action === 'details')).toBe(true);
    });

    const bodies = fetchMock.mock.calls.map((c) => JSON.parse(String(c[1].body)));
    const tokens = new Set(bodies.map((b) => b.sessionToken));
    // Autocomplete + details for one lookup must share a single billed session.
    expect(tokens.size).toBe(1);
  });

  it('degrades to a plain input when the proxy reports no API key', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation(() =>
      jsonResponse({ error: 'Address lookup unavailable', reason: 'missing_api_key' }, 503)
    );

    render(<Harness onSelect={vi.fn()} />);
    const input = screen.getByLabelText('Site Address *');
    await user.type(input, '42 Wentworth Ave Mascot');

    await waitFor(() => expect(screen.getByText(/Enter your full street address/i)).toBeVisible());
    expect(screen.queryByRole('option')).toBeNull();
    // Critically, the typed value survives so the lead can still submit.
    expect(input).toHaveValue('42 Wentworth Ave Mascot');
  });

  it('keeps the typed value and stays silent when the lookup errors', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation(() => jsonResponse({ error: 'Address lookup failed' }, 502));

    render(<Harness onSelect={vi.fn()} />);
    const input = screen.getByLabelText('Site Address *');
    await user.type(input, '42 Wentworth Ave');

    await new Promise((r) => setTimeout(r, 500));
    expect(screen.queryByRole('option')).toBeNull();
    expect(input).toHaveValue('42 Wentworth Ave');
  });

  it('clears a confirmed address once the user edits the field again', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    fetchMock.mockImplementation((_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      if (body.action === 'autocomplete') return jsonResponse({ suggestions: [SUGGESTION] });
      return jsonResponse({ address: DETAILS });
    });

    render(<Harness onSelect={onSelect} />);
    const input = screen.getByLabelText('Site Address *');
    await user.type(input, '42 Wentworth');
    await user.click(await screen.findByRole('option', {}, { timeout: 3000 }));
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(DETAILS));

    await user.type(input, ' unit 5');

    // Editing invalidates the verified address so a stale placeId is never sent.
    await waitFor(() => expect(onSelect).toHaveBeenLastCalledWith(null));
  });
});
