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
    <section id="services" className="trapezium-stage py-12 sm:py-16 md:py-24">
      <span aria-hidden="true" className="trapezium-glow" />
      <div className="container mx-auto px-5 sm:px-8 lg:px-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How Can We Help?
          </h2>
        </motion.div>

        {/*
          Below md these three stack, and at the desktop proportions that was
          about 360px of card each — over 1,000px of scrolling to answer one
          question. So on phones the card lies down: the icon moves beside the
          title instead of above it, the feature list becomes a wrapping row of
          chips instead of three bulleted lines, and "Learn More" collapses to
          the chevron on the title row, since the whole card is the link
          anyway. From md up nothing changes.
        */}
        <div className="grid grid-cols-1 gap-3 sm:gap-6 md:grid-cols-3 lg:gap-8">
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
              <BorderBeam className="h-full" duration={17} delay={index * -5.6}>
                <a
                  href={pathway.href}
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[calc(1rem-1.5px)] bg-gradient-to-b from-card to-background p-4 transition-shadow duration-500 hover:shadow-glow md:p-6"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${pathway.color} rounded-[calc(1rem-1.5px)] opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="relative z-10 flex gap-3.5 md:block">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20 md:mb-6 md:h-14 md:w-14 md:rounded-2xl">
                      <pathway.icon className="h-[22px] w-[22px] text-primary md:h-7 md:w-7" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="flex items-center justify-between gap-2 text-base font-bold transition-colors group-hover:text-primary md:mb-3 md:block md:text-2xl">
                        {pathway.title}
                        <ArrowRight className="h-4 w-4 shrink-0 text-primary md:hidden" />
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground md:mb-6 md:mt-0 md:text-base">
                        {pathway.description}
                      </p>

                      <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 md:mb-6 md:mt-0 md:block md:space-y-2">
                        {pathway.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground md:gap-2 md:text-sm"
                          >
                            <div className="h-1 w-1 rounded-full bg-primary md:h-1.5 md:w-1.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="hidden items-center gap-2 font-semibold text-primary transition-all group-hover:gap-3 md:flex">
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </div>
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
