import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { trackEvent } from '@/lib/analytics';
import splitImg from '@/assets/services/split.jpg?url';
import ductedImg from '@/assets/services/ducted.jpg?url';
import repairsImg from '@/assets/services/repairs.jpg?url';
import maintenanceImg from '@/assets/services/maintenance.jpg?url';
import emergencyImg from '@/assets/services/emergency.jpg?url';
import commercialImg from '@/assets/services/commercial.jpg?url';

/**
 * "Our Services" as a 3D coverflow: one card in focus, the rest fanned back
 * either side. Ported from the CDS Overspray services deck (vanilla JS) into a
 * React island — same geometry (translateX / rotateY / scale per offset), same
 * interaction set (arrows, dots, swipe, keyboard, auto-advance that pauses on
 * hover and off-screen). Every card is server-rendered with its transform
 * inline, so the deck is laid out before hydration; transitions are only
 * enabled once mounted (`data-ready`) so the first client measurement doesn't
 * animate from the SSR guess.
 */

type Service = {
  id: string;
  title: string;
  lead: string;
  desc: string;
  img: string;
  alt: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    id: 'split',
    title: 'Split System Installation',
    lead: 'Room-by-room comfort, done cleanly.',
    desc: 'Daikin & Haier wall splits sized to the space, with tidy pipe runs and a clean finish.',
    img: splitImg,
    alt: 'Wall-mounted split system installed in a bedroom',
    href: '/service/split-system-installation',
  },
  {
    id: 'ducted',
    title: 'Ducted Air Conditioning',
    lead: 'Whole-home climate, out of sight.',
    desc: 'Zoned ducted systems designed around your floor plan: quiet, concealed and even in every room.',
    img: ductedImg,
    alt: 'Ducted air conditioning outlet in a living room ceiling',
    href: '/service/ducted-air-conditioning',
  },
  {
    id: 'repairs',
    title: 'Repairs & Diagnostics',
    lead: 'Find the fault. Fix it properly.',
    desc: 'Fast, accurate diagnosis across all major brands, so you pay for the repair, not the guesswork.',
    img: repairsImg,
    alt: 'Daikin outdoor unit on a Sydney rooftop with the city skyline behind',
    href: '/service/aircon-repair',
  },
  {
    id: 'maintenance',
    title: 'Preventive Maintenance',
    lead: 'Keep it running like new.',
    desc: 'Regular servicing that protects efficiency, air quality and the life of your system.',
    img: maintenanceImg,
    alt: 'Outdoor unit on an apartment balcony overlooking the harbour',
    href: '/services',
  },
  {
    id: 'emergency',
    title: 'Emergency Services',
    lead: 'Breakdown? We move fast.',
    desc: 'Rapid response across Sydney when your system fails on the day you need it most.',
    img: emergencyImg,
    alt: 'JED technician working on a rooftop installation',
    href: '/services',
  },
  {
    id: 'commercial',
    title: 'Commercial Solutions',
    lead: 'Built for offices, retail and industrial.',
    desc: 'Scalable ducted and multi-split systems planned around your fit-out and trading hours.',
    img: commercialImg,
    alt: 'Commercial condensing units in a plant room',
    href: '/services',
  },
];

const AUTO_MS = 4400;
const SWIPE_PX = 44;
const pad = (v: number) => String(v).padStart(2, '0');
const spacingFor = (w: number) => (w < 620 ? w * 0.8 : Math.min(w * 0.27, 330));

