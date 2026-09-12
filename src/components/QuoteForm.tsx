import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import QuoteWizard from './QuoteWizard';

export function QuoteForm() {
  return (
    <section id="quote" className="py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <QuoteWizard
              source="bottom-quote"
              heading="Get a Free Quote"
              subheading="Two quick taps, then your details — we’ll come back to you within 24 hours with a detailed quote."
            />
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div id="contact" className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-xl font-bold mb-6">Contact Us Directly</h3>

              <div className="space-y-4">
                <a
                  href="tel:0434308070"
                  className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Call Us</p>
                    <p className="text-lg font-semibold">0434 308 070</p>
                  </div>
                </a>

                <a
                  href="mailto:JED_AIR@outlook.com"
                  className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">JED_AIR@outlook.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Area</p>
                    <p className="font-semibold">Sydney-Wide Coverage</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hours</p>
                    <p className="font-semibold">Mon-Sat: 7am - 6pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust signals near form */}
            <div className="p-6 bg-card border border-border rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Why Get a Quote?</h3>
              <ul className="space-y-3">
                {[
                  'Free, no-obligation assessment',
                  'Response within 24 hours',
                  'Transparent upfront pricing',
                  '5-year workmanship warranty',
                  'Daikin certified installations',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default QuoteForm;
