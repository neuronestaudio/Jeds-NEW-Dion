import { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { PROCESS_STEPS as steps } from '@/data/process';

/**
 * Node i sits at the centre of its column, i.e. ((i + 0.5) / 5) of the width —
 * so 10%, 30%, 50%, 70%, 90%. The rail is pinned to the first node at left:10%,
 * meaning its *width* runs 0% -> 80% to finish exactly on the last node rather
 * than overshooting to the container edge.
 */
const RAIL_WIDTH_START = 0;
const RAIL_WIDTH_END = 80;

type StepProps = {
  step: (typeof steps)[number];
  index: number;
  isLit: boolean;
  progress: MotionValue<number>;
  reduceMotion: boolean;
};

function ProcessStep({ step, index, isLit, progress, reduceMotion }: StepProps) {
  // Parallax: each column drifts at its own rate as the section passes through
  // the viewport, so the row has depth instead of moving as one rigid block.
  // Later steps travel further, which also nudges the eye left-to-right.
  const drift = 26 + index * 9;
  const y = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [drift, -drift * 0.45]);

  return (
    <motion.div style={{ y }} className="relative text-center">
      {/* z-10 + an opaque base: the rail runs behind the row, but a node tinted
          with bg-primary/10 is 90% see-through, so the line was visibly
          crossing every lit circle. The tint is a layer on top of solid card
          colour instead of replacing it. */}
      <div
        className={`relative z-10 mb-4 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border bg-card transition-all duration-500 sm:h-16 sm:w-16 ${
          isLit ? 'border-primary shadow-[0_0_28px_hsl(var(--primary)/0.45)]' : 'border-border/50'
        }`}
      >
        {isLit && <span aria-hidden className="absolute inset-0 rounded-full bg-primary/10" />}
        <step.icon
          className={`h-6 w-6 transition-colors duration-500 sm:h-7 sm:w-7 ${
            isLit ? 'text-primary' : 'text-muted-foreground'
          }`}
        />

      </div>

      {/* Outside the circle so the clipped interior does not cut it off, and
          above the rail for the same reason the circle is. */}
      <span
        className={`pointer-events-none absolute left-1/2 top-0 z-20 ml-3 flex h-6 w-6 -translate-y-2 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 sm:ml-4 ${
          isLit ? 'scale-100 bg-primary text-primary-foreground' : 'scale-90 bg-muted text-muted-foreground'
        }`}
      >
        {index + 1}
      </span>

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
}

export function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  /**
   * Progress is driven by scroll position rather than a timer, so the visitor
   * advances the install themselves — the rail tracks the scrollbar instead of
   * running off on its own the moment the section appears.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  // Smooths out trackpad jitter and momentum so the rail glides rather than
  // twitching frame to frame.
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const railWidth = useTransform(
    progress,
    [0, 1],
    [`${RAIL_WIDTH_START}%`, `${RAIL_WIDTH_END}%`]
  );
  const glowOpacity = useTransform(progress, [0, 0.06, 1], [0, 1, 1]);

  const [lit, setLit] = useState(-1);
  useMotionValueEvent(progress, 'change', (v) => {
    // Light step i once the rail has reached its node.
    const reached = v < 0.02 ? -1 : Math.min(steps.length - 1, Math.floor(v * steps.length));
    setLit((prev) => (prev === reached ? prev : reached));
  });

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
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Scroll to follow the job from first visit to handover
          </p>
        </motion.div>

        <div className="relative" ref={sectionRef}>
          {/* Unlit rail */}
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-7 z-0 hidden h-0.5 -translate-y-1/2 bg-border/40 lg:block sm:top-8" />

          {/* Lit rail, tracking scroll position */}
          <motion.div
            className="pointer-events-none absolute left-[10%] top-7 z-0 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-primary/60 via-primary to-primary shadow-[0_0_12px_hsl(var(--primary)/0.7)] lg:block sm:top-8"
            style={{ width: railWidth, opacity: glowOpacity }}
          />

          <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
            {steps.map((step, index) => (
              <ProcessStep
                key={step.step}
                step={step}
                index={index}
                isLit={index <= lit}
                progress={progress}
                reduceMotion={reduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
