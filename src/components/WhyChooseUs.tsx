import { motion } from 'framer-motion';
import { CheckCircle, Shield, Clock, Award, Sparkles, BadgeCheck } from 'lucide-react';

const reasons = [
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
    title: '5-Year Workmanship Warranty',
    description: 'Complete peace of mind with our comprehensive labour warranty on all installations',
  },
  {
    icon: Clock,
    title: '10+ Years Experience',
    description: 'Decade of expertise serving Sydney homes and businesses with quality work',
  },
  {
    icon: BadgeCheck,
    title: 'Fully Licensed & Insured',
    description: 'Qualified technicians with all required licences and comprehensive insurance',
  },
  {
    icon: Shield,
    title: 'Manufacturer‑Trained Service Agents',
    description: 'Daikin & Haier authorised service agents for faster diagnostics and repairs using genuine parts',
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
    <section id="about" className="py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Why Sydney Chooses
              <span className="text-gradient"> JED Air Conditioning</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              For over a decade, we've built our reputation on quality workmanship,
              honest pricing, and exceptional customer service. As authorised <strong>Daikin & Haier dealers</strong> 
              and <strong>manufacturer‑trained service agents</strong>, we install new systems and perform repairs
              quickly with genuine parts and factory‑approved processes backed by industry‑leading warranties.
            </p>
            <div className="flex flex-wrap gap-4">
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
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-5 bg-card/50 border border-border/30 rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <reason.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{reason.title}</h3>
                <p className="text-muted-foreground text-sm">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
