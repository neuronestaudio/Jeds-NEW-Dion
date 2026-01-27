import { Home, Building2, Wrench, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

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
    <section id="services" className="py-16 md:py-24 section-glow">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How Can We Help?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your path to the perfect climate solution
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pathways.map((pathway, index) => (
            <motion.a
              key={pathway.id}
              href={pathway.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="service-card group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${pathway.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <pathway.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {pathway.title}
                </h3>

                <p className="text-muted-foreground mb-6">
                  {pathway.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {pathway.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicePathways;
