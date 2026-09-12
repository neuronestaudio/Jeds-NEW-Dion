import { motion } from 'framer-motion';
import { ArrowRight, Phone, ShieldCheck, BadgeCheck, Award, Leaf } from 'lucide-react';
import { Button } from './ui/button';
// Transparent, trimmed marks — the supplied PNGs ship on a near-black plate
// with different built-in padding, which renders as dark boxes at mismatched
// sizes. Regenerate with: node scripts/clean-brand-logos.mjs
import daikinLogo from '@/assets/daikin-clean.png?url';
import haierLogo from '@/assets/haier-clean.png?url';
import { trackEvent } from '@/lib/analytics';
// Both rooms are the supplied renders (D:\CLIENTS\JED AIR\media), brand mark
// retouched off the unit — JED sells Daikin and Haier.
import loungeWide from '@/assets/hero/lounge.jpg?url';
import loungePortrait from '@/assets/hero/lounge-portrait.jpg?url';

/**
 * Hero, to the layered design: one room photo, the title stacked on three
 * lines at the left, and a frosted trust bar along the bottom edge. No form
 * here — the quote panel is the section directly below, and every CTA
 * scrolls to it.
 *
 * Two variants, same copy and bar:
 *   a — the wide lounge as a full-bleed backdrop (the homepage).
 *   b — the portrait render as a full-height panel on the right, copy on
 *       page colour at the left; behind the copy on small screens. Lives at
 *       /b for testing.
 *
 * Bar copy is limited to claims the site already makes elsewhere (footer
 * badges / trust bar). The reference design's "24/7" line is not used: JED's
 * published hours are Mon–Sat 7am–6pm.
 */
const TRUST = [
  { icon: ShieldCheck, label: 'Fully Licensed & Insured', sub: 'Your home in safe hands' },
  { icon: BadgeCheck, label: 'Daikin & Haier Certified', sub: 'Authorised dealer & installer' },
  { icon: Award, label: '5-Year Workmanship Warranty', sub: 'On all labour' },
  { icon: Leaf, label: 'Energy Efficient Solutions', sub: 'Comfort today. A cleaner tomorrow.' },
];

const DAIKIN_LOGO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Daikin-Logo.svg';
const HAIER_LOGO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Haier_logo.svg';

type Props = { variant?: 'a' | 'b' };

export function HeroSection({ variant = 'a' }: Props) {
  const isB = variant === 'b';
  return (
    <section
      data-hero={variant}
      className="relative flex min-h-[88svh] flex-col justify-center overflow-hidden lg:min-h-[92vh]"
    >
      {isB ? (
        /* B: the portrait as a right-hand panel from lg (its aspect is kept,
           not cropped to landscape); full-bleed behind the copy below lg. */
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={loungePortrait}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[50%_28%] dark:brightness-[0.82] lg:left-auto lg:w-[46%]"
            decoding="async"
            fetchPriority="high"
          />
          {/* seam: page colour fading onto the photo's left edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10 lg:from-background lg:via-background lg:to-transparent lg:[background-size:58%_100%] lg:bg-no-repeat" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden dark:lg:block dark:lg:from-background/60" />
        </div>
      ) : (
        /* A: full-bleed. The veil runs left→right so the copy sits on page
           colour and the room carries the right. */
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={loungeWide}
            alt=""
            className="h-full w-full object-cover object-[62%_40%] dark:brightness-[0.82]"
            decoding="async"
            fetchPriority="high"
          />
          {/* Light: no veil — the render is shown at full strength and the dark
              ink reads on the bright room. Dark: white copy on a bright photo
              needs a wash, kept as light as legibility allows. */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-background/85 via-background/45 to-transparent dark:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-background/75 via-transparent to-transparent dark:block" />
        </div>
      )}

      {/* Copy */}
      <div className="container relative z-10 mx-auto px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-44 lg:pt-32">
        <div className={isB ? 'max-w-xl lg:max-w-[50%]' : 'max-w-2xl'}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-4 rounded-full border border-foreground/10 bg-background/70 px-5 py-2.5 shadow-[0_6px_24px_hsl(var(--foreground)/0.12)] backdrop-blur-md sm:gap-5 sm:px-6"
            aria-label="Daikin and Haier certified dealer"
          >
            <img
              src={daikinLogo}
              alt="Daikin"
              className="h-[18px] w-auto object-contain sm:h-[22px]"
              loading="eager"
              decoding="async"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = DAIKIN_LOGO_FALLBACK; }}
            />
            <span aria-hidden className="h-5 w-px bg-foreground/20 sm:h-6" />
            <img
              src={haierLogo}
              alt="Haier"
              className="h-[18px] w-auto object-contain invert dark:invert-0 sm:h-[22px]"
              loading="eager"
              decoding="async"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = HAIER_LOGO_FALLBACK; }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-primary"
          >
            Sydney air conditioning specialists
          </motion.p>

          {/* Three lines, as designed. Weight sits below the site's usual bold
              so the size can be large without the block turning into a wall. */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.025em] sm:text-6xl lg:text-[4.6rem] xl:text-[5.2rem]"
          >
            <span className="block">Comfort,</span>
            <span className="block">Engineered for</span>
            <span className="block text-gradient">Modern Living</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 max-w-xl text-base text-foreground/85 sm:text-lg md:text-xl"
          >
            Authorised Daikin & Haier ducted and split system air conditioning installation,
            servicing and repairs for homes, apartments and commercial spaces across Sydney.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <Button variant="hero" size="xl" asChild>
              <a
                href="#quote"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
                onClick={() => trackEvent('cta_click', { location: `hero-${variant}`, type: 'quote' })}
              >
                Get a Free Quote
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a
                href="tel:0434308070"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
                onClick={() => trackEvent('cta_click', { location: `hero-${variant}`, type: 'call' })}
              >
                <Phone className="h-5 w-5" />
                0434 308 070
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Trust bar: pinned along the bottom of the photo from lg, in flow
          underneath the copy on smaller screens. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="relative z-10 pb-8 lg:absolute lg:inset-x-0 lg:bottom-8 lg:pb-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <ul className="hero-bar grid grid-cols-1 divide-y divide-foreground/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5">
                {/* The icon is the node — drawn at the full 44px with a light
                    stroke, rather than a small glyph floating inside a ring. */}
                <t.icon className="h-11 w-11 shrink-0 text-foreground [stroke-width:1.4]" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight sm:text-base">{t.label}</span>
                  <span className="mt-0.5 block text-xs text-foreground/70 sm:text-sm">{t.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
