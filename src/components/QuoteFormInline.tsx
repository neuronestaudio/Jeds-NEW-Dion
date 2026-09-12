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
          deliberate beam rather than another static rim. */}
      <BorderBeam duration={26}>
      <div className="rounded-[calc(1rem-1.5px)] bg-card/90 p-5 shadow-sm backdrop-blur sm:p-6 md:p-8">
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
