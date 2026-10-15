import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { DISPLAYED_REVIEWS, GOOGLE_PROFILE, type Review } from '@/data/reviews';

/**
 * Real Google reviews, from src/data/reviews.ts. The header shows the
 * listing's actual rating and count; the cards are the 4- and 5-star
 * reviews, each with the reviewer's own star rating and Google's relative
 * date, so the strip reads like the listing it came from.
 */

/** One full pass of the reviews. Slow enough to read a card as it goes by. */
const SCROLL_DURATION_S = 11 * DISPLAYED_REVIEWS.length;

function Stars({ n, className = 'h-4 w-4' }: { n: number; className?: string }) {
  return (
    <span className="flex" aria-label={`${n} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`${className} ${i <= n ? 'fill-yellow-400 text-yellow-400' : 'text-foreground/15'}`}
        />
      ))}
    </span>
  );
}

function GoogleG({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="mr-4 flex w-[300px] shrink-0 flex-col rounded-2xl border border-border bg-card/90 p-5 transition-colors duration-300 hover:border-primary/30 hover:bg-card sm:mr-5 sm:w-[360px] sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <Quote className="h-6 w-6 text-primary/20" />
        <GoogleG />
      </div>

      <div className="mb-3">
        <Stars n={review.rating} />
      </div>

      <blockquote className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      <figcaption className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-semibold">{review.name}</span>
        <span className="text-xs text-muted-foreground">{review.when}</span>
      </figcaption>
    </figure>
  );
}

export function ReviewsSection() {
  /**
   * Two identical copies sliding by exactly -50%: copy 2 arrives where copy 1
   * began, so the loop never seams. Cards carry a right margin rather than the
   * track carrying `gap` — a gap makes the track a half-gap wider than twice a
   * copy and the loop visibly jumps each pass.
   */
  const copy = (hidden: boolean) => (
    <div className="flex shrink-0 items-stretch" aria-hidden={hidden || undefined}>
      {DISPLAYED_REVIEWS.map((review) => (
        <ReviewCard key={`${review.name}-${hidden ? 'b' : 'a'}`} review={review} />
      ))}
    </div>
  );

  return (
    // The weave carries no plate of its own, so this section takes the site's
    // own theme: light in light, dark in dark.
    <section id="reviews" className="carbon-weave py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <a
            href={GOOGLE_PROFILE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mb-4 rounded-full border border-border bg-card/80 px-4 py-2 hover:border-primary/40 transition-colors"
            aria-label={`${GOOGLE_PROFILE.rating} out of 5 on Google from ${GOOGLE_PROFILE.count} reviews — open the listing`}
          >
            <GoogleG className="h-5 w-5" />
            <span className="text-xl sm:text-2xl font-bold">{GOOGLE_PROFILE.rating.toFixed(1)}</span>
            <Stars n={Math.round(GOOGLE_PROFILE.rating)} className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm text-muted-foreground">{GOOGLE_PROFILE.count} Google reviews</span>
          </a>
          {/* Two deliberate lines — "Trusted by Sydney" over "Homeowners &
              Businesses" — rather than wherever the column width breaks it. */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="block">Trusted by Sydney</span>
            <span className="block">Homeowners &amp; Businesses</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            No shortcuts. From start to finish.
          </p>
        </motion.div>
      </div>

      {/* Full-bleed: the row should run past the container edges, so it sits
          outside the padded container above. Hovering pauses it (see
          .marquee-strip in index.css) so a card can be read without chasing it. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="marquee-strip marquee-mask overflow-hidden"
      >
        <div
          className="marquee-track flex w-max animate-marquee-left"
          style={{ ['--marquee-duration' as string]: `${SCROLL_DURATION_S}s` }}
        >
          {copy(false)}
          {copy(true)}
        </div>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8"
        >
          <a
            href={GOOGLE_PROFILE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Read all {GOOGLE_PROFILE.count} reviews on Google
          </a>
          <a
            href={GOOGLE_PROFILE.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary hover:underline font-medium"
          >
            Worked with us? Leave a review
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ReviewsSection;
