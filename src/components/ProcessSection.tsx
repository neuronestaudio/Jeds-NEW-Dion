import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ClipboardCheck, FileText, Wrench, ThumbsUp, CalendarCheck } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    step: '01',
    title: 'On-Site Assessment & Sizing',
    description: 'We assess room size, insulation, layout and usage to determine the correct system capacity.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'System Recommendation',
    description: 'We recommend the right Daikin or Haier system based on performance, efficiency and budget.',
  },
  {
    icon: Wrench,
    step: '03',
    title: 'Professional Installation',
    description: 'Installed to Australian standards and manufacturer guidelines.',
  },
  {
    icon: ThumbsUp,
    step: '04',
    title: 'Testing & Commissioning',
    description: 'Full system testing, airflow balancing and operational walkthrough.',
  },
  {
    icon: CalendarCheck,
    step: '05',
    title: 'Warranty & Aftercare',
    description: 'Backed by manufacturer warranty and workmanship guarantee.',
  },
];

/** Gap between one step lighting and the next. */
const STEP_INTERVAL_MS = 700;
const START_DELAY_MS = 350;

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });

  /** Index of the furthest step lit so far; -1 before the run starts. */
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    // Walk the steps on a fixed cadence once the section is actually on screen,
    // so the sequence reads as the job progressing rather than firing off-screen
    // and being finished before anyone sees it.
    const timers = steps.map((_, i) =>
      setTimeout(() => setLit(i), START_DELAY_MS + i * STEP_INTERVAL_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  // The rail should stop at the centre of the furthest lit node, not at the far
  // edge of its column — otherwise it visibly overshoots the last icon.
  const railProgress = lit < 0 ? 0 : ((lit + 0.5) / steps.length) * 100;

  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Installation Process
          </h2>
        </motion.div>

        <div className="relative" ref={sectionRef}>
          {/* Unlit rail */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-0.5 -translate-y-1/2 bg-border/40 lg:block sm:top-8" />

          {/* Lit rail, advancing to each node in turn */}
          <motion.div
            className="pointer-events-none absolute left-0 top-7 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-primary/60 via-primary to-primary shadow-[0_0_12px_hsl(var(--primary)/0.7)] lg:block sm:top-8"
            initial={{ width: '0%' }}
            animate={{ width: `${railProgress}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {steps.map((step, index) => {
              const isLit = index <= lit;
              const isCurrent = index === lit;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative text-center"
                >
                  <div
                    className={`relative mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-500 sm:h-16 sm:w-16 ${
                      isLit
                        ? 'border-primary bg-primary/10 shadow-[0_0_28px_hsl(var(--primary)/0.45)]'
                        : 'border-border/50 bg-card'
                    }`}
                  >
                    {/* One-shot halo on the step that just lit, so the eye is
                        pulled along the rail instead of having to hunt. */}
                    {isCurrent && (
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full ring-2 ring-primary/60"
                        initial={{ opacity: 0.9, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.55 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                      />
                    )}

                    <step.icon
                      className={`h-6 w-6 transition-colors duration-500 sm:h-7 sm:w-7 ${
                        isLit ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />

                    <span
                      className={`absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
                        isLit
                          ? 'scale-100 bg-primary text-primary-foreground'
                          : 'scale-90 bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3
                    className={`mb-2 text-sm font-semibold transition-colors duration-500 sm:text-base ${
                      isLit ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
