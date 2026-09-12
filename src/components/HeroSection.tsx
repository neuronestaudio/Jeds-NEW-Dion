import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import QuoteFormInline from '@/components/QuoteFormInline';
// Transparent, trimmed marks — the supplied PNGs ship on a near-black plate
// with different built-in padding, which renders as dark boxes at mismatched
// sizes. Regenerate with: node scripts/clean-brand-logos.mjs
import daikinLogo from '@/assets/daikin-clean.png?url';
import haierLogo from '@/assets/haier-clean.png?url';
import { trackEvent } from '@/lib/analytics';
import lightRoom from '@/assets/hero/light-room.jpg?url';


/** Below this the hero stacks, so the clip plays as a band instead of a backdrop. */
const COMPACT_QUERY = '(max-width: 1023px)';

export function HeroSection() {
  // Prefer local bundled assets; fall back to remote SVGs if they fail to load
  const DAIKIN_LOGO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Daikin-Logo.svg';
  const HAIER_LOGO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Haier_logo.svg';
  const [videoError, setVideoError] = useState(false);
  const [play, setPlay] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [allowVideo, setAllowVideo] = useState(true);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const layout = window.matchMedia(COMPACT_QUERY);
    setAllowVideo(!media.matches);
    setCompact(layout.matches);
    const handler = () => setAllowVideo(!media.matches);
    const layoutHandler = () => setCompact(layout.matches);
    media.addEventListener('change', handler);
    layout.addEventListener('change', layoutHandler);
    const timer = setTimeout(() => setPlay(true), 500);
    return () => {
      clearTimeout(timer);
      media.removeEventListener('change', handler);
      layout.removeEventListener('change', layoutHandler);
    };
  }, []);

  // Phones and tablets never see the full frame as a backdrop, so they get the
  // lighter encode. Keying on the URL remounts the element when the breakpoint
  // is crossed, which a bare `src` swap would not do.
  const heroVideo =
    import.meta.env.VITE_HERO_VIDEO_URL || (compact ? '/hero-reel-mobile.mp4' : '/hero-reel.mp4');

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />

      {/*
        Backdrop: a JED job reel at 50% over the page colour, in both themes,
        so the hero moves without the copy having to fight it. The room photo
        sits underneath as the poster and fades out once the clip is playing;
        it is the whole backdrop when motion is reduced or the clip fails.
        Phones get a portrait crop of the same clip.
      */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={lightRoom}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover object-[68%_40%] transition-opacity duration-1000 ${videoVisible ? 'opacity-0' : 'opacity-50'}`}
          decoding="async"
          fetchPriority="high"
        />
        {!videoError && allowVideo && play && (
          <video
            key={heroVideo}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoVisible ? 'opacity-50' : 'opacity-0'}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoVisible(true)}
            onCanPlay={() => setVideoVisible(true)}
            onPlay={() => setVideoVisible(true)}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-10 sm:pb-12">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 items-start">
          {/* Left: Hero copy. Centred while it is a single stacked column,
              left-aligned again from lg where it sits beside the form. */}
          <div className="max-w-2xl mx-auto text-center lg:mx-0 lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-4 sm:gap-5 px-5 sm:px-6 py-2.5 bg-foreground/[0.05] border border-foreground/10 rounded-full shadow-[0_6px_24px_hsl(var(--foreground)/0.12)] backdrop-blur-md mb-5 sm:mb-6"
            aria-label="Daikin and Haier certified dealer"
          >
            {/* Both marks sit on one shared height. Their trimmed artwork is
                flush to its own ink, so a single height renders them at the
                same optical weight and the differing widths are just the
                wordmarks' natural proportions. */}
            <img
              src={daikinLogo}
              alt="Daikin"
              className="h-[18px] sm:h-[22px] w-auto object-contain"
              loading="lazy"
              decoding="async"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = DAIKIN_LOGO_FALLBACK; }}
            />

            <span aria-hidden className="h-5 sm:h-6 w-px bg-foreground/20" />

            <img
              src={haierLogo}
              alt="Haier"
              className="h-[18px] sm:h-[22px] w-auto object-contain invert dark:invert-0"
              loading="lazy"
              decoding="async"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = HAIER_LOGO_FALLBACK; }}
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[6.8vw] sm:text-4xl md:text-5xl lg:text-[min(3.45vw,3.4rem)] font-bold mb-5 sm:mb-6 leading-[1.08]"
          >
            {/* Two lines, always: the size is derived from the column width so
                "Conditioning Servicing" never wraps onto a third line. */}
            <span className="block">Experts in <span className="text-gradient">Air</span></span>
            <span className="block whitespace-nowrap text-gradient">Conditioning Servicing</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-foreground/85 max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10"
          >
            Authorised Daikin & Haier ducted and split system air conditioning installation for residential, apartment and commercial projects in Sydney.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-2 lg:mb-12"
          >
            <Button variant="hero" size="xl" asChild>
              <a
                href="/contact#quote"
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
                onClick={() => trackEvent('cta_click', { location: 'hero', type: 'quote' })}
              >
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a
                href="tel:0434308070"
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
                onClick={() => trackEvent('cta_click', { location: 'hero', type: 'call' })}
              >
                <Phone className="w-5 h-5" />
                0434 308 070
              </a>
            </Button>
          </motion.div>

          {/* Certification logos moved into badge above */}

          {/* Quick service selector removed per request */}
          </div>

          {/* Right: Inline quote form */}
          <div>
            <QuoteFormInline />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <a 
          href="#services" 
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs uppercase tracking-wider">Explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}

export default HeroSection;
