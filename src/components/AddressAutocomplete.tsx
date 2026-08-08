import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { MapPin, Loader2, Check } from 'lucide-react';

export type StructuredAddress = {
  placeId: string;
  formatted: string;
  unit: string;
  streetNumber: string;
  street: string;
  addressLine1: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  countryCode: string;
  lat: number | null;
  lng: number | null;
};

type Suggestion = {
  placeId: string;
  primary: string;
  secondary: string;
  full: string;
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

const placesUrl = (): string => {
  const apiBase = import.meta.env.VITE_API_BASE || '';
  return apiBase ? `${apiBase}/api/places` : '/api/places';
};

export function AddressAutocomplete({
  id,
  label,
  value,
  onChange,
  onSelect,
  required,
  placeholder = 'Start typing your address…',
  labelClassName = 'block text-sm font-medium mb-2',
  inputClassName = 'w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors',
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

      setIsLoading(true);
      try {
        const resp = await fetch(placesUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'autocomplete',
            input: query,
            sessionToken: sessionTokenRef.current,
          }),
          signal: controller.signal,
        });

        if (resp.status === 503) {
          // No key configured server-side. Fall back to a plain address box.
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

        const next: Suggestion[] = Array.isArray(data?.suggestions) ? data.suggestions : [];
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
      const resp = await fetch(placesUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'details',
          placeId: suggestion.placeId,
          sessionToken: sessionTokenRef.current,
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data?.address) {
          onSelect(data.address as StructuredAddress);
          if (data.address.formatted) onChange(data.address.formatted);
        }
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
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : confirmedAddress ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <MapPin className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-lg border border-border/50 bg-card shadow-lg"
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
                <span className="block truncate text-sm font-medium">{s.primary}</span>
                {s.secondary && (
                  <span className="block truncate text-xs text-muted-foreground">{s.secondary}</span>
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
