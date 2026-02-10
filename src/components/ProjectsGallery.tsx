import { motion, AnimatePresence } from 'framer-motion';
import ResidentialCarousel from './ResidentialCarousel';
import DuctedCarousel from './DuctedCarousel';
import CommercialCarousel from './CommercialCarousel';
import MultiHeadCarousel from './MultiHeadCarousel';
import JEDActionCarousel from './JEDActionCarousel';
import ApartmentCarousel from './ApartmentCarousel';
import { useEffect, useRef, useState } from 'react';

// Resolve local project photos (filenames contain spaces/parentheses)
const resolveAsset = (name: string) => new URL(`../assets/${name}`, import.meta.url).href;
const modernImages = [
  'Residential 1.jpeg',
  'Residential 2.jpeg',
  'Residential 3.jpeg',
  'Residential 4.jpeg',
  'Residential 5.jpeg',
  'Residential 6.jpeg',
].map(resolveAsset);

function HoverCycle({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  const next = () => setIdx((i) => (i + 1) % images.length);
  const start = () => {
    if (timer.current) return;
    // Increase cycle speed further: set to 75% of previous interval
    timer.current = window.setInterval(next, 1440);
  };
  const stop = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => () => stop(), []);

  return (
    <div
      onMouseEnter={start}
      onMouseLeave={stop}
      className="relative w-full aspect-[4/3] overflow-hidden"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </AnimatePresence>
    </div>
  );
}

// Placeholder project images - these would be replaced with actual project photos
const projects = [
  {
    id: 1,
    title: 'Modern Home Split System',
    location: 'Parramatta',
    type: 'Residential',
    images: modernImages,
    image: modernImages[0],
  },
  {
    id: 2,
    title: 'Commercial Fitout',
    location: 'North Sydney',
    type: 'Commercial',
    images: [],
  },
  {
    id: 3,
    title: 'Ducted System Installation',
    location: 'Castle Hill',
    type: 'Residential',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Apartment',
    location: 'Chatswood',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    title: 'Multi-Head Split System',
    location: 'Bondi',
    type: 'Residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    title: 'JED in Action',
    location: 'Western Sydney',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
  },
];

export function ProjectsGallery() {
  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our Recent Work
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Quality installations across Sydney homes and businesses
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl"
            >
              {index === 0 ? (
                <ResidentialCarousel />
              ) : project.title === 'Ducted System Installation' ? (
                <DuctedCarousel />
              ) : project.title === 'Commercial Fitout' ? (
                <CommercialCarousel />
              ) : project.title === 'Multi-Head Split System' ? (
                <MultiHeadCarousel />
              ) : project.title === 'JED in Action' ? (
                <JEDActionCarousel />
              ) : project.title === 'Apartment' ? (
                <ApartmentCarousel />
              ) : Array.isArray((project as any).images) && (project as any).images.length ? (
                <HoverCycle images={(project as any).images} alt={project.title} />
              ) : (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full aspect-[4/3] object-cover object-center"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full mb-2">
                  {project.type}
                </span>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-muted-foreground text-sm">{project.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsGallery;
