import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Building,
  CalendarClock,
  CalendarRange,
  Check,
  ChevronRight,
  Send,
  Settings,
  Sparkles,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { pushDataLayerEvent, trackEvent } from '@/lib/analytics';
import AddressAutocomplete from './AddressAutocomplete';
import {
  GhlNotConfiguredError,
  MIN_HUMAN_FILL_MS,
  normaliseAuPhone,
  submitLeadToGhl,
  type StructuredAddress,
} from '@/lib/ghl';

/**
 * Three-step quote wizard.
 *
 * Service and urgency are answered as single taps before any typing is asked
 * for — the cheap questions first, contact details last, so a visitor is
 * already two steps invested before they hit a keyboard.
 *
 * `value` strings on SERVICES are unchanged from the old <select> so existing
 * GoHighLevel workflows and GA4 reports keep matching.
 */

const SERVICES = [
  {
    value: 'installation',
    icon: Wind,
    title: 'New Installation',
    description: 'Split, ducted or multi-head system',
  },
  {
    value: 'repair',
    icon: Wrench,
    title: 'Repair / Breakdown',
    description: 'Not cooling, leaking or making noise',
  },
  {
    value: 'maintenance',
    icon: Settings,
    title: 'Maintenance / Service',
    description: 'Clean, service or health check',
  },
  {
    value: 'commercial',
    icon: Building,
    title: 'Commercial Project',
    description: 'Office, retail, strata or industrial',
  },
  {
    value: 'other',
    icon: Sparkles,
    title: 'Something Else',
    description: 'Tell us what you need',
  },
] as const;

const URGENCIES = [
  {
    value: 'asap',
    icon: Zap,
    title: 'ASAP / Today if possible',
    description: "We'll prioritise your job",
    accent: true,
  },
  {
    value: 'few-days',
    icon: CalendarClock,
    title: 'Within the next few days',
    description: 'Soon, but not an emergency',
    accent: false,
  },
  {
    value: 'flexible',
    icon: CalendarRange,
    title: 'Planning ahead / Flexible',
    description: 'Happy to book a suitable time',
    accent: false,
  },
] as const;

const STEP_LABELS = ['Service', 'Timing', 'Details'];
const TOTAL_STEPS = 3;
const SUBMIT_LOCK_MS = 10_000;

type Props = {
  /** Distinguishes hero vs page form in GA4 and in the GHL payload. */
  source: string;
  /** Tighter type scale for the narrow hero card. */
  compact?: boolean;
  heading?: string;
  subheading?: string;
};

