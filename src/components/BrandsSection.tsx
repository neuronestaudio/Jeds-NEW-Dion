import { motion } from 'framer-motion';

// Show only logos for Daikin and Haier
const brands = [
  { name: 'Daikin', logo: 'https://www.clipartmax.com/png/middle/83-836729_lopez-refrigeration-airconditioning-logo-daikin-png.png' },
  { name: 'Haier', logo: 'https://i.pinimg.com/736x/48/08/48/480848b5bb5e5cede91ee85dd253b176.jpg' },
];

export function BrandsSection() {
  return (
    <section className="py-12 md:py-16 bg-card/20 border-y border-border/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            Daikin & Haier
          </h3>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="px-6 py-4 rounded-xl border bg-card/50 border-border/30">
                {brand.logo && (
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="h-10 w-auto object-contain rounded"
                    loading="lazy"
                    decoding="async"
                    width="80"
                    height="40"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandsSection;
