import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import jedLogo from '@/assets/Jedlogo.jpg';

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
    { label: 'FAQs', href: '/#faqs' },
  ],
  areas: [
    { label: 'Newcastle', href: '#' },
    { label: 'Central Coast', href: '#' },
    { label: 'Sydney (All Regions)', href: '#' },
    { label: 'Blue Mountains', href: '#' },
    { label: 'Wollongong/Illawarra', href: '#' },
    { label: 'Canberra', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img 
              src={jedLogo} 
              alt="JED Airconditioning" 
              className="h-12 w-auto mb-4 mix-blend-lighten opacity-95"
              loading="lazy"
              decoding="async"
            />
            <p className="text-muted-foreground mb-6 max-w-sm">
              Sydney's trusted air conditioning specialists. <strong>Daikin & Haier certified dealer</strong> and
              <strong> manufacturer‑trained service agents</strong> providing professional installation, servicing, and repairs
              for residential and commercial properties.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
                aria-label="LinkedIn"
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
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
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
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
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
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="flex flex-wrap gap-6 py-6 border-y border-border/30 mb-8">
          <a 
            href="tel:0434308070" 
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            0434 308 070
          </a>
          <a 
            href="mailto:JED_AIR@outlook.com" 
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            JED_AIR@outlook.com
          </a>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            Sydney-Wide Service
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JED Airconditioning. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-border/30">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
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
