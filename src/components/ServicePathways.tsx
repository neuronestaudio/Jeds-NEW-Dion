import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import residentialImg from '@/assets/pathways/residential.jpg?url';
import commercialImg from '@/assets/pathways/commercial.jpg?url';
import repairsImg from '@/assets/pathways/repairs.jpg?url';

/**
 * "How Can We Help?" as three diagonal photo panels — the pattern from the
 * Formula Mobile Detailing services strip: each tile is skewed, its photo and
 * copy are counter-skewed so the frame is angled and the type is not, photos
 * sit at half brightness, and hovering a tile grows its flex share (the others
 * give it back) which is what reveals the line of copy. Styles live in
 * src/index.css under "Service pathways".
 */

type Pathway = {
  id: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  img: string;
};

const pathways: Pathway[] = [
  {
    id: 'residential',
    title: 'Residential',
    description: 'Split systems, ducted & multi-head solutions for homes.',
    features: ['Split Systems', 'Ducted AC', 'Multi-Head Units'],
    href: '/services',
    img: residentialImg,
  },
  {
    id: 'commercial',
    title: 'Commercial',
    description: 'Large-scale solutions for offices, retail & industrial.',
    features: ['Office Fit-outs', 'Retail Cooling', 'Warehouse Solutions'],
    href: '#quote',
    img: commercialImg,
  },
  {
    id: 'servicing',
    title: 'Service & Repairs',
    description: 'Fast diagnosis & repairs for all brands & systems.',
    features: ['Same-Day Service', 'All Brands', 'Maintenance Plans'],
    href: '/service/aircon-repair',
    img: repairsImg,
  },
];

export function ServicePathways() {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="eyebrow">Residential · Commercial · Repairs</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            How Can We Help?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Pick the one that fits and we&rsquo;ll take it from there.
          </p>
        </motion.div>
      </div>

      {/* Full-bleed on purpose: the strip runs past the container so its cut
          edges read as part of the page, not a boxed widget. */}
      <div className="svcslant">
        {pathways.map((p) => (
          <a
            key={p.id}
            href={p.href}
            className="svcslant__i"
            style={{ ['--img' as string]: `url("${p.img}")` } as CSSProperties}
          >
            <span className="svcslant__in">
              <span className="svcslant__name">
                {p.title}
                <ArrowRight className="svcslant__arrow" aria-hidden="true" />
              </span>
              <span className="svcslant__blurb">
                {p.description}
                <span className="svcslant__feat">{p.features.join(' · ')}</span>
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default ServicePathways;
