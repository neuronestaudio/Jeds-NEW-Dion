import { motion } from 'framer-motion';
import QuoteWizard from './QuoteWizard';

export function QuoteFormInline() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-10 p-5 sm:p-6 md:p-8 bg-card/80 backdrop-blur border border-border/40 rounded-2xl shadow-sm"
    >
      <QuoteWizard
        source="hero-inline"
        compact
        heading="Get a Free Quote"
        subheading="Two quick taps, then your details — we’ll respond within 24 hours."
      />
    </motion.div>
  );
}

export default QuoteFormInline;
