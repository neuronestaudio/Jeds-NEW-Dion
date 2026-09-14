import { motion } from 'framer-motion';
import QuoteWizard from './QuoteWizard';
import BorderBeam from './BorderBeam';

export function QuoteFormInline() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-10"
    >
      {/* The one panel on the page that converts — give it the slowest, most
          deliberate beam rather than another static rim. No opaque card fill
          here (that was the pre-redesign look): QuotePanel now wraps this in
          .q-teal directly, and an opaque white card in between would sit the
          wizard's light-on-dark heading text right back on white — the exact
          "how it looked before this fix" bug. Each option row inside the
          wizard is already its own bg-card chip, so the surface still reads
          as distinct rows, just without a second card wrapping all of them. */}
      <BorderBeam duration={26}>
      <div className="rounded-[calc(1rem-1.5px)] p-5 sm:p-6 md:p-8">
      <QuoteWizard
        source="hero-inline"
        compact
        heading="Get a Free Quote"
        subheading="Two quick taps, then your details — we’ll respond within 24 hours."
      />
      </div>
      </BorderBeam>
    </motion.div>
  );
}

export default QuoteFormInline;
