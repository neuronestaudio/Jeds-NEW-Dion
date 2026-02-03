import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';

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

export function ReviewsSection() {
  return (
    <section id="reviews" className="py-16 md:py-24 section-glow">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-2xl font-bold">5.0</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Trusted by Sydney homeowners and businesses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-6 bg-card/50 border border-border/30 rounded-2xl"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{review.name}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {review.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
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
