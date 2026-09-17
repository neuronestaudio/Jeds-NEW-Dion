import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuoteWizard from '@/components/QuoteWizard';

/**
 * Covers the wizard's navigation and — more importantly — that the answers
 * from steps 1 and 2 actually survive into the submitted payload. A wizard that
 * looks right but drops `urgency` would silently cost JED its priority routing.
 */

const jsonResponse = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  } as Response);

const GHL_HOOK = 'https://services.leadconnectorhq.com/hooks/test/webhook-trigger/abc';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // The lead now goes straight to GHL from the browser, so the webhook URL is
  // a build-time env var rather than an API route.
  vi.stubEnv('VITE_GHL_WEBHOOK_URL', GHL_HOOK);
  // Left unset so the address field degrades to a plain input; these tests are
  // about the wizard, not Places.
  vi.stubEnv('VITE_GOOGLE_PLACES_API_KEY', '');
  fetchMock = vi.fn(() => jsonResponse({ status: 'Success' }));
  vi.stubGlobal('fetch', fetchMock);
  window.sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  // The submit lock persists in sessionStorage, so it has to be cleared between
  // tests or the first successful submit blocks every later one.
  window.sessionStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/**
 * Bodies the wizard sent, wherever they went. The lead goes to our own handler
 * (/api/lead) first, which maps every field and forwards to GHL itself; the
 * webhook is the fallback when that handler is unreachable. A test that only
 * watched the webhook would see nothing on the normal path.
 */
const quotePayloads = () =>
  fetchMock.mock.calls
    .filter((c) => String(c[0]) === GHL_HOOK || String(c[0]) === '/api/lead')
    .map((c) => JSON.parse(String(c[1].body)));

/** Bodies that reached the GHL webhook directly, i.e. the fallback path. */
const webhookPayloads = () =>
  fetchMock.mock.calls
    .filter((c) => String(c[0]) === GHL_HOOK)
    .map((c) => JSON.parse(String(c[1].body)));

