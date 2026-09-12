import { Moon, Sun } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

/**
 * Light / dark switch. The current theme is the `dark` class on <html>, set
 * before first paint by the inline script in Base.astro; this button flips it
 * and remembers the choice. Both icons are rendered and CSS picks one, so the
 * server-rendered button is already correct and never flickers after hydration.
 */
const STORAGE_KEY = 'jed-theme';

/**
 * `auto` follows the page tokens; `onDark` is for surfaces that are dark in
 * both themes (the silk header pill), where a foreground-tinted button would
 * disappear on the light theme.
 */
type Tone = 'auto' | 'onDark';
const TONE: Record<Tone, string> = {
  auto: 'border-foreground/15 bg-foreground/5 text-foreground hover:bg-foreground/10 active:bg-foreground/15',
  onDark: 'border-white/15 bg-white/10 text-white hover:bg-white/20 active:bg-white/25',
};

export function ThemeToggle({ className = '', tone = 'auto' }: { className?: string; tone?: Tone }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    root.classList.toggle('dark', next);
    root.style.colorScheme = next ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
    } catch {
      /* private mode etc. — the choice just won't persist */
    }
    trackEvent('theme_toggle', { theme: next ? 'dark' : 'light' });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${TONE[tone]} ${className}`}
    >
      <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
    </button>
  );
}

export default ThemeToggle;
