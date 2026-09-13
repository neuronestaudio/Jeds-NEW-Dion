import { motion } from 'framer-motion';
import { CheckCircle, Shield, Clock, Award, Sparkles, BadgeCheck } from 'lucide-react';
import BorderBeam from './BorderBeam';
// Client-supplied render, low native resolution (236x419) — framed small and
// portrait rather than stretched, which is what it was cropped for anyway.
import airconGlow from '@/assets/why-aircon.jpg?url';

const reasons = [
  {
    icon: Shield,
    title: 'Manufacturer‑Trained Service Agents',
    description: 'Daikin & Haier authorised service agents for faster diagnostics and repairs using genuine parts',
  },
  {
    icon: Award,
    title: 'Daikin Certified Dealer',
    description: 'Authorised dealer with access to full Daikin product range and genuine parts',
  },
  {
    icon: Award,
    title: 'Haier Certified Dealer',
    description: 'Authorised Haier dealer with genuine parts and product support',
  },
  {
    icon: Shield,
    title: '10-Year Workmanship Warranty',
    description: 'Complete peace of mind with our comprehensive labour warranty on all installations',
  },
  {
    icon: Clock,
    title: '25+ Years Experience Combined',
    description: 'Over two decades of combined expertise serving Sydney homes and businesses with quality work',
  },
  {
    icon: BadgeCheck,
    title: 'Fully Licensed & Insured',
    description: 'Qualified technicians with all required licences and comprehensive insurance',
  },
  {
    icon: CheckCircle,
    title: 'Upfront Pricing',
    description: 'No surprises - detailed quotes before any work begins with no hidden fees',
  },
  {
    icon: Sparkles,
    title: 'Clean & Professional',
    description: 'Respectful technicians who leave your property spotless every time',
  },
];

export function WhyChooseUs() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow">Why JED</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6">
              Sydney’s Trusted <span className="text-gradient">Daikin & Haier Installation Experts</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
              When choosing air conditioning installation in Sydney, brand expertise matters.
              As certified Daikin and Haier dealers and authorised service agents, we install systems to manufacturer standards — ensuring warranty protection, optimal performance and long-term reliability.
              Whether you're installing a new ducted system, upgrading an older split system, or fitting out an apartment or commercial property, our licensed technicians deliver compliant, energy-efficient installations tailored to your space.
            </p>
            <div className="mb-6 flex flex-wrap gap-4 sm:mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Residential</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Commercial</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">All Brands</span>
              </div>
            </div>

            {/* The accent photo: framed small and portrait, sitting under the
                copy rather than as a full-bleed background — the source is
                236x419, and stretching it wider would go soft. */}
            <div className="max-w-[220px] overflow-hidden rounded-2xl border border-border shadow-[0_18px_40px_-24px_hsl(240_8%_10%/0.4)] sm:max-w-[260px]">
              <img
                src={airconGlow}
                alt="A Daikin split system cooling a Sydney living room"
                loading="lazy"
                decoding="async"
                className="aspect-[236/419] w-full object-cover"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`h-full ${index >= 6 ? 'hidden sm:block' : ''}`}
              >
                <BorderBeam className="h-full" duration={16} delay={index * -2.1} hoverOnly>
                <div className="h-full rounded-[calc(1rem-1.5px)] bg-card p-4 sm:p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <reason.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{reason.title}</h3>
                <p className="text-muted-foreground text-sm">{reason.description}</p>
                </div>
                </BorderBeam>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