describe('QuoteWizard', () => {
  it('starts on the service step and does not ask for details yet', () => {
    render(<QuoteWizard source="test" />);

    expect(screen.getByText('What do you need done?')).toBeInTheDocument();
    expect(screen.getByText('Repair / Breakdown')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Your Name/)).toBeNull();
  });

  it('advances service -> urgency -> details on tap', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard source="test" />);

    await user.click(screen.getByText('Repair / Breakdown'));
    expect(await screen.findByText('How soon do you need it?')).toBeInTheDocument();

    await user.click(screen.getByText('ASAP / Today if possible'));
    expect(await screen.findByLabelText(/Your Name/)).toBeInTheDocument();
  });

  it('shows the earlier answers as a recap on the details step', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard source="test" />);

    await user.click(screen.getByText('Commercial Project'));
    await user.click(await screen.findByText('Planning ahead / Flexible'));
    await screen.findByLabelText(/Your Name/);

    // Titles now appear as recap chips rather than as selectable options.
    expect(screen.getByText('Commercial Project')).toBeInTheDocument();
    expect(screen.getByText('Planning ahead / Flexible')).toBeInTheDocument();
  });

  it('goes back to the previous step without losing the answer', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard source="test" />);

    await user.click(screen.getByText('New Installation'));
    await screen.findByText('How soon do you need it?');

    await user.click(screen.getByRole('button', { name: /^Back$/ }));
    expect(await screen.findByText('What do you need done?')).toBeInTheDocument();

    // Returning forward should still remember the service choice.
    await user.click(screen.getByText('New Installation'));
    await user.click(await screen.findByText('ASAP / Today if possible'));
    await screen.findByLabelText(/Your Name/);
    expect(screen.getByText('New Installation')).toBeInTheDocument();
  });

  it('submits service and urgency together with the contact details', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard source="hero-inline" />);

    await user.click(screen.getByText('Repair / Breakdown'));
    await user.click(await screen.findByText('ASAP / Today if possible'));

    await user.type(await screen.findByLabelText(/Your Name/), 'Dion Test');
    await user.type(screen.getByLabelText(/Phone Number/), '0434308070');
    await user.type(screen.getByLabelText(/Email Address/), 'dion@example.com');
    await user.type(screen.getByLabelText(/Site Address/), '1 Martin Place, Sydney');

    await user.click(screen.getByRole('button', { name: /Get My Free Quote/i }));

    await waitFor(() => expect(quotePayloads().length).toBe(1));
    const payload = quotePayloads()[0];

    expect(payload.serviceType).toBe('repair');
    expect(payload.urgency).toBe('asap');
    expect(payload.isUrgent).toBe(true);
    expect(payload.name).toBe('Dion Test');
    expect(payload.email).toBe('dion@example.com');
    expect(payload.address).toBe('1 Martin Place, Sydney');
    expect(payload.source).toBe('hero-inline');
    // Normalised in the browser, so GHL cannot split one person into two
    // contacts on formatting alone.
    expect(payload.phone).toBe('+61434308070');
    // The GHL workflow reads the contact's name from this key, not `name`.
    expect(payload.full_name).toBe('Dion Test');
  });

  it('falls back to the GHL webhook when the lead handler is unreachable', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation((url: unknown) =>
      String(url) === '/api/lead'
        ? Promise.reject(new Error('not deployed'))
        : jsonResponse({ status: 'Success' }),
    );

    render(<QuoteWizard source="test" />);
    await user.click(screen.getByText('Repair / Breakdown'));
    await user.click(await screen.findByText('ASAP / Today if possible'));
    await user.type(await screen.findByLabelText(/Your Name/), 'Dion Test');
    await user.type(screen.getByLabelText(/Phone Number/), '0434308070');
    await user.type(screen.getByLabelText(/Email Address/), 'dion@example.com');
    await user.type(screen.getByLabelText(/Site Address/), '1 Martin Place, Sydney');
    await user.click(screen.getByRole('button', { name: /Get My Free Quote/i }));

    // The lead still reaches GHL, by the route the site used before the
    // handler existed.
    await waitFor(() => expect(webhookPayloads().length).toBe(1));
    expect(webhookPayloads()[0].name).toBe('Dion Test');
  });

  it('blocks an invalid phone number before it can reach GHL', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard source="test" />);

    await user.click(screen.getByText('Repair / Breakdown'));
    await user.click(await screen.findByText('ASAP / Today if possible'));
    await user.type(await screen.findByLabelText(/Your Name/), 'Dion Test');
    await user.type(screen.getByLabelText(/Phone Number/), '12345');
    await user.type(screen.getByLabelText(/Email Address/), 'dion@example.com');
    await user.type(screen.getByLabelText(/Site Address/), '1 Martin Place, Sydney');
    await user.click(screen.getByRole('button', { name: /Get My Free Quote/i }));

    // GHL would happily accept this and create a contact nobody can call.
    expect(quotePayloads()).toHaveLength(0);
    // And the visitor is told, next to the field, not in a passing toast.
    expect(await screen.findByRole('alert')).toHaveTextContent('Please ensure you enter the correct number.');
    expect(screen.getByLabelText(/Phone Number/)).toHaveAttribute('aria-invalid', 'true');
  });

  it('asks for the number when the phone field is left empty', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard source="test" />);

    await user.click(screen.getByText('Repair / Breakdown'));
    await user.click(await screen.findByText('ASAP / Today if possible'));
    await user.type(await screen.findByLabelText(/Your Name/), 'Dion Test');
    await user.type(screen.getByLabelText(/Email Address/), 'dion@example.com');
    await user.type(screen.getByLabelText(/Site Address/), '1 Martin Place, Sydney');
    await user.click(screen.getByRole('button', { name: /Get My Free Quote/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Please ensure you enter the correct number.');
    expect(quotePayloads()).toHaveLength(0);

    // Fixing it clears the message straight away.
    await user.type(screen.getByLabelText(/Phone Number/), '0434308070');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows a thank-you confirmation and temporary lock after successful submission', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard source="test" />);

    await user.click(screen.getByText('Maintenance / Service'));
    await user.click(await screen.findByText('Within the next few days'));
    await user.type(await screen.findByLabelText(/Your Name/), 'Dion Test');
    await user.type(screen.getByLabelText(/Phone Number/), '0434308070');
    await user.type(screen.getByLabelText(/Email Address/), 'dion@example.com');
    await user.type(screen.getByLabelText(/Site Address/), '1 Martin Place, Sydney');
    await user.click(screen.getByRole('button', { name: /Get My Free Quote/i }));

    expect(await screen.findByText('THANK YOU')).toBeInTheDocument();
    expect(screen.getByText(/We'll respond to the enquiry ASAP./i)).toBeInTheDocument();
    expect(screen.getByText(/You can submit another enquiry in/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Get My Free Quote/i })).toBeNull();
  });

  it('hands the thank-you page a summary without the phone number or email', async () => {
    const user = userEvent.setup();
    render(<QuoteWizard source="test" />);

    await user.click(screen.getByText('Repair / Breakdown'));
    await user.click(await screen.findByText('ASAP / Today if possible'));
    await user.type(await screen.findByLabelText(/Your Name/), 'Jeff Nguyen');
    await user.type(screen.getByLabelText(/Phone Number/), '0451995112');
    await user.type(screen.getByLabelText(/Email Address/), 'jeff@example.com');
    await user.type(screen.getByLabelText(/Site Address/), '40 Leith Street, Croydon Park');
    await user.click(screen.getByRole('button', { name: /Get My Free Quote/i }));

    await waitFor(() => expect(window.sessionStorage.getItem('jed-last-quote')).not.toBeNull());
    const raw = window.sessionStorage.getItem('jed-last-quote')!;
    expect(JSON.parse(raw)).toMatchObject({
      firstName: 'Jeff',
      service: 'Repair / Breakdown',
      urgency: 'asap',
      urgencyLabel: 'ASAP / Today if possible',
    });
    expect(raw).not.toContain('0451995112');
    expect(raw).not.toContain('jeff@example.com');
  });

  it('stays put and keeps the data when GHL rejects the lead', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation(() => jsonResponse({ error: 'nope' }, 500));

    render(<QuoteWizard source="test" />);
    await user.click(screen.getByText('Repair / Breakdown'));
    await user.click(await screen.findByText('ASAP / Today if possible'));
    await user.type(await screen.findByLabelText(/Your Name/), 'Dion Test');
    await user.type(screen.getByLabelText(/Phone Number/), '0434308070');
    await user.type(screen.getByLabelText(/Email Address/), 'dion@example.com');
    await user.type(screen.getByLabelText(/Site Address/), '1 Martin Place, Sydney');
    await user.click(screen.getByRole('button', { name: /Get My Free Quote/i }));

    // Both routes are tried — the handler first, then the webhook — and both
    // refuse it here. The details step must remain so the entered data is not
    // lost on failure.
    await waitFor(() => expect(webhookPayloads().length).toBe(1));
    expect(screen.getByLabelText(/Your Name/)).toHaveValue('Dion Test');
  });
});
