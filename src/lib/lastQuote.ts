/**
 * The summary QuoteWizard hands to /thank-you in sessionStorage, so the page
 * can greet the visitor and recap the request. Deliberately minimal: first
 * name, the chosen labels and the suburb — no phone number or email.
 */
export const LAST_QUOTE_KEY = 'jed-last-quote';

/** A summary older than this is ignored, so a later direct visit is generic. */
export const LAST_QUOTE_MAX_AGE_MS = 30 * 60 * 1000;

export type LastQuote = {
  firstName: string;
  service: string;
  urgency: string;
  urgencyLabel: string;
  suburb: string;
  at: number;
};
