import { motion } from 'framer-motion';
import WorkMarquee from './WorkMarquee';

export function ProjectsGallery() {
  return (
    <section id="projects" className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="eyebrow">Recent installs</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Recent Work
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Quality installations across Sydney homes and businesses
          </p>
        </motion.div>
      </div>

      {/* Full-bleed: the rows should run past the container edges, so the
          marquee sits outside the padded container above. */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <WorkMarquee />
      </motion.div>
    </section>
  );
}

export default ProjectsGallery;
