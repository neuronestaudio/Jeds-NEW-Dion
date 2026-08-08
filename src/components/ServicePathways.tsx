import { Home, Building2, Wrench, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BorderBeam from './BorderBeam';

const pathways = [
  {
    id: 'residential',
    icon: Home,
    title: 'Residential',
    description: 'Split systems, ducted & multi-head solutions for homes',
    features: ['Split Systems', 'Ducted AC', 'Multi-Head Units'],
    href: '#residential',
    color: 'from-primary/20 to-primary/5',
  },
  {
    id: 'commercial',
    icon: Building2,
    title: 'Commercial',
    description: 'Large-scale solutions for offices, retail & industrial',
    features: ['Office Fit-outs', 'Retail Cooling', 'Warehouse Solutions'],
    href: '#commercial',
    color: 'from-secondary/20 to-secondary/5',
  },
  {
    id: 'servicing',
    icon: Wrench,
    title: 'Service & Repairs',
    description: 'Fast diagnosis & repairs for all brands & systems',
    features: ['Same-Day Service', 'All Brands', 'Maintenance Plans'],
    href: '#servicing',
    color: 'from-primary/15 to-secondary/10',
  },
];

export function ServicePathways() {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-24 section-glow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How Can We Help?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Choose your path to the perfect climate solution
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {pathways.map((pathway, index) => (
            <motion.div
              key={pathway.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              {/* Laps are staggered so the three beams never travel in unison,
                  which reads as decoration rather than three synced widgets. */}
              <BorderBeam className="h-full" duration={7} delay={index * -2.3}>
                <a
                  href={pathway.href}
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[calc(1rem-1.5px)] bg-gradient-to-b from-card to-background p-6 transition-shadow duration-500 hover:shadow-glow"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${pathway.color} rounded-[calc(1rem-1.5px)] opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="relative z-10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <pathway.icon className="h-7 w-7 text-primary" />
                    </div>

                    <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-primary md:text-2xl">
                      {pathway.title}
                    </h3>

                    <p className="mb-6 text-muted-foreground">{pathway.description}</p>

                    <ul className="mb-6 space-y-2">
                      {pathway.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-2 font-semibold text-primary transition-all group-hover:gap-3">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </a>
              </BorderBeam>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicePathways;
