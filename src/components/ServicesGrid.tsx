import { motion } from 'framer-motion';
import {
  Thermometer,
  Wind,
  Wrench,
  Settings,
  Zap,
  Building
} from 'lucide-react';
import BorderBeam from './BorderBeam';

const services = [
  {
    icon: Thermometer,
    title: 'Split System Installation',
    description: 'Energy-efficient split systems for homes and small offices',
  },
  {
    icon: Wind,
    title: 'Ducted Air Conditioning',
    description: 'Whole-home comfort with concealed ducted systems',
  },
  {
    icon: Wrench,
    title: 'Repairs & Diagnostics',
    description: 'Fast, accurate diagnosis and repair for all brands',
  },
  {
    icon: Settings,
    title: 'Preventive Maintenance',
    description: 'Regular servicing to extend system life and efficiency',
  },
  {
    icon: Zap,
    title: 'Emergency Services',
    description: 'Rapid response for urgent breakdowns Sydney-wide',
  },
  {
    icon: Building,
    title: 'Commercial Solutions',
    description: 'Scalable systems for offices, retail and industrial',
  },
];

export function ServicesGrid() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Complete air conditioning solutions for every need
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Slower than the three pathway cards above: six beams in one
                  viewport need to be calmer than three, or the grid shimmers.
                  Laps are offset so no two are ever at the same corner. */}
              <BorderBeam className="h-full" duration={44} delay={index * -7.3}>
                {/* The surface must be fully opaque. A translucent card lets the
                    rotating gradient behind it show through as light wedges
                    across the copy, instead of only at the rim. */}
                <div className="group h-full rounded-[calc(1rem-1.5px)] bg-card p-5 transition-colors duration-300 hover:bg-charcoal sm:p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold transition-colors group-hover:text-primary sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </BorderBeam>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesGrid;