export function QuoteWizard({ source, compact = false, heading, subheading }: Props) {
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  /** +1 forward, -1 back — drives which way the panels slide. */
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockSecondsRemaining, setLockSecondsRemaining] = useState(0);
  const [addressDetails, setAddressDetails] = useState<StructuredAddress | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    serviceType: '',
    urgency: '',
    message: '',
    // Honeypot field
    website: '',
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Used to spot bots. Nothing human taps two cards and types four fields in seconds. */
  const mountedAt = useRef(Date.now());
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockTicker = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockStorageKey = `quote-submit-lock-until:${source}`;

  const inSuccessLock = lockSecondsRemaining > 0;

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
      if (lockTicker.current) clearInterval(lockTicker.current);
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.sessionStorage.getItem(lockStorageKey);
      const lockUntil = raw ? Number(raw) : 0;
      if (!lockUntil || Number.isNaN(lockUntil)) return;

      const remainingMs = Math.max(0, lockUntil - Date.now());
      if (!remainingMs) {
        window.sessionStorage.removeItem(lockStorageKey);
        return;
      }

      setLockSecondsRemaining(Math.ceil(remainingMs / 1000));
      if (lockTicker.current) clearInterval(lockTicker.current);
      lockTicker.current = setInterval(() => {
        setLockSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (lockTicker.current) {
              clearInterval(lockTicker.current);
              lockTicker.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // Ignore storage errors; lock still works in-memory.
    }
  }, [lockStorageKey]);

  // Pull focus into the first text field when the details step arrives, so
  // keyboard and screen-reader users are not dropped at the top of the page.
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => nameInputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [step]);

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  /**
   * Hold briefly on the tapped card before sliding on, so the selection is
   * visibly acknowledged rather than the panel vanishing under the finger.
   */
  const selectAndAdvance = (patch: Partial<typeof formData>, nextStep: number, label: string) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    trackEvent('quote_step_complete', { source, step: nextStep - 1, choice: label });
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => goTo(nextStep), 220);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== TOTAL_STEPS) return;
    if (inSuccessLock) return;
    if (formData.website) return; // honeypot tripped

    /**
     * Second bot signal, sent as data rather than enforced here.
     *
     * Deliberately NOT a hard block: silently discarding a submission because
     * someone filled the form quickly loses a real lead with no feedback to
     * them and no record for JED, which is a worse outcome for the business
     * than a spam lead they can filter. `likelyBot` lets a GHL workflow decide.
     * The honeypot above stays a hard block — a real user cannot trip it.
     */
    const formFillMs = Date.now() - mountedAt.current;

    // Validation that used to live in the serverless handler. GHL will happily
    // accept a malformed number and create a contact nobody can call, so this
    // has to be caught here now that nothing sits in front of the webhook.
    if (!normaliseAuPhone(formData.phone)) {
      toast({
        title: 'Check your phone number',
        description: 'Please enter a valid Australian mobile or landline.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const thankYouUrl = import.meta.env.VITE_THANK_YOU_URL || '/thank-you';

      // `submitLeadToGhl` returns the payload it actually sent, which replaces
      // the old `leadVerified` / `webhookForwarded` fields the serverless
      // handler used to echo back. GHL's webhook only answers
      // {"status":"Success…","id":"…"} — it reports nothing about the lead — so
      // the values below come from what we sent, not from its reply.
      const sent = await submitLeadToGhl({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        serviceType: formData.serviceType,
        urgency: formData.urgency,
        message: formData.message,
        addressDetails,
        source,
        formFillMs,
      });

      toast({
        title: 'Quote Request Sent!',
        description:
          formData.urgency === 'asap'
            ? "We'll be in touch as a priority."
            : "We'll get back to you within 24 hours.",
      });
      trackEvent('quote_submit', {
        source,
        service_type: formData.serviceType || 'unknown',
        urgency: formData.urgency || 'unknown',
        address_verified: Boolean(addressDetails),
        suburb: addressDetails?.suburb || 'unknown',
      });
      pushDataLayerEvent('generate_lead', {
        source,
        service_type: formData.serviceType || 'unknown',
        urgency: formData.urgency || 'unknown',
        address_verified: Boolean(sent.addressVerified),
        // Reaching this line means the POST resolved without throwing, so the
        // webhook did accept the lead.
        webhook_forwarded: true,
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        serviceType: '',
        urgency: '',
        message: '',
        website: '',
      });
      setAddressDetails(null);
      setDirection(-1);
      setStep(1);

      // Keep the confirmation visible for 10 seconds so users can see submit success.
      const lockUntil = Date.now() + SUBMIT_LOCK_MS;
      setLockSecondsRemaining(Math.ceil(SUBMIT_LOCK_MS / 1000));
      if (typeof window !== 'undefined') {
        try {
          window.sessionStorage.setItem(lockStorageKey, String(lockUntil));
        } catch {
          // Ignore storage errors; lock still works in-memory.
        }
      }
      if (lockTicker.current) clearInterval(lockTicker.current);
      lockTicker.current = setInterval(() => {
        setLockSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (lockTicker.current) {
              clearInterval(lockTicker.current);
              lockTicker.current = null;
            }
            if (typeof window !== 'undefined') {
              try {
                window.sessionStorage.removeItem(lockStorageKey);
              } catch {
                // Ignore storage errors.
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (unlockTimer.current) clearTimeout(unlockTimer.current);
      unlockTimer.current = setTimeout(() => {
        if (typeof window !== 'undefined' && import.meta.env.MODE !== 'test') {
          window.location.assign(thankYouUrl);
        }
      }, SUBMIT_LOCK_MS);
    } catch (err: unknown) {
      // A missing webhook URL is a deployment fault, not the visitor's problem —
      // never show them a config error, point them at the phone instead.
      const description =
        err instanceof GhlNotConfiguredError || !(err instanceof Error) || !err.message
          ? 'Please try again, or call us on 0434 308 070.'
          : err.message;
      if (err instanceof GhlNotConfiguredError) {
        console.error('[Quote] VITE_GHL_WEBHOOK_URL is not set — lead was not sent.');
      }
      toast({ title: 'Submission Error', description });
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = compact
    ? 'block text-[11px] sm:text-xs font-medium mb-2'
    : 'block text-sm font-medium mb-2';
  const inputClass = compact
    ? 'w-full px-4 py-3 text-sm sm:text-base bg-card border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors'
    : 'w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors';

  const slide = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
  };

  const selectedService = SERVICES.find((s) => s.value === formData.serviceType);
  const selectedUrgency = URGENCIES.find((u) => u.value === formData.urgency);

  return (
    <div>
      {heading && (
        <h2
          className={
            compact
              ? 'text-xl sm:text-2xl md:text-3xl font-bold mb-2'
              : 'text-3xl md:text-4xl font-bold mb-2'
          }
        >
          {heading}
        </h2>
      )}
      {subheading && (
        <p className={`text-muted-foreground mb-5 ${compact ? 'text-sm sm:text-base' : ''}`}>
          {subheading}
        </p>
      )}

      {/* Progress: completed steps are clickable so answers can be revised. */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <div key={label} className="flex flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => done && goTo(n)}
                  disabled={!done}
                  aria-label={done ? `Back to ${label}` : label}
                  aria-current={active ? 'step' : undefined}
                  className={`flex items-center gap-2 rounded-full transition-colors ${
                    done ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-300 ${
                      done
                        ? 'bg-primary text-primary-foreground'
                        : active
                          ? 'bg-primary/20 text-primary ring-2 ring-primary/40'
                          : 'bg-card text-muted-foreground ring-1 ring-border/50'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : n}
                  </span>
                  <span
                    className={`hidden text-xs font-medium sm:inline ${
                      active ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {n < TOTAL_STEPS && (
                  <span className="h-px flex-1 bg-border/50">
                    <motion.span
                      className="block h-px bg-primary"
                      initial={false}
                      animate={{ scaleX: done ? 1 : 0 }}
                      style={{ transformOrigin: 'left' }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {inSuccessLock ? (
        <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5 text-center sm:p-6" role="status" aria-live="polite">
          <p className="text-xl font-semibold text-primary">THANK YOU</p>
          <p className="mt-2 text-sm text-foreground/90 sm:text-base">We&apos;ll respond to the enquiry ASAP.</p>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            You can submit another enquiry in {lockSecondsRemaining}s.
          </p>
        </div>
      ) : (
      <form onSubmit={handleSubmit}>
        {/* Honeypot - hidden from users */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* min-height stops the card snapping between step heights */}
        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {step === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-2.5"
              >
                <p className={labelClass}>What do you need done?</p>
                {SERVICES.map((s) => {
                  const selected = formData.serviceType === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => selectAndAdvance({ serviceType: s.value }, 2, s.value)}
                      aria-pressed={selected}
                      className={`group flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border/30 bg-card/50 hover:border-primary/30 hover:bg-card/80'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                          selected ? 'bg-primary/20' : 'bg-primary/10 group-hover:bg-primary/20'
                        }`}
                      >
                        <s.icon className="h-5 w-5 text-primary" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold transition-colors group-hover:text-primary">
                          {s.title}
                        </span>
                        <span className="block text-xs text-muted-foreground">{s.description}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  );
                })}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-2.5"
              >
                <p className={labelClass}>How soon do you need it?</p>
                {URGENCIES.map((u) => {
                  const selected = formData.urgency === u.value;
                  return (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => selectAndAdvance({ urgency: u.value }, 3, u.value)}
                      aria-pressed={selected}
                      className={`group flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border/30 bg-card/50 hover:border-primary/30 hover:bg-card/80'
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                          selected ? 'bg-primary/20' : 'bg-primary/10 group-hover:bg-primary/20'
                        }`}
                      >
                        <u.icon className="h-5 w-5 text-primary" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold transition-colors group-hover:text-primary">
                          {u.title}
                        </span>
                        <span className="block text-xs text-muted-foreground">{u.description}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Recap so the earlier answers stay visible while typing. */}
                {(selectedService || selectedUrgency) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedService && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        <selectedService.icon className="h-3.5 w-3.5" />
                        {selectedService.title}
                      </span>
                    )}
                    {selectedUrgency && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        <selectedUrgency.icon className="h-3.5 w-3.5" />
                        {selectedUrgency.title}
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${source}-name`} className={labelClass}>
                      Your Name *
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      id={`${source}-name`}
                      required
                      maxLength={100}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${source}-phone`} className={labelClass}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id={`${source}-phone`}
                      required
                      maxLength={20}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClass}
                      placeholder="0400 000 000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`${source}-email`} className={labelClass}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id={`${source}-email`}
                    required
                    maxLength={255}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>

                <AddressAutocomplete
                  id={`${source}-address`}
                  label="Site Address *"
                  required
                  value={formData.address}
                  onChange={(address) => setFormData((prev) => ({ ...prev, address }))}
                  onSelect={setAddressDetails}
                  confirmedAddress={addressDetails}
                  labelClassName={labelClass}
                  inputClassName={inputClass}
                />

                <div>
                  <label htmlFor={`${source}-message`} className={labelClass}>
                    Tell Us More (Optional)
                  </label>
                  <textarea
                    id={`${source}-message`}
                    rows={3}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`${inputClass} resize-none`}
                    placeholder="Brief description of your needs..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Get My Free Quote
                    </span>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => goTo(2)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
      )}
    </div>
  );
}

export default QuoteWizard;
