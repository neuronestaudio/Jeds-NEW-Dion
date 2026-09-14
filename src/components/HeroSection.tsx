import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Phone, ShieldCheck, BadgeCheck, Award, Leaf } from 'lucide-react';
import { Button } from './ui/button';
// The held final frame of /hero-sting.mp4, keyed the same way. It is what
// shows before the clip starts and instead of it whenever the clip cannot
// play — autoplay refused, reduced motion, JS off — so the lockup is never
// missing. Regenerate both together: see the ffmpeg recipe in the repo notes.
import lockupStill from '@/assets/hero/lockup.png?url';
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
// Real technicians, real jobs — the same photos WorkMarquee captions "JED in
// Action". Crossfaded into a small card in the empty wall/shelf area of the
// room render, so the hero shows real people from the company immediately,
// not just a staged, peopleless interior.
import jedAction1 from '@/assets/JED action 1.jpeg?url';
import jedAction2 from '@/assets/Jed Action 2.jpeg?url';

/**
 * Hero, to the layered design: one room photo, the JED lockup building itself
 * where the headline used to be, the wording underneath it at supporting
 * size, and a frosted trust bar along the bottom edge. No form here — the
 * quote panel is the section directly below, and every CTA scrolls to it.
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
  { icon: Award, label: '10-Year Workmanship Warranty', sub: 'On all labour' },
  { icon: Leaf, label: 'Energy Efficient Solutions', sub: 'Comfort today. A cleaner tomorrow.' },
];

/**
 * Headline rotation under the lockup. Each phrase is split into its two lines
 * by hand (second line carries the gradient) so every one occupies the same
 * two line-boxes and the swap never shifts the layout. The first entry is the
 * one crawlers and no-JS visitors get: it is the only one rendered on the
 * server, and it is the SEO headline.
 */
const HEADLINES: ReadonlyArray<readonly [string, string]> = [
  ['Smarter Comfort', 'for Sydney Homes.'],
  ['Perfect Climate.', 'Every Season.'],
  ['Better Air. Better Comfort.', 'Better Living.'],
  ['Climate Control,', 'Engineered to Last.'],
];
const HEADLINE_MS = 4500;

const DAIKIN_LOGO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Daikin-Logo.svg';
const HAIER_LOGO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Haier_logo.svg';

type Props = { variant?: 'a' | 'b' };

