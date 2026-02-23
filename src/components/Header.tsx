import { Phone, Mail, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jedLogo from '@/assets/Jedlogo.jpg';
import { trackEvent } from '@/lib/analytics';

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/#about' },
  { label: 'Our Work', href: '/#projects' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const hoverCloseTimer = useRef<number | null>(null);

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
      <header className="sticky-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-24">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <img 
                src={jedLogo} 
                alt="JED Air Conditioning" 
                className="h-10 sm:h-12 md:h-14 lg:h-18 w-auto mix-blend-lighten opacity-95"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* Services dropdown */}
              <div
                className="relative"
                onMouseEnter={openServices}
                onMouseLeave={closeServices}
                onFocusCapture={openServices}
                onBlurCapture={closeServices}
              >
                <div className="flex items-center gap-1">
                  <a
                    href="/services"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Services
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Toggle services menu"
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    onClick={() => setServicesOpen((v) => !v)}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <div
                  className={`absolute left-0 mt-2 ${servicesOpen ? 'block' : 'hidden'} bg-card border border-border/40 rounded-md shadow-md min-w-[260px] p-3 z-40`}
                  role="menu"
                >
                  <div className="flex flex-col">
                    <a href="/services" className="px-3 py-2 rounded hover:bg-muted text-sm font-medium">All Services</a>
                    <a href="/service/split-system-installation" className="px-3 py-2 rounded hover:bg-muted text-sm">Split System Installation</a>
                    <a href="/service/ducted-air-conditioning" className="px-3 py-2 rounded hover:bg-muted text-sm">Ducted Air Conditioning</a>
                    <a href="/service/aircon-repair" className="px-3 py-2 rounded hover:bg-muted text-sm">Repairs & Diagnostics</a>
                  </div>
                </div>
              </div>
              {/* Other links */}
              {navLinks.filter(l => l.label !== 'Services').map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="call" size="sm" asChild>
                <a
                  href="tel:0434308070"
                  className="flex items-center gap-2"
                  onClick={() => trackEvent('cta_click', { location: 'header', type: 'call' })}
                >
                  <Phone className="w-4 h-4" />
                  <span>0434 308 070</span>
                </a>
              </Button>
              <Button variant="cta" size="sm" asChild>
                <a href="/contact#quote" onClick={() => trackEvent('cta_click', { location: 'header', type: 'quote' })}>
                  Get a Quote
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card border-t border-border"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 pt-2 border-t border-border/30">
                  <p className="px-4 pb-1 text-xs uppercase tracking-wider text-muted-foreground">Services</p>
                  <a href="/service/split-system-installation" className="py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Split System Installation</a>
                  <a href="/service/ducted-air-conditioning" className="py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Ducted Air Conditioning</a>
                  <a href="/service/aircon-repair" className="py-3 px-4 text-foreground hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(false)}>Repairs & Diagnostics</a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom CTA Bar */}
      <div className="mobile-cta-bar">
        <div className="flex gap-3">
          <Button variant="call" className="flex-1" asChild>
            <a
              href="tel:0434308070"
              className="flex items-center justify-center gap-2"
              onClick={() => trackEvent('cta_click', { location: 'mobile-bar', type: 'call' })}
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </Button>
          <Button variant="cta" className="flex-1" asChild>
            <a
              href="/contact#quote"
              className="flex items-center justify-center gap-2"
              onClick={() => trackEvent('cta_click', { location: 'mobile-bar', type: 'quote' })}
            >
              <Mail className="w-5 h-5" />
              Get Quote
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Header;
