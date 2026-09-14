import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { MapPin, Loader2, Check } from 'lucide-react';
import type { StructuredAddress } from '@/lib/ghl';

export type { StructuredAddress };

/**
 * Calls Google Places (New) directly from the browser. Places returns proper
 * CORS headers, so no server hop is needed.
 *
 * The key ships in the bundle and is therefore public — that is expected for a
 * browser key, and the protection is the restrictions set on the key itself,
 * NOT secrecy. It must be locked to HTTP referrers for this domain and
 * restricted to the Places API (New) only, or anyone can spend your quota.
 * See docs/lead-flow-setup.md.
 */

const AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
const DETAILS_URL = 'https://places.googleapis.com/v1/places';
const REGION_CODES = ['au'];
const LANGUAGE_CODE = 'en-AU';

type Suggestion = {
  placeId: string;
  primary: string;
  secondary: string;
  full: string;
};

type AddressComponent = { longText?: string; shortText?: string; types?: string[] };

const pick = (components: AddressComponent[], type: string, short = false): string => {
  const match = components.find((c) => Array.isArray(c.types) && c.types.includes(type));
  if (!match) return '';
  return (short ? match.shortText : match.longText) || '';
};

/**
 * Collapse Google's component list into the shape GHL expects. AU addresses put
 * the unit in `subpremise`, so "12/88 Wentworth Park Rd" has to be reassembled
 * by hand — Google never returns that as one line.
 */
const toStructuredAddress = (place: {
  id?: string;
  formattedAddress?: string;
  addressComponents?: AddressComponent[];
  location?: { latitude?: number; longitude?: number };
}): StructuredAddress => {
  const components = Array.isArray(place?.addressComponents) ? place.addressComponents : [];
  const unit = pick(components, 'subpremise');
  const streetNumber = pick(components, 'street_number');
  const street = pick(components, 'route');
  const streetPart = [streetNumber, street].filter(Boolean).join(' ');

  return {
    placeId: place?.id || '',
    formatted: place?.formattedAddress || '',
    unit,
    streetNumber,
    street,
    addressLine1: unit && streetPart ? `${unit}/${streetPart}` : streetPart,
    suburb: pick(components, 'locality') || pick(components, 'sublocality') || '',
    state: pick(components, 'administrative_area_level_1', true),
    postcode: pick(components, 'postal_code'),
    country: pick(components, 'country'),
    countryCode: pick(components, 'country', true),
    lat: place?.location?.latitude ?? null,
    lng: place?.location?.longitude ?? null,
  };
};

type Props = {
  id?: string;
  label: string;
  /** Raw text in the box. Owned by the parent so form resets work. */
  value: string;
  /** Fired on every keystroke. Structured data is cleared when the user edits. */
  onChange: (text: string) => void;
  /** Fired when a real Google address is chosen, or null when it's cleared. */
  onSelect: (address: StructuredAddress | null) => void;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
  /** Shown under the field once a real address is locked in. */
  confirmedAddress?: StructuredAddress | null;
};

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 3;

const newSessionToken = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const placesKey = (): string | undefined =>
  import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;

