import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export function QuoteFormInline() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    message: '',
    website: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoMeta, setPhotoMeta] = useState<{ name: string; type: string; size: number; dataUrl: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website) return;
    setIsSubmitting(true);
    try {
      const resp = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'hero-inline', photo: photoMeta || undefined }),
      });
      if (!resp.ok) {
        const details = await resp.text();
        throw new Error(details || 'Submission failed');
      }
      toast({
        title: 'Quote Request Sent!',
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        serviceType: '',
        message: '',
        website: '',
      });
      setPhotoPreview(null);
      setPhotoMeta(null);
    } catch (err: any) {
      toast({
        title: 'Submission Error',
        description: err?.message || 'Please try again or call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please upload an image.' });
      return;
    }
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      toast({ title: 'File too large', description: 'Please select an image under 10MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhotoPreview(dataUrl);
      setPhotoMeta({ name: file.name, type: file.type, size: file.size, dataUrl });
    };
    reader.onerror = () => {
      toast({ title: 'Could not read file', description: 'Please try a different image.' });
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-10 p-6 md:p-8 bg-card/80 backdrop-blur border border-border/40 rounded-2xl shadow-sm"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Get a Free Quote</h2>
      <p className="text-muted-foreground mb-6">
        Tell us about your needs and we’ll respond within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            <label htmlFor="name" className="block text-xs font-medium mb-2">
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
            <label htmlFor="phone" className="block text-xs font-medium mb-2">
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
          <label htmlFor="email" className="block text-xs font-medium mb-2">
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

        <div>
          <label htmlFor="serviceType" className="block text-xs font-medium mb-2">
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
          <label htmlFor="message" className="block text-xs font-medium mb-2">
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

        <div>
          <label htmlFor="photo-inline" className="block text-xs font-medium mb-2">
            Upload a Photo (Optional)
          </label>
          <input
            id="photo-inline"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-primary/10 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
          />
          {photoPreview && (
            <div className="mt-2">
              <img src={photoPreview} alt="Selected preview" className="h-24 w-auto rounded-md border border-border/50 object-cover" />
            </div>
          )}
          <p className="mt-2 text-[10px] text-muted-foreground">Max 10MB. Helps us assess installations or repairs.</p>
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
  );
}

export default QuoteFormInline;
