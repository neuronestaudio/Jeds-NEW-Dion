import { motion } from 'framer-motion';
import WorkMarquee from './WorkMarquee';

/**
 * "Our Recent Work" header — restyled after a detailing studio's "Gallery"
 * section: eyebrow + headline on the left, a slash-separated category line
 * on the right at the headline's own baseline rather than centred above the
 * grid. The gallery itself (WorkMarquee) went from rounded cards in a
 * carousel to a full-bleed, contiguous diagonal-panel wall, the same shift
 * the reference makes.
 */
const CATEGORIES = ['Split Systems', 'Ducted AC', 'Commercial Fit-Outs'];

export function ProjectsGallery() {
  return (
    <section id="projects" className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-4 sm:mb-12 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span className="eyebrow">Recent installs</span>
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">Our Recent Work</h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base md:text-lg">
              Quality installations across Sydney homes and businesses.
            </p>
          </div>
          <p className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:block">
            {CATEGORIES.join(' / ')}
          </p>
        </motion.div>
      </div>

      {/* Full-bleed: the rows should run past the container edges, so the
          gallery sits outside the padded container above. */}
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
