import { motion } from 'framer-motion';
import { ClipboardCheck, FileText, Wrench, ThumbsUp, CalendarCheck } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    step: '01',
    title: 'On-Site Assessment & Sizing',
    description: 'We assess room size, insulation, layout and usage to determine the correct system capacity.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'System Recommendation',
    description: 'We recommend the right Daikin or Haier system based on performance, efficiency and budget.',
  },
  {
    icon: Wrench,
    step: '03',
    title: 'Professional Installation',
    description: 'Installed to Australian standards and manufacturer guidelines.',
  },
  {
    icon: ThumbsUp,
    step: '04',
    title: 'Testing & Commissioning',
    description: 'Full system testing, airflow balancing and operational walkthrough.',
  },
  {
    icon: CalendarCheck,
    step: '05',
    title: 'Warranty & Aftercare',
    description: 'Backed by manufacturer warranty and workmanship guarantee.',
  },
];

export function ProcessSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Installation Process
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-card border border-border/50 mb-4">
                  <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">{step.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