export function ServicesCoverflow() {
  const n = SERVICES.length;
  const [active, setActive] = useState(0);
  const [vw, setVw] = useState(1280);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const dragX = useRef<number | null>(null);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);
  const step = useCallback((d: number) => setActive((a) => (((a + d) % n) + n) % n), [n]);

  // Measure once mounted, then enable transitions.
  useEffect(() => {
    const measure = () => setVw(window.innerWidth);
    measure();
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const raf = requestAnimationFrame(() => setReady(true));
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Only auto-advance / take keyboard input while the deck is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setVisible(es[0].isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || paused || reduced) return;
    const t = setTimeout(() => step(1), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, visible, paused, reduced, step]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, step]);

  useEffect(() => {
    const onUp = (e: PointerEvent) => {
      if (dragX.current === null) return;
      const dx = e.clientX - dragX.current;
      dragX.current = null;
      if (dx < -SWIPE_PX) step(1);
      else if (dx > SWIPE_PX) step(-1);
    };
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, [step]);

  const SP = spacingFor(vw);
  const mob = vw < 620;
  const half = Math.floor(n / 2);

  return (
    <section
      ref={rootRef}
      id="our-services"
      className="relative isolate overflow-hidden py-14 sm:py-20 md:py-28"
      data-ready={ready ? '' : undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      {/* Blurred echo of the active card behind the deck, crossfaded. */}
      <div className="sc-backdrop" aria-hidden="true">
        {SERVICES.map((s, i) => (
          <img key={s.id} src={s.img} alt="" loading="lazy" decoding="async" style={{ opacity: i === active ? 1 : 0 }} />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-8 text-center sm:mb-12">
          <span className="eyebrow">What we do</span>
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">Our Services</h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Complete air conditioning solutions for every need. Swipe the deck, or tap a card.
          </p>
        </div>
      </div>

      <div className="sc-flow">
        <button type="button" className="sc-arrow sc-prev" aria-label="Previous service" onClick={() => step(-1)}>
          <ChevronLeft />
        </button>

        <div
          className="sc-track"
          onPointerDown={(e) => {
            dragX.current = e.clientX;
          }}
        >
          {SERVICES.map((s, i) => {
            let off = (((i - active) % n) + n) % n;
            if (off > half) off -= n;
            const abs = Math.abs(off);
            const isActive = off === 0;
            const x = off * SP;
            const rot = mob ? 0 : -off * 22;
            const sc = isActive ? 1 : mob ? 0.86 : Math.max(0.66, 0.82 - (abs - 1) * 0.07);
            const op = abs > half ? 0 : isActive ? 1 : mob ? 0.24 : 0.55 - (abs - 1) * 0.12;
            return (
              <article
                key={s.id}
                className={`sc-card${isActive ? ' is-active' : ''}`}
                style={{
                  transform: `translate(-50%,-50%) translateX(${x}px) rotateY(${rot}deg) scale(${sc})`,
                  opacity: op,
                  zIndex: 100 - abs,
                }}
                aria-hidden={isActive ? undefined : true}
                onClick={(e) => {
                  if (!isActive && !(e.target as HTMLElement).closest('a')) go(i);
                }}
              >
                <img className="sc-img" src={s.img} alt={s.alt} loading="lazy" decoding="async" draggable={false} />
                <span className="sc-shade" aria-hidden="true" />
                <span className="sc-glare" aria-hidden="true" />
                <div className="sc-body">
                  <span className="sc-num">
                    {pad(i + 1)} / {pad(n)}
                  </span>
                  <h3 className="sc-title">{s.title}</h3>
                  <p className="sc-desc">
                    <b>{s.lead}</b> {s.desc}
                  </p>
                  <div className="sc-actions flex flex-wrap items-center gap-3">
                    <Button variant="hero" size="lg" asChild>
                      <a
                        href="#quote"
                        className="inline-flex items-center gap-2"
                        onClick={() => trackEvent('cta_click', { location: 'services_carousel', type: 'quote', service: s.id })}
                      >
                        Get a quote
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <a href={s.href} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                      Learn more
                    </a>
                  </div>
                </div>
                <i className="sc-corner tl" aria-hidden="true" />
                <i className="sc-corner tr" aria-hidden="true" />
                <i className="sc-corner bl" aria-hidden="true" />
                <i className="sc-corner br" aria-hidden="true" />
              </article>
            );
          })}
        </div>

        <button type="button" className="sc-arrow sc-next" aria-label="Next service" onClick={() => step(1)}>
          <ChevronRight />
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 sm:mt-9">
        <div className="text-sm font-medium tracking-[0.14em] text-muted-foreground tabular-nums">
          <b className="font-bold text-primary">{pad(active + 1)}</b> / {pad(n)}
        </div>
        <div className="flex gap-2" role="tablist" aria-label="Services">
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={s.title}
              className={`sc-dot${i === active ? ' on' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesCoverflow;
