import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import logoOnLight from '@/assets/brand/jed-logo-on-light.png?url';
import logoOnDark from '@/assets/brand/jed-logo-on-dark.png?url';

const footerLinks = {
  services: [
    { label: 'Split Systems', href: '/service/split-system-installation' },
    { label: 'Ducted AC', href: '/service/ducted-air-conditioning' },
    { label: 'Commercial', href: '/services' },
    { label: 'Repairs', href: '/service/aircon-repair' },
    { label: 'Maintenance', href: '/services' },
  ],
  company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Our Work', href: '/#projects' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQs', href: '/services#faqs' },
  ],
  areas: [
    { label: 'All Service Areas', href: '/service-areas' },
    { label: 'North Shore', href: '/service-areas#north-shore' },
    { label: 'Eastern Suburbs', href: '/service-areas#eastern-suburbs' },
    { label: 'Bondi', href: '/service-area/bondi' },
    { label: 'Chatswood', href: '/service-area/chatswood' },
    { label: 'Mosman', href: '/service-area/mosman' },
    { label: 'Randwick', href: '/service-area/randwick' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-12 sm:pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img src={logoOnDark} alt="JED Air Conditioning" className="hidden h-10 w-auto opacity-90 dark:block sm:h-12 mb-4" />
            <img src={logoOnLight} alt="JED Air Conditioning" className="h-10 w-auto opacity-90 dark:hidden sm:h-12 mb-4" />
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-sm">
              Sydney's trusted air conditioning specialists. <strong>Daikin & Haier certified dealer</strong> and
              <strong> manufacturer‑trained service agents</strong> providing professional installation, servicing, and repairs
              for residential and commercial properties.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/jed.airconditioning/" 
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/jed_airconditioning/" 
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/jed-air-conditioning/" 
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-block py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:py-0"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-block py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:py-0"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-2">
              {footerLinks.areas.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-block py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:py-0"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact strip — the quote panel's deep-teal card (.q-teal / .q-row
            in index.css), so the footer speaks the same language as the panel. */}
        <div className="q-teal mb-8 p-4 sm:p-5">
          <ul className="grid gap-3 sm:grid-cols-3">
            <li>
              <a href="tel:0434308070" className="q-row">
                <span className="q-row-icon"><Phone className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-white/65">Call us</span>
                  <span className="block truncate text-[15px] font-semibold text-white">0434 308 070</span>
                </span>
              </a>
            </li>
            <li>
              <a href="mailto:JED_AIR@outlook.com" className="q-row">
                <span className="q-row-icon"><Mail className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-white/65">Email</span>
                  <span className="block truncate text-[15px] font-semibold text-white">JED_AIR@outlook.com</span>
                </span>
              </a>
            </li>
            <li>
              <a href="/service-areas" className="q-row">
                <span className="q-row-icon"><MapPin className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-white/65">Service area</span>
                  <span className="block truncate text-[15px] font-semibold text-white">Sydney-Wide Service</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JED Air Conditioning. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-muted-foreground">
            <span>✓ Fully Licensed</span>
            <span>✓ Fully Insured</span>
            <span>✓ Daikin Certified Dealer</span>
            <span>✓ Haier Certified Dealer</span>
            <span>✓ Manufacturer‑Trained Service Agents</span>
            <span>✓ 5-Year Workmanship Warranty</span>
            <span>✓ 10+ Years Experience</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