export function AddressAutocomplete({
  id,
  label,
  value,
  onChange,
  onSelect,
  required,
  placeholder = 'Start typing your address…',
  labelClassName = 'block text-sm font-medium mb-2',
  inputClassName = 'w-full px-4 py-3 bg-card text-card-foreground border border-border rounded-lg focus:outline-none focus:border-primary transition-colors',
  confirmedAddress,
}: Props) {
  const reactId = useId();
  const inputId = id || `address-${reactId}`;
  const listboxId = `${inputId}-listbox`;

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  /** Set when the proxy reports no API key — we stop trying and act as a plain input. */
  const [lookupDisabled, setLookupDisabled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<string>(newSessionToken());
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Suppresses the fetch that would otherwise fire from setting the input text on select. */
  const skipNextFetchRef = useRef(false);
  /** Guards against a slow early request overwriting a newer one. */
  const requestSeqRef = useRef(0);

  const closeList = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  // Dismiss the dropdown on any click outside the field.
  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) closeList();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [closeList]);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    },
    []
  );

  const fetchSuggestions = useCallback(
    async (query: string) => {
      const seq = ++requestSeqRef.current;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const key = placesKey();
      if (!key) {
        // No key configured. Degrade to a plain address box rather than leaving
        // a dead-looking field — a lead must never be blocked by this.
        setLookupDisabled(true);
        closeList();
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const resp = await fetch(AUTOCOMPLETE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key },
          body: JSON.stringify({
            input: query,
            includedRegionCodes: REGION_CODES,
            includedPrimaryTypes: ['address'],
            languageCode: LANGUAGE_CODE,
            // One session token across every keystroke plus the final details
            // call bills the whole lookup as a single session, not per letter.
            sessionToken: sessionTokenRef.current,
          }),
          signal: controller.signal,
        });

        if (resp.status === 400 || resp.status === 403) {
          // Invalid, unrestricted-for-this-origin, or unbilled key. Retrying
          // every keystroke would just burn quota, so stop asking.
          console.error('[Places] key rejected', resp.status, await resp.text());
          setLookupDisabled(true);
          closeList();
          return;
        }
        if (!resp.ok) {
          if (seq === requestSeqRef.current) {
            setSuggestions([]);
            closeList();
          }
          return;
        }

        const data = await resp.json();
        if (seq !== requestSeqRef.current) return; // a newer keystroke already won

        const next: Suggestion[] = (data?.suggestions || [])
          .map((s: { placePrediction?: unknown }) => s?.placePrediction)
          .filter(Boolean)
          .map((p: {
            placeId?: string;
            text?: { text?: string };
            structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
          }) => ({
            placeId: p.placeId || '',
            primary: p.structuredFormat?.mainText?.text || p.text?.text || '',
            secondary: p.structuredFormat?.secondaryText?.text || '',
            full: p.text?.text || '',
          }))
          .filter((s: Suggestion) => s.placeId && s.primary);

        setSuggestions(next);
        setActiveIndex(-1);
        setIsOpen(next.length > 0);
      } catch (err: unknown) {
        // An abort is the expected outcome of a newer keystroke, not a failure.
        const aborted = err instanceof DOMException && err.name === 'AbortError';
        if (!aborted && seq === requestSeqRef.current) {
          setSuggestions([]);
          closeList();
        }
      } finally {
        if (seq === requestSeqRef.current) setIsLoading(false);
      }
    },
    [closeList]
  );

  const handleChange = (text: string) => {
    onChange(text);
    // Any manual edit invalidates a previously confirmed Google address.
    if (confirmedAddress) onSelect(null);

    if (lookupDisabled) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false;
      return;
    }
    if (text.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      closeList();
      setIsLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(text.trim()), DEBOUNCE_MS);
  };

  const handleSelect = async (suggestion: Suggestion) => {
    skipNextFetchRef.current = true;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    onChange(suggestion.full || `${suggestion.primary} ${suggestion.secondary}`.trim());
    closeList();
    setSuggestions([]);
    setIsLoading(true);

    try {
      const key = placesKey();
      if (!key) return;

      const url = new URL(`${DETAILS_URL}/${encodeURIComponent(suggestion.placeId)}`);
      url.searchParams.set('languageCode', LANGUAGE_CODE);
      url.searchParams.set('sessionToken', sessionTokenRef.current);

      const resp = await fetch(url.toString(), {
        headers: {
          'X-Goog-Api-Key': key,
          // Narrow field mask keeps this on the cheapest Place Details SKU.
          'X-Goog-FieldMask': 'id,formattedAddress,addressComponents,location',
        },
      });
      if (resp.ok) {
        const place = await resp.json();
        const address = toStructuredAddress(place);
        onSelect(address);
        if (address.formatted) onChange(address.formatted);
      }
    } catch {
      // Details lookup failed — the typed text still submits, just unstructured.
    } finally {
      // The billing session ends with the details call; the next lookup is new.
      sessionTokenRef.current = newSessionToken();
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        break;
      case 'Enter':
        // Only intercept Enter when a suggestion is highlighted, so the form can
        // still be submitted by keyboard when the list is merely open.
        if (activeIndex >= 0) {
          e.preventDefault();
          handleSelect(suggestions[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeList();
        break;
      case 'Tab':
        closeList();
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={inputId} className={labelClassName}>
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          id={inputId}
          name="address"
          required={required}
          maxLength={250}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          className={`${inputClassName} pr-10`}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
        />

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-card-foreground/50 animate-spin" />
          ) : confirmedAddress ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <MapPin className="w-4 h-4 text-card-foreground/50" />
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-lg border border-border bg-card shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.placeId}
              id={`${listboxId}-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              // onMouseDown, not onClick: the input's blur would otherwise close
              // the list before the click lands.
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={`flex cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors ${
                i === activeIndex ? 'bg-primary/10' : 'hover:bg-primary/5'
              }`}
            >
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-card-foreground">{s.primary}</span>
                {s.secondary && (
                  <span className="block truncate text-xs text-card-foreground/65">{s.secondary}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {lookupDisabled && (
        <p className="mt-2 text-xs text-muted-foreground">
          Enter your full street address, suburb and postcode.
        </p>
      )}
    </div>
  );
}

export default AddressAutocomplete;
