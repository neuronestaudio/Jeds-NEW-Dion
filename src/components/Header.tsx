import { Phone, Mail, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jedLogo from '@/assets/jed-logo.jpeg';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Our Work', href: '#projects' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky-header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-18 md:h-24 overflow-visible">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 overflow-visible">
              <img 
                src={jedLogo} 
                alt="JED Airconditioning" 
                className="h-24 md:h-32 -my-4 md:-my-6 w-auto object-contain"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
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
                <a href="tel:0434308070" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>0434 308 070</span>
                </a>
              </Button>
              <Button variant="cta" size="sm" asChild>
                <a href="#quote">Get a Quote</a>
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
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Bottom CTA Bar */}
      <div className="mobile-cta-bar">
        <div className="flex gap-3">
          <Button variant="call" className="flex-1" asChild>
            <a href="tel:0434308070" className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </Button>
          <Button variant="cta" className="flex-1" asChild>
            <a href="#quote" className="flex items-center justify-center gap-2">
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
