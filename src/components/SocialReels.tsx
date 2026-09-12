import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Instagram, Play } from 'lucide-react';

import ownVan from '@/assets/instagram/own-van.jpg?url';
import sydneyViews from '@/assets/instagram/sydney-views.jpg?url';
import dodgyInstall from '@/assets/instagram/dodgy-install.jpg?url';
import owningBusiness from '@/assets/instagram/owning-business.jpg?url';
import sixMistakes from '@/assets/instagram/six-mistakes.jpg?url';
import loveTrade from '@/assets/instagram/love-trade.jpg?url';
import allTrades from '@/assets/instagram/all-trades.jpg?url';
import stayStrong from '@/assets/instagram/stay-strong.jpg?url';
import commercialPart4 from '@/assets/instagram/commercial-part4.jpg?url';

/**
 * Instagram reels carousel.
 *
 * Cover frames are stored locally rather than hot-linked: Instagram's CDN URLs
 * are signed and expire, so an embedded URL would silently 404 within weeks.
 * Tapping a card opens the reel on Instagram — their embed will not play a reel
 * inline, it only offers a "Watch on Instagram" link, so sending the visitor
 * straight there is one click instead of two.
 *
 * Titles are the real opening lines of each caption, not rewritten.
 */

const HANDLE = 'jed_airconditioning';
const PROFILE_URL = `https://www.instagram.com/${HANDLE}/`;

type Reel = { code: string; poster: string; title: string };

const REELS: Reel[] = [
  { code: 'Dbu-P5dhTaF', poster: ownVan, title: 'Driving your own van hits different' },
  { code: 'DbnGWcmQiiz', poster: sydneyViews, title: 'Sydney never disappoints' },
  { code: 'Dbp5KUkx46Z', poster: dodgyInstall, title: "Don't let a dodgy install ruin a premium system" },
  { code: 'Dbc6MU8vvW5', poster: owningBusiness, title: 'The truth about owning your own business' },
  { code: 'DbXwsfouYFu', poster: sixMistakes, title: '6 mistakes Sydney homeowners make every summer' },
  { code: 'DbVQLcLBjFM', poster: loveTrade, title: 'Gotta love this trade' },
  { code: 'DbSoKighN2Q', poster: allTrades, title: 'All trades in one' },
  { code: 'DbAmS7LRPID', poster: stayStrong, title: 'Stay strong out there' },
  { code: 'Da44uHdvMTs', poster: commercialPart4, title: 'Part 4: Commercial AC installation' },
];

/** How hard neighbouring slides shrink away from centre. */
const TWEEN_FACTOR = 2.6;
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function SocialReels() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
    skipSnaps: false,
  });

  const [selected, setSelected] = useState(0);
  const slideNodes = useRef<HTMLElement[]>([]);

  /**
   * Scale and fade each slide by its distance from centre, recomputed on every
   * scroll frame so it tracks a drag continuously rather than snapping only
   * once the drag settles.
   */
  const applyTween = useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const snaps = api.scrollSnapList();

    snaps.forEach((snap, index) => {
      let diff = snap - scrollProgress;

      // In loop mode a slide can be visually near centre while numerically far
      // away, because it has been wrapped to the other end of the track.
      // loopPoints tells us where that happened so the tween stays continuous.
      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopPoint) => {
          const target = loopPoint.target();
          if (index === loopPoint.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diff = snap - (1 + scrollProgress);
            if (sign === 1) diff = snap + (1 - scrollProgress);
          }
        });
      }

      const distance = Math.abs(diff * TWEEN_FACTOR);
      const scale = clamp(1 - distance * 0.28, 0.76, 1);
      const opacity = clamp(1 - distance * 0.85, 0.28, 1);

      const node = slideNodes.current[index];
      if (node) {
        node.style.transform = `scale(${scale})`;
        node.style.opacity = `${opacity}`;
      }
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    slideNodes.current = emblaApi.slideNodes().map(
      (slide) => slide.querySelector('[data-reel-card]') as HTMLElement
    );

    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    const onScroll = () => applyTween(emblaApi);

    onSelect();
    applyTween(emblaApi);

    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('reInit', onScroll);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('reInit', onScroll);
    };
  }, [emblaApi, applyTween]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="social" className="relative overflow-hidden py-12 sm:py-16 md:py-24">
      {/* Ambient colour behind the strip. Without something saturated to refract,
          a backdrop-blur panel on a near-black page reads as flat grey, not glass. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-1/4 h-[420px] w-[420px] rounded-full bg-primary/25 blur-[130px]" />
        <div className="absolute right-[8%] top-1/3 h-[380px] w-[380px] rounded-full bg-secondary/25 blur-[130px]" />
        <div className="absolute left-1/2 bottom-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="container relative mx-auto mb-10 px-4 sm:mb-12 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-4 py-2 text-xs font-medium backdrop-blur-md transition-colors hover:border-primary/40 hover:bg-white/10"
          >
            <Instagram className="h-4 w-4 text-primary" />@{HANDLE}
          </a>

          {/* Two deliberate lines rather than whatever the column width decides,
              so the phrase breaks at the comma at every size. */}
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
            <span className="block">No Shortcuts,</span>
            <span className="block">From Start to Finish</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Real jobs, real installs, filmed on site across Sydney
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="overflow-hidden" ref={emblaRef}>
          {/* py-10 leaves room for the centre slide's scale-up and its shadow. */}
          <div className="flex touch-pan-y py-10">
            {REELS.map((reel, i) => (
              <div
                key={reel.code}
                className="min-w-0 shrink-0 grow-0 basis-[68%] px-2.5 sm:basis-[42%] sm:px-3 lg:basis-[24%]"
              >
                <a
                  data-reel-card
                  href={`https://www.instagram.com/p/${reel.code}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch on Instagram: ${reel.title}`}
                  className="group/reel relative block aspect-[9/16] overflow-hidden rounded-3xl shadow-2xl shadow-black/30 ring-1 ring-foreground/15 transition-[box-shadow,ring] duration-500 will-change-transform hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={{ transform: 'scale(0.76)', opacity: 0.28 }}
                >
                  <img
                    src={reel.poster}
                    alt={reel.title}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    width={640}
                    height={1138}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/reel:scale-105"
                  />

                  {/* Legibility ramp for the glass panels sitting on top. */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/40" />

                  {/* Glass sheen — a soft diagonal highlight across the pane. */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-60 mix-blend-overlay" />

                  <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
                    <Instagram className="h-3 w-3" />
                    Reel
                  </span>

                  <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-lg backdrop-blur-md transition-all duration-300 group-hover/reel:scale-110 group-hover/reel:border-white/50 group-hover/reel:bg-white/25">
                    <Play className="ml-0.5 h-6 w-6 fill-white text-white" />
                  </span>

                  <span className="pointer-events-none absolute inset-x-2.5 bottom-2.5 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl">
                    <span className="line-clamp-2 block text-xs font-semibold leading-snug text-white sm:text-sm">
                      {reel.title}
                    </span>
                    <span className="mt-1 block text-[10px] text-white/70">Watch on Instagram</span>
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="container mx-auto mt-2 flex items-center justify-center gap-4 px-4">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous reel"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-foreground/5 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {REELS.map((reel, i) => (
              <button
                key={reel.code}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to reel ${i + 1}`}
                aria-current={i === selected}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selected ? 'w-6 bg-primary' : 'w-1.5 bg-foreground/25 hover:bg-foreground/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next reel"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-foreground/5 backdrop-blur-md transition-all hover:border-primary/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default SocialReels;
