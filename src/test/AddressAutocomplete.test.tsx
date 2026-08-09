import { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import type { StructuredAddress } from '@/lib/ghl';

/**
 * The address field sits directly in JED's lead pipeline and now calls Google
 * Places from the browser with no server in front of it. These cover the paths
 * where Google misbehaves — a broken or unbilled key must never stop a lead
 * being submitted.
 */

const KEY = 'TEST_PLACES_KEY';

/** Google Places (New) autocomplete response shape. */
const AUTOCOMPLETE_RESPONSE = {
  suggestions: [
    {
      placePrediction: {
        placeId: 'place-abc',
        text: { text: '42 Wentworth Ave, Mascot NSW 2020, Australia' },
        structuredFormat: {
          mainText: { text: '42 Wentworth Ave' },
          secondaryText: { text: 'Mascot NSW 2020, Australia' },
        },
      },
    },
  ],
};

/** Google Places (New) place details response shape. */
const DETAILS_RESPONSE = {
  id: 'place-abc',
  formattedAddress: '42 Wentworth Ave, Mascot NSW 2020, Australia',
  addressComponents: [
    { longText: '42', shortText: '42', types: ['street_number'] },
    { longText: 'Wentworth Avenue', shortText: 'Wentworth Ave', types: ['route'] },
    { longText: 'Mascot', shortText: 'Mascot', types: ['locality'] },
    { longText: 'New South Wales', shortText: 'NSW', types: ['administrative_area_level_1'] },
    { longText: '2020', shortText: '2020', types: ['postal_code'] },
    { longText: 'Australia', shortText: 'AU', types: ['country'] },
  ],
  location: { latitude: -33.9, longitude: 151.2 },
};

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

const isAutocomplete = (url: unknown) => String(url).includes('places:autocomplete');

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.stubEnv('VITE_GOOGLE_PLACES_API_KEY', KEY);
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const happyPath = () =>
  fetchMock.mockImplementation((url: string) =>
    isAutocomplete(url) ? jsonResponse(AUTOCOMPLETE_RESPONSE) : jsonResponse(DETAILS_RESPONSE)
  );

describe('AddressAutocomplete', () => {
  it('does not call Google below the minimum query length', async () => {
    const user = userEvent.setup();
    render(<Harness onSelect={vi.fn()} />);

    await user.type(screen.getByLabelText('Site Address *'), 'ab');

    await new Promise((r) => setTimeout(r, 400));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the API key as a header, never as a query param', async () => {
    const user = userEvent.setup();
    happyPath();
    render(<Harness onSelect={vi.fn()} />);

    await user.type(screen.getByLabelText('Site Address *'), '42 Wentworth');
    await screen.findByRole('option', {}, { timeout: 3000 });

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).not.toContain(KEY);
    expect((init.headers as Record<string, string>)['X-Goog-Api-Key']).toBe(KEY);
  });

  it('shows suggestions and returns a structured address on selection', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    happyPath();

    render(<Harness onSelect={onSelect} />);
    await user.type(screen.getByLabelText('Site Address *'), '42 Wentworth');

    const option = await screen.findByRole('option', {}, { timeout: 3000 });
    expect(option).toHaveTextContent('42 Wentworth Ave');
    expect(option).toHaveTextContent('Mascot NSW 2020');

    await user.click(option);

    await waitFor(() => expect(onSelect).toHaveBeenCalled());
    const selected = onSelect.mock.calls.at(-1)?.[0] as StructuredAddress;

    // The suburb/state/postcode split is what GHL maps onto the contact record.
    expect(selected.addressLine1).toBe('42 Wentworth Avenue');
    expect(selected.suburb).toBe('Mascot');
    expect(selected.state).toBe('NSW');
    expect(selected.postcode).toBe('2020');
    expect(selected.countryCode).toBe('AU');
  });

  it('sends one session token across keystrokes and the details call', async () => {
    const user = userEvent.setup();
    happyPath();

    render(<Harness onSelect={vi.fn()} />);
    await user.type(screen.getByLabelText('Site Address *'), '42 Wentworth');
    await user.click(await screen.findByRole('option', {}, { timeout: 3000 }));

    await waitFor(() =>
      expect(fetchMock.mock.calls.some((c) => !isAutocomplete(c[0]))).toBe(true)
    );

    const tokens = new Set(
      fetchMock.mock.calls.map(([url, init]) =>
        isAutocomplete(url)
          ? JSON.parse(String(init.body)).sessionToken
          : new URL(String(url)).searchParams.get('sessionToken')
      )
    );
    // One lookup must bill as a single session, not one charge per keystroke.
    expect(tokens.size).toBe(1);
  });

  it('degrades to a plain input when no API key is configured', async () => {
    const user = userEvent.setup();
    vi.stubEnv('VITE_GOOGLE_PLACES_API_KEY', '');

    render(<Harness onSelect={vi.fn()} />);
    const input = screen.getByLabelText('Site Address *');
    await user.type(input, '42 Wentworth Ave Mascot');

    await waitFor(() => expect(screen.getByText(/Enter your full street address/i)).toBeVisible());
    expect(fetchMock).not.toHaveBeenCalled();
    // Critically, the typed value survives so the lead can still submit.
    expect(input).toHaveValue('42 Wentworth Ave Mascot');
  });

  it('stops asking after Google rejects the key, instead of burning quota', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation(() =>
      jsonResponse({ error: { status: 'INVALID_ARGUMENT', message: 'API_KEY_INVALID' } }, 400)
    );

    render(<Harness onSelect={vi.fn()} />);
    const input = screen.getByLabelText('Site Address *');
    await user.type(input, '42 Wentworth');
    await waitFor(() => expect(screen.getByText(/Enter your full street address/i)).toBeVisible());

    const callsAfterRejection = fetchMock.mock.calls.length;
    await user.type(input, ' Mascot NSW');
    await new Promise((r) => setTimeout(r, 500));

    expect(fetchMock.mock.calls.length).toBe(callsAfterRejection);
    expect(input).toHaveValue('42 Wentworth Mascot NSW');
  });

  it('keeps the typed value and stays silent when the lookup errors', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation(() => jsonResponse({ error: 'boom' }, 500));

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
    happyPath();

    render(<Harness onSelect={onSelect} />);
    const input = screen.getByLabelText('Site Address *');
    await user.type(input, '42 Wentworth');
    await user.click(await screen.findByRole('option', {}, { timeout: 3000 }));
    await waitFor(() => expect(onSelect).toHaveBeenCalled());

    await user.type(input, ' unit 5');

    // Editing invalidates the verified address so a stale placeId is never sent.
    await waitFor(() => expect(onSelect).toHaveBeenLastCalledWith(null));
  });
});
