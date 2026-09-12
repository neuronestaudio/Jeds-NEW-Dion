import { motion } from 'framer-motion';
import { Star, MapPin, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Michael Thompson',
    location: 'Parramatta',
    rating: 5,
    text: 'Excellent service from start to finish. The team was professional, punctual and left everything spotless. Our new ducted system is perfect.',
  },
  {
    name: 'Sarah Chen',
    location: 'North Sydney',
    rating: 5,
    text: 'Quick response for an emergency repair. Fixed our split system same day. Very knowledgeable technicians who explained everything clearly.',
  },
  {
    name: 'David Williams',
    location: 'Bondi',
    rating: 5,
    text: 'Best quote we received and the installation quality exceeded expectations. Highly recommend JED for any aircon work.',
  },
  {
    name: 'Lisa Martinez',
    location: 'Castle Hill',
    rating: 5,
    text: 'Professional team who installed 4 split systems in our new home. Great advice on energy efficiency and very competitive pricing.',
  },
  {
    name: 'James O\'Brien',
    location: 'Sutherland',
    rating: 5,
    text: 'Used JED for our office fit-out. They handled everything from design to installation. Zero issues with the commercial system.',
  },
  {
    name: 'Emma Taylor',
    location: 'Chatswood',
    rating: 5,
    text: 'Annual maintenance service keeps our system running perfectly. Always on time and thorough with their inspections.',
  },
];

/** One full pass of the six reviews. Slow enough to read a card as it goes by. */
const SCROLL_DURATION_S = 55;

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <figure className="mr-4 flex w-[300px] shrink-0 flex-col rounded-2xl border border-border bg-card/90 p-5 transition-colors duration-300 hover:border-primary/30 hover:bg-card sm:mr-5 sm:w-[360px] sm:p-6">
      <Quote className="mb-3 h-6 w-6 text-primary/20" />

      <div className="mb-3 flex items-center gap-1">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <blockquote className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      <figcaption className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-semibold">{review.name}</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {review.location}
        </span>
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
      {reviews.map((review) => (
        <ReviewCard key={`${review.name}-${hidden ? 'b' : 'a'}`} review={review} />
      ))}
    </div>
  );

  return (
    <section id="reviews" className="py-12 sm:py-16 md:py-24 section-glow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-xl sm:text-2xl font-bold">5.0</span>
          </div>
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
          className="text-center mt-10"
        >
          <a
            href="https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View all reviews on Google
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm-1.5 18.75v-1.5c0-2.071 1.679-3.75 3.75-3.75h.75v3l4.5-4.5-4.5-4.5v3h-.75c-3.314 0-6 2.686-6 6v1.5h2.25z" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default ReviewsSection;
