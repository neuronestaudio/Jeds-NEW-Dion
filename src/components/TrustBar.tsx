import { Shield, Award, Clock, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import BorderBeam from './BorderBeam';

const trustItems = [
  {
    icon: Award,
    label: 'Certified Technicians',
    sublabel: 'Licensed & Insured',
  },
  {
    icon: Wrench,
    label: 'Service Agents',
    sublabel: 'All Major Brands',
  },
  {
    icon: Shield,
    label: '10-Year Warranty',
    sublabel: 'On All Installations',
  },
  {
    icon: Clock,
    label: '25+ Years',
    sublabel: 'Combined Experience',
  },
];


export function TrustBar() {
  return (
    <section className="py-6 sm:py-8 md:py-10 bg-[linear-gradient(180deg,hsl(var(--card)/0.78),hsl(var(--background)))] border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: 'easeOut' }}
              className="h-full"
            >
              {/* Laps are offset so the four beams never travel in unison,
                  which reads as decoration rather than four synced widgets. */}
              <BorderBeam className="h-full" duration={19} delay={index * -4.7}>
              <div className="group relative h-full overflow-hidden rounded-[calc(1rem-1.5px)] bg-card dark:bg-[linear-gradient(160deg,rgba(18,26,36,0.96),rgba(12,17,25,0.88))] p-4 shadow-[0_18px_40px_rgba(1,10,20,0.18)] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-1 sm:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,202,255,0.16),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(18,168,255,0.12),transparent_42%)] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors duration-500 group-hover:bg-primary/15 sm:h-12 sm:w-12">
                  <item.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm leading-tight text-foreground sm:text-base">{item.label}</p>
                  <p className="mt-1 text-xs leading-tight text-muted-foreground sm:text-sm">{item.sublabel}</p>
                </div>
              </div>
              </div>
              </BorderBeam>
            </motion.div>
          ))}
        </div>

        {/* Retain trust metrics only; brand logos are shown in BrandsSection */}
      </div>
    </section>
  );
}

export default TrustBar;
