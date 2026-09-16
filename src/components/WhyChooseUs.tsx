import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Clock, Award, Sparkles, BadgeCheck } from 'lucide-react';
// Client-supplied render (936x1681, portrait).
import airconGlow from '@/assets/why-aircon.jpg?url';
// The mark builds itself into the corner instead of sitting there as a
// static watermark — the same clip and held-frame fallback as the hero's own
// lockup (src/components/HeroSection.tsx), so the two brand moments match.
import lockupStill from '@/assets/hero/lockup.png?url';
// Same marks as the marquee strip, reused here as a small static badge row —
// the empty space below the Residential/Commercial/All Brands chips needed
// something, and "every brand we install" is exactly what BrandsSection
// already proves further down the page.
import { BRANDS } from './BrandsSection';

const reasons = [
  {
    icon: Shield,
    title: 'Manufacturer‑Trained Service Agents',
    pill: 'Manufacturer-Trained',
    description: 'Daikin & Haier authorised service agents for faster diagnostics and repairs using genuine parts',
  },
  {
    icon: Award,
    title: 'Daikin Certified Dealer',
    pill: 'Daikin Certified',
    description: 'Authorised dealer with access to full Daikin product range and genuine parts',
  },
  {
    icon: Award,
    title: 'Haier Certified Dealer',
    pill: 'Haier Certified',
    description: 'Authorised Haier dealer with genuine parts and product support',
  },
  {
    icon: Shield,
    title: '10-Year Workmanship Warranty',
    pill: '10-Year Warranty',
    description: 'Complete peace of mind with our comprehensive labour warranty on all installations',
  },
  {
    icon: Clock,
    title: '25+ Years Experience Combined',
    pill: '25+ Yrs Experience',
    description: 'Over two decades of combined expertise serving Sydney homes and businesses with quality work',
  },
  {
    icon: BadgeCheck,
    title: 'Fully Licensed & Insured',
    pill: 'Licensed & Insured',
    description: 'Qualified technicians with all required licences and comprehensive insurance',
  },
  {
    icon: CheckCircle,
    title: 'Upfront Pricing',
    pill: 'Upfront Pricing',
    description: 'No surprises - detailed quotes before any work begins with no hidden fees',
  },
  {
    icon: Sparkles,
    title: 'Clean & Professional',
    pill: 'Clean & Professional',
    description: 'Respectful technicians who leave your property spotless every time',
  },
];

export function WhyChooseUs() {
  const stingRef = useRef<HTMLVideoElement>(null);
  const [logoPlaying, setLogoPlaying] = useState(false);

  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: copy. Centred on mobile, back to the original left
              alignment from lg — a left-aligned block reads unbalanced on a
              narrow phone screen where it is the full-width, top element
              rather than one half of a two-column row. */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="eyebrow">Why JED</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6">
              Sydney’s Trusted <span className="text-gradient">Daikin & Haier Installation Experts</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
              When choosing air conditioning installation in Sydney, brand expertise matters.
              As certified Daikin and Haier dealers and authorised service agents, we install systems to manufacturer standards — ensuring warranty protection, optimal performance and long-term reliability.
              Whether you're installing a new ducted system, upgrading an older split system, or fitting out an apartment or commercial property, our licensed technicians deliver compliant, energy-efficient installations tailored to your space.
            </p>
            {/* One line even on the narrowest phone: at the old px-4/gap-4/
                text-sm sizing the three pills totalled well over 400px, so
                "All Brands" wrapped to its own line. Mobile now runs smaller
                padding, gap and icons; sm: and up is the original sizing. */}
            <div className="flex flex-nowrap justify-center gap-1.5 sm:flex-wrap sm:justify-start sm:gap-4">
              <div className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-primary/10 px-2 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary sm:h-5 sm:w-5" />
                <span className="text-[11px] font-medium sm:text-sm">Residential</span>
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-primary/10 px-2 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary sm:h-5 sm:w-5" />
                <span className="text-[11px] font-medium sm:text-sm">Commercial</span>
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-primary/10 px-2 py-1.5 sm:gap-2 sm:px-4 sm:py-2">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary sm:h-5 sm:w-5" />
                <span className="text-[11px] font-medium sm:text-sm">All Brands</span>
              </div>
            </div>

            {/* Fills what was otherwise a large block of empty space under
                the three chips, and backs up "All Brands" above with the
                actual list of them. */}
            <div className="mt-7 sm:mt-9">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-primary sm:text-sm">
                Why JEDs?
              </span>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5">
                {BRANDS.map((brand) => (
                  <div
                    key={brand.name}
                    /* Fixed light chip, not a theme token: the marks are
                       brand-coloured ink (same files as BrandsSection),
                       so they need the same light background in both
                       themes rather than turning illegible on a dark one. */
                    className="flex h-10 items-center justify-center rounded-lg border border-black/10 bg-white px-2 shadow-sm sm:h-11"
                    title={brand.name}
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      loading="lazy"
                      decoding="async"
                      className="h-4 w-auto object-contain opacity-90 sm:h-[18px]"
                      style={{ transform: `scale(${brand.scale ?? 1})` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: the photo, now the section's second visual anchor rather
              than a small accent under the copy — full column width, a JED
              watermark so it reads as the company's own work rather than
              stock, and the eight reasons as a chip cloud on a bottom scrim
              instead of a grid of eight separate cards competing with it
              for space. */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onViewportEnter={() => {
              if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
              const v = stingRef.current;
              if (v) { v.muted = true; v.play().catch(() => {}); }
            }}
            className="relative overflow-hidden rounded-2xl border border-border shadow-[0_24px_54px_-24px_hsl(240_8%_10%/0.45)]"
          >
            <img
              src={airconGlow}
              alt="A JED technician's Daikin split system cooling a Sydney living room"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover sm:aspect-[3/4] lg:aspect-[4/5]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-4 pt-14 sm:p-5 sm:pt-20">
              {/* The mark builds itself in once the card scrolls into view,
                  centred directly above the pills so the air conditioner at
                  the top of the photo stays clear. Inside the scrim rather
                  than pinned by `bottom`, so it tracks the pill grid's height
                  at every breakpoint, and the scrim darkens the sunlit wall
                  behind it. See .why-logo-video for why nothing between it
                  and the photo may create a stacking context. */}
              <span className="why-logo-video" aria-hidden="true">
                <img src={lockupStill} alt="" className={logoPlaying ? 'opacity-0' : 'opacity-90'} decoding="async" />
                <video
                  ref={stingRef}
                  src="/hero-sting.mp4"
                  className={logoPlaying ? 'opacity-90' : 'opacity-0'}
                  onPlaying={() => setLogoPlaying(true)}
                  muted
                  playsInline
                  preload="auto"
                  tabIndex={-1}
                />
              </span>
              {/* A grid, not flex-wrap: content-driven widths made
                  "Manufacturer-Trained" and "Upfront Pricing" wildly
                  different sizes. Fixed columns give all eight the same
                  footprint, with the label wrapping inside its own cell
                  instead of forcing the pill wider. */}
              <ul className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {reasons.map((reason) => (
                  <li key={reason.title} className="why-pill" title={reason.description}>
                    <reason.icon className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                    {reason.pill}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
