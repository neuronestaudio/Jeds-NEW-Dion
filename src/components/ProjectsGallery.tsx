import { motion } from 'framer-motion';

// Placeholder project images - these would be replaced with actual project photos
const projects = [
  {
    id: 1,
    title: 'Modern Home Split System',
    location: 'Parramatta',
    type: 'Residential',
    image: 'https://images.unsplash.com/photo-1631545806609-35d4ae440431?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Office Fit-out',
    location: 'North Sydney',
    type: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
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
    title: 'Retail Space Cooling',
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
    title: 'Warehouse Climate Control',
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
              <img
                src={project.image}
                alt={project.title}
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
