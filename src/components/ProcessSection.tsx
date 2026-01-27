import { motion } from 'framer-motion';
import { ClipboardCheck, FileText, Wrench, ThumbsUp, CalendarCheck } from 'lucide-react';

const steps = [
  {
    icon: ClipboardCheck,
    step: '01',
    title: 'Free Consultation',
    description: 'We assess your space and discuss your cooling needs',
  },
  {
    icon: FileText,
    step: '02',
    title: 'Detailed Quote',
    description: 'Transparent pricing with no hidden surprises',
  },
  {
    icon: Wrench,
    step: '03',
    title: 'Professional Install',
    description: 'Clean, efficient installation by qualified technicians',
  },
  {
    icon: ThumbsUp,
    step: '04',
    title: 'System Commission',
    description: 'Full testing and handover with user training',
  },
  {
    icon: CalendarCheck,
    step: '05',
    title: 'Ongoing Support',
    description: 'Maintenance plans and rapid response service',
  },
];

export function ProcessSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From first call to cool comfort - our streamlined process
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-card border border-border/50 mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
