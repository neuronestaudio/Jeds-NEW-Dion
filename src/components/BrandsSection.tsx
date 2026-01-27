import { motion } from 'framer-motion';

// Brand logos would be replaced with actual brand assets
const brands = [
  { name: 'Daikin', featured: true },
  { name: 'Haier', featured: false, note: 'We install and service Haier systems' },
  { name: 'Mitsubishi Electric', featured: false },
  { name: 'Fujitsu', featured: false },
  { name: 'Samsung', featured: false },
  { name: 'LG', featured: false },
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
            Trusted Brands We Work With
          </h3>
          <p className="text-primary font-bold text-xl">
            Daikin Certified Dealer
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`flex flex-col items-center ${brand.featured ? 'order-first' : ''}`}
            >
              <div 
                className={`px-6 py-4 rounded-xl border transition-colors ${
                  brand.featured 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-card/50 border-border/30 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                <span className={`font-semibold ${brand.featured ? 'text-lg' : 'text-base'}`}>
                  {brand.name}
                </span>
                {brand.featured && (
                  <span className="block text-xs mt-1 opacity-80">Certified Dealer</span>
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
