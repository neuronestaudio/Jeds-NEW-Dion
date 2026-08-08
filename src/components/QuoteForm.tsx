import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';
import AddressAutocomplete, { type StructuredAddress } from './AddressAutocomplete';

export function QuoteForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressDetails, setAddressDetails] = useState<StructuredAddress | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    serviceType: '',
    message: '',
    // Honeypot field
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website) return;
    setIsSubmitting(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE || '';
      const url = apiBase ? `${apiBase}/api/quote` : '/api/quote';
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, addressDetails, source: 'bottom-quote' }),
      });
      if (!resp.ok) {
        const details = await resp.text();
        throw new Error(details || 'Submission failed');
      }
      toast({
        title: "Quote Request Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      trackEvent('quote_submit', {
        source: 'bottom-quote',
        service_type: formData.serviceType || 'unknown',
        // Lets us see in GA4 how often a real Google address was picked vs typed.
        address_verified: Boolean(addressDetails),
        suburb: addressDetails?.suburb || 'unknown',
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        serviceType: '',
        message: '',
        website: '',
      });
      setAddressDetails(null);
    } catch (err: any) {
      toast({
        title: 'Submission Error',
        description: err?.message || 'Please try again or call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get a Free Quote
            </h2>
            <p className="text-muted-foreground mb-8">
              Fill out the form and we'll get back to you within 24 hours with a detailed quote.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot - hidden from users */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    maxLength={20}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors"
                    placeholder="0400 000 000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  maxLength={255}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <AddressAutocomplete
                id="address"
                label="Site Address *"
                required
                value={formData.address}
                onChange={(address) => setFormData((prev) => ({ ...prev, address }))}
                onSelect={setAddressDetails}
                confirmedAddress={addressDetails}
                placeholder="Start typing your address…"
              />

              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium mb-2">
                  Service Required *
                </label>
                <select
                  id="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select a service...</option>
                  <option value="installation">New Installation</option>
                  <option value="repair">Repair / Breakdown</option>
                  <option value="maintenance">Maintenance / Service</option>
                  <option value="commercial">Commercial Project</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Tell Us More (Optional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  maxLength={1000}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-border/50 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Brief description of your needs..."
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Get My Free Quote
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div id="contact" className="p-6 bg-card border border-border/30 rounded-2xl">
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
            <div className="p-6 bg-card border border-border/30 rounded-2xl">
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
