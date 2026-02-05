import { Star, Shield, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const trustItems = [
  {
    icon: Award,
    label: 'Daikin & Haier Certified',
    sublabel: 'Authorised Dealer',
  },
  {
    icon: Shield,
    label: 'Service Agents',
    sublabel: 'Daikin & Haier',
  },
  {
    icon: Shield,
    label: '5-Year Warranty',
    sublabel: 'On All Labour',
  },
  {
    icon: Clock,
    label: '10+ Years',
    sublabel: 'Experience',
  },
  {
    icon: Star,
    label: '5.0 Rating',
    sublabel: 'Google Reviews',
  },
];

export function TrustBar() {
  return (
    <section className="py-6 md:py-8 bg-card/50 border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base text-foreground">{item.label}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{item.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustBar;
