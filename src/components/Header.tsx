import { Phone, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// `?url` — under Astro an image import is a metadata object, not a URL string.
// The pill is black silk in both themes, so only the on-dark mark is needed.
import logoOnDark from '@/assets/brand/jed-logo-on-dark.png?url';
import { ThemeToggle } from './ThemeToggle';
import { trackEvent } from '@/lib/analytics';

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/#about' },
  { label: 'Our Work', href: '/#projects' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { label: 'All Services', href: '/services' },
  { label: 'Split System Installation', href: '/service/split-system-installation' },
  { label: 'Ducted Air Conditioning', href: '/service/ducted-air-conditioning' },
  { label: 'Repairs & Diagnostics', href: '/service/aircon-repair' },
];

/** Round on-dark control: the phone-size call and menu buttons. */
const ROUND_CONTROL =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 active:bg-white/25';

/**
 * Floating pill header. One oval of black silk (see .pill-shell in index.css)
 * sits over the page in both themes and compacts once the page has scrolled.
 *
 * Below lg the row is a three-column grid — call button, logo, toggle + menu —
 * so the logo is dead centre whatever the side controls measure, scrolled or
 * not. From lg it is the usual logo / nav / CTAs row inside the same pill.
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverCloseTimer = useRef<number | null>(null);

  // Passive listener; state only flips at the threshold, so this is not a
  // re-render per scroll frame.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openServices = () => {
    if (hoverCloseTimer.current) {
      window.clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    setServicesOpen(true);
  };

  const closeServices = () => {
    if (hoverCloseTimer.current) {
      window.clearTimeout(hoverCloseTimer.current);
    }
    hoverCloseTimer.current = window.setTimeout(() => setServicesOpen(false), 120);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground"
      >
        Skip to content
      </a>

      <header className="pill-header" data-scrolled={scrolled ? '' : undefined}>
        <div className="pill-shell">
          <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-2 sm:px-3 lg:flex lg:justify-between lg:pl-7 lg:pr-3">
            {/* Mobile: quick-call, left slot */}
            <a
              href="tel:0434308070"
              aria-label="Call JED Air Conditioning on 0434 308 070"
              onClick={() => trackEvent('cta_click', { location: 'header-mobile', type: 'call' })}
              className={`${ROUND_CONTROL} justify-self-start lg:hidden`}
            >
              <Phone className="h-[18px] w-[18px]" />
            </a>

            {/* Logo. 90% opacity by request — the mark sits into the silk
                rather than on top of it. */}
            <a
              href="/"
              className="flex items-center justify-self-center lg:justify-self-start"
              aria-label="JED Air Conditioning — home"
            >
              <img
                src={logoOnDark}
                alt="JED Air Conditioning"
                className={`w-auto opacity-90 transition-[height] duration-300 ${
                  scrolled ? 'h-9 sm:h-10 lg:h-11' : 'h-10 sm:h-11 lg:h-[52px]'
                }`}
              />
            </a>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-8 lg:flex">
              <div
                className="relative"
                onMouseEnter={openServices}
                onMouseLeave={closeServices}
                onFocusCapture={openServices}
                onBlurCapture={closeServices}
              >
                <div className="flex items-center gap-1">
                  <a href="/services" className="pill-nav-link">
                    Services
                  </a>
                  <button
                    type="button"
                    className="pill-nav-link inline-flex items-center"
                    aria-label="Toggle services menu"
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    onClick={() => setServicesOpen((v) => !v)}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <div className={`pill-dropdown ${servicesOpen ? 'block' : 'hidden'}`} role="menu">
                  {serviceLinks.map((l) => (
                    <a key={l.href + l.label} href={l.href} role="menuitem">
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              {navLinks
                .filter((l) => l.label !== 'Services')
                .map((link) => (
                  <a key={link.label} href={link.href} className="pill-nav-link">
                    {link.label}
                  </a>
                ))}
            </nav>

            {/* Desktop CTAs. lg, not md — at md the row is still the
                three-column grid, and a fourth child would break it. */}
            <div className="hidden items-center gap-2.5 lg:flex">
              <ThemeToggle tone="onDark" />
              <Button variant="call" size="sm" className="rounded-full px-4" asChild>
                <a
                  href="tel:0434308070"
                  className="flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { location: 'header', type: 'call' })}
                >
                  <Phone className="h-4 w-4" />
                  <span>0434 308 070</span>
                </a>
              </Button>
              <Button variant="cta" size="sm" className="rounded-full px-5" asChild>
                <a href="/contact#quote" onClick={() => trackEvent('cta_click', { location: 'header', type: 'quote' })}>
                  Get a Quote
                </a>
              </Button>
            </div>

            {/* Mobile: theme + menu, right slot. Same footprint as the call
                button so the grid balances around the logo. */}
            <div className="flex items-center justify-self-end gap-2 lg:hidden">
              <ThemeToggle tone="onDark" />
              <button
                className={ROUND_CONTROL}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — its own rounded panel under the pill, same silk. */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="pill-menu lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-xl px-4 py-3 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 border-t border-white/10 pt-2">
                  <p className="px-4 pb-1 pt-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/50">
                    Services
                  </p>
                  {serviceLinks.slice(1).map((l) => (
                    <a
                      key={l.href + l.label}
                      href={l.href}
                      className="block rounded-xl px-4 py-3 text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom CTA Bar */}
      <div className="mobile-cta-bar">
        <div className="flex gap-3">
          <Button variant="call" className="flex-1 rounded-full" asChild>
            <a
              href="tel:0434308070"
              className="flex items-center justify-center gap-2"
              onClick={() => trackEvent('cta_click', { location: 'mobile-bar', type: 'call' })}
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          </Button>
          <Button variant="cta" className="flex-1 rounded-full" asChild>
            <a
              href="/contact#quote"
              className="flex items-center justify-center gap-2"
              onClick={() => trackEvent('cta_click', { location: 'mobile-bar', type: 'quote' })}
            >
              <Mail className="h-5 w-5" />
              Get Quote
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Header;
