import type { CSSProperties, ReactNode } from 'react';

/**
 * A light beam that travels around a card's outline.
 *
 * Implemented as an oversized conic gradient rotating behind the card, with the
 * card painted on top — everything but the rim is covered, so what stays
 * visible reads as a beam tracking the border. Deliberately not `offset-path`,
 * which is still patchy in Safari, and not an `@property` angle animation,
 * which silently does nothing where unsupported. A plain `transform: rotate`
 * works everywhere.
 *
 * Two stacked copies of the gradient do the work: a blurred one for the glow
 * that spills onto the surrounding background, and a sharp one for the bright
 * core. A single sharp 1px line is invisible against this dark palette.
 *
 * A static rim sits underneath, so if animation is suppressed the card still
 * looks finished rather than naked.
 */

const BEAM_GRADIENT =
  'conic-gradient(from 0deg,' +
  ' transparent 0deg,' +
  ' transparent 265deg,' +
  ' hsl(var(--primary) / 0.35) 300deg,' +
  ' hsl(var(--primary) / 0.85) 336deg,' +
  ' hsl(197 75% 94%) 353deg,' +
  ' hsl(var(--primary) / 0.7) 357deg,' +
  ' transparent 360deg)';

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * Seconds for one full lap. Keep this slow — the beam is ambience, not a
   * loading indicator. Anything under ~15s reads as frantic and pulls the eye
   * away from the copy it is supposed to be framing.
   */
  duration?: number;
  /** Negative values start the lap already in progress. */
  delay?: number;
};

export function BorderBeam({ children, className = '', duration = 20, delay = 0 }: Props) {
  const spin: CSSProperties = {
    animationDelay: `${delay}s`,
    background: BEAM_GRADIENT,
  };

  return (
    <div
      className={`group/beam relative overflow-hidden rounded-2xl p-[1.5px] ${className}`}
      style={{ ['--beam-duration' as string]: `${duration}s` }}
    >
      {/* Static rim so the edge never vanishes between passes. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl bg-border/50" />

      {/* Glow pass — blurred, bleeds a halo just outside the rim. */}
      <span
        aria-hidden
        className="beam-spin pointer-events-none absolute inset-[-150%] animate-border-beam opacity-60 blur-[6px] transition-opacity duration-500 group-hover/beam:opacity-95"
        style={spin}
      />

      {/* Core pass — sharp, gives the beam a defined leading edge. */}
      <span
        aria-hidden
        className="beam-spin pointer-events-none absolute inset-[-150%] animate-border-beam transition-opacity duration-500"
        style={spin}
      />

      {/* Card surface. Radius is the frame's 1rem minus the 1.5px rim. */}
      <div className="relative h-full rounded-[calc(1rem-1.5px)]">{children}</div>
    </div>
  );
}

export default BorderBeam;
