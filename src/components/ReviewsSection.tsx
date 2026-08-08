import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Star, MapPin, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

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

// Short enough that the row is visibly moving within a few seconds of landing
// on it, long enough to read a review before it advances.
const AUTOPLAY_MS = 3500;

export function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  // Advance on a timer, but hold while the visitor is hovering or has focus
  // inside the strip — otherwise it slides away mid-read.
  useEffect(() => {
    if (!emblaApi || paused) return;
    const id = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [emblaApi, paused]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Trusted by Sydney homeowners and businesses
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="min-w-0 shrink-0 grow-0 basis-full px-2.5 sm:basis-1/2 sm:px-3 lg:basis-1/3"
                >
                  <figure className="relative flex h-full flex-col rounded-2xl border border-border/30 bg-card/50 p-5 transition-colors duration-300 hover:border-primary/30 hover:bg-card/80 sm:p-6">
                    <Quote className="absolute right-5 top-5 h-7 w-7 text-primary/15" />

                    <div className="mb-4 flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <blockquote className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>

                    <figcaption className="flex items-center justify-between border-t border-border/30 pt-4">
                      <span className="text-sm font-semibold">{review.name}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {review.location}
                      </span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {reviews.map((review, i) => (
                <button
                  key={review.name}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to review ${i + 1}`}
                  aria-current={i === selected}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === selected ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/50 transition-all hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-8"
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