export function HeroSection({ variant = 'a' }: Props) {
  const isB = variant === 'b';

  /**
   * The lockup clip is started here rather than by the `autoplay` attribute:
   * that way the reduced-motion check actually wins, and setting `muted` as a
   * property first satisfies autoplay policies the attribute alone does not.
   * Until it reports `playing` the still holds the space, so a refused
   * autoplay leaves the finished mark on screen instead of an empty box.
   */
  const stingRef = useRef<HTMLVideoElement>(null);
  const [lockupPlaying, setLockupPlaying] = useState(false);
  const [headline, setHeadline] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const v = stingRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {});
    }
    // Same gate as the clip: reduced motion means a still mark and a still
    // headline, not a slideshow.
    const id = window.setInterval(() => setHeadline((i) => (i + 1) % HEADLINES.length), HEADLINE_MS);
    return () => window.clearInterval(id);
  }, []);

  // opacity-70, not 100: "70% solid, 30% transparent" by request. See the note on
  // .hero-lockup in index.css for why it is on these and not the wrapper.
  const lockup = (
    <span className="hero-lockup" aria-hidden="true">
      <img src={lockupStill} alt="" className={lockupPlaying ? 'opacity-0' : 'opacity-70'} decoding="async" />
      <video
        ref={stingRef}
        src="/hero-sting.mp4"
        className={lockupPlaying ? 'opacity-70' : 'opacity-0'}
        onPlaying={() => setLockupPlaying(true)}
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
      />
    </span>
  );

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
          {/* A bare whisper of page colour in light, so the photo settles
              without washing out — an 85%-strength veil here (previous pass)
              made the panel read as blown-out white rather than "quiet".
              Dark theme wants more than a colour-matched whisper: a flat 30%
              black shadow, independent of the page background token. */}
          <div className="absolute inset-0 bg-background/15 dark:bg-black/30" />
        </div>
      ) : (
        /* A: full-bleed. The veil runs left→right so the copy sits on page
           colour and the room carries the right. */
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={loungeWide}
            alt=""
            className="h-full w-full object-cover object-[62%_40%]"
            decoding="async"
            fetchPriority="high"
          />
          {/* Light theme: enough page colour to settle the photo without
              dulling it — the photo should stay the dominant visual here at
              roughly 85% strength; an 85%-opacity veil (previous pass)
              inverted that and blew the room out to near-white, which read
              as "way too bright". Dark theme asks for something else: a
              flat 30% black shadow rather than a colour-matched whisper. */}
          <div className="absolute inset-0 bg-background/15 dark:bg-black/30" />
        </div>
      )}

      {/* Corner texture, variant A only ("the back background... some lines,
          some stripes, some radial circles... more premium"). Positioned
          clear of both the copy column and the hero-people card: the stripe
          sits top-right near the header, the rings bottom-left near the CTA
          row, both faint enough to read as texture, not decoration fighting
          the photo. Desktop only — see the CSS media query. */}
      {!isB && (
        <>
          <div className="hero-deco-stripe hero-deco-stripe--tr" aria-hidden="true" />
          <svg
            className="hero-deco-rings"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="96" />
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="64" />
            <circle cx="100" cy="100" r="48" />
            <circle cx="100" cy="100" r="32" />
          </svg>
        </>
      )}

      {/* Real technicians, crossfading, over the empty wall/shelf area to
          the right of the couch — desktop only ("on the web browser
          version"), and only for variant A, where that area is actually
          empty (B's portrait panel has no equivalent free space). No
          z-index: it is a sibling of the copy column, not an ancestor, so
          it cannot touch the lockup's blend regardless. */}
      {!isB && (
        <div className="hero-people hidden lg:block" aria-hidden="true">
          <img src={jedAction1} alt="" decoding="async" />
          <img src={jedAction2} alt="" decoding="async" />
          <span className="hero-people__tag">Real JED techs, real Sydney jobs</span>
        </div>
      )}

      {/* Copy. No z-index here on purpose: the lockup below blends with the
          room photo, and a z-index would make this column its own stacking
          context, trapping the blend and turning the mark's plate into a grey
          box. Both this and the backdrop are positioned, so DOM order already
          paints the copy on top. */}
      <div className="container relative mx-auto px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-44 lg:pt-32">
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
            Certified Sydney air conditioning specialists
          </motion.p>

          {/* The mark carries the top of the hero; deliberately NOT inside a
              motion element, whose animated opacity/transform would isolate
              the blend that removes its black plate. */}
          {lockup}

          {/* The wording sits under the lockup at supporting size — still
              Bebas Neue, the condensed caps face from the Next Lvl Protection
              heroes — and rotates through HEADLINES. Only the active phrase is
              in the DOM (the h1 stays a clean single headline for crawlers and
              screen readers); .hero-headline reserves the two lines so the
              swap never moves anything. `initial={false}` matters: without it
              framer server-renders the entering phrase at opacity 0, and a
              visitor whose JS never arrives gets an invisible headline.
              font-normal is load-bearing: the face has one weight, and the
              base h1 rule would otherwise ask the browser to fake a bold. */}
          <h1 className="hero-headline font-condensed mb-5 text-[1.9rem] font-normal uppercase leading-[0.95] tracking-[0.005em] sm:text-[2.4rem] lg:text-[2.9rem] xl:text-[3.3rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={headline}
                initial={{ opacity: 0, y: '0.3em' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '-0.25em' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                <span className="block">{HEADLINES[headline][0]}</span>
                <span className="block text-gradient">{HEADLINES[headline][1]}</span>
              </motion.span>
            </AnimatePresence>
          </h1>

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
                {/* Metal fill, light theme only — the button is a solid
                    light badge there, which is what the brushed-chrome text
                    effect assumes; dark theme's .hero-phone-metal override
                    neutralises it back to plain text. */}
                <span className="hero-phone-metal">0434 308 070</span>
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
