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
          deliberate beam rather than another static rim.

          This inner surface needs an OPAQUE fill, just not a white one:
          BorderBeam paints two oversized, blurred conic-gradient "glow"
          spans behind its children and relies on an opaque card surface to
          mask them down to a thin rim. Stripping that fill entirely (the
          previous fix, made to stop white-on-white text) left the glow with
          nothing to hide behind, so it bled across the whole card as a
          washed-out diagonal sweep — a second, less obvious bug from the
          same change. Solid navy keeps the mask AND the light-on-dark text
          from .q-teal's scoped tokens correct; each option row inside the
          wizard is still its own bg-card chip, so the surface still reads
          as distinct rows, just without a second full-card wrapper. */}
      <BorderBeam duration={26}>
      <div className="rounded-[calc(1rem-1.5px)] bg-[hsl(var(--q-teal-deeper))] p-5 sm:p-6 md:p-8">
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
