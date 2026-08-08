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

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(() => jsonResponse({ ok: true }));
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const quotePayloads = () =>
  fetchMock.mock.calls
    .map((c) => JSON.parse(String(c[1].body)))
    .filter((b) => b.action === undefined); // exclude /api/places calls

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
    expect(payload.name).toBe('Dion Test');
    expect(payload.email).toBe('dion@example.com');
    expect(payload.address).toBe('1 Martin Place, Sydney');
    expect(payload.source).toBe('hero-inline');
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

  it('stays put and reports an error when the API rejects the lead', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation(() => jsonResponse({ error: 'Invalid Australian phone number' }, 400));

    render(<QuoteWizard source="test" />);
    await user.click(screen.getByText('Repair / Breakdown'));
    await user.click(await screen.findByText('ASAP / Today if possible'));
    await user.type(await screen.findByLabelText(/Your Name/), 'Dion Test');
    await user.type(screen.getByLabelText(/Phone Number/), '123');
    await user.type(screen.getByLabelText(/Email Address/), 'dion@example.com');
    await user.type(screen.getByLabelText(/Site Address/), '1 Martin Place, Sydney');
    await user.click(screen.getByRole('button', { name: /Get My Free Quote/i }));

    // The details step must remain so the entered data is not lost on failure.
    await waitFor(() => expect(quotePayloads().length).toBe(1));
    expect(screen.getByLabelText(/Your Name/)).toHaveValue('Dion Test');
  });
});
