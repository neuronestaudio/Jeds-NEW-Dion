import { motion } from 'framer-motion';
import daikinLogo from '@/assets/Daikin.png';
import haierLogo from '@/assets/Haier.png';

// Eagerly import brand logos placed under src/assets/brands
const logoModules = import.meta.glob('../assets/brands/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const logoByFile: Record<string, string> = {};
for (const [path, url] of Object.entries(logoModules)) {
  const base = path.split('/').pop()?.toLowerCase() || '';
  logoByFile[base] = url;
}

function findLogo(slug: string, name: string): string | undefined {
  const exactCandidates = [
    `${slug}.png`,
    `${slug}.jpg`,
    `${slug}.jpeg`,
    `${slug}.svg`,
    `${slug}.webp`,
  ];
  for (const file of exactCandidates) {
    if (logoByFile[file]) return logoByFile[file];
  }
  const normalizedSlug = slug.replace(/[^a-z0-9]/g, '').toLowerCase();
  const normalizedName = name.replace(/[^a-z0-9]/g, '').toLowerCase();
  for (const [base, url] of Object.entries(logoByFile)) {
    const b = base.replace(/[^a-z0-9]/g, '');
    if (b.includes(normalizedSlug) || b.includes(normalizedName)) return url;
  }
  return undefined;
}

// Featured hero brands with local approved logos (Daikin & Haier)
// General brands below will try to use matching logos from src/assets/brands
const brands = [
  { name: 'Daikin', featured: true, logo: daikinLogo },
  { name: 'Haier', featured: true, logo: haierLogo },
  // Trusted brands we work with (exact filename match preferred)
  { name: 'Fujitsu', featured: false },
  { name: 'Mitsubishi', featured: false },
  { name: 'Panasonic', featured: false },
  { name: 'Samsung', featured: false },
  { name: 'LG', featured: false },
  { name: 'Carrier', featured: false },
  { name: 'Toshiba', featured: false },
  { name: 'Hitachi', featured: false },
  { name: 'ActronAir', featured: false },
  { name: 'Braemar', featured: false },
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
                aria-label={brand.featured ? `${brand.name} (featured)` : brand.name}
              >
                <div className="flex items-center justify-center min-w-[140px]">
                  {(() => {
                    const slug = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const autoLogo = brand.logo || findLogo(slug, brand.name);
                    return autoLogo ? (
                      <img
                        src={autoLogo}
                        alt={`${brand.name} logo`}
                        className="h-8 md:h-10 w-auto object-contain"
                        loading="lazy"
                        decoding="async"
                        width="100"
                        height="40"
                      />
                    ) : (
                      <span className="font-medium text-sm md:text-base">{brand.name}</span>
                    );
                  })()}
                </div>
                {brand.featured && (
                  <span className="block text-xs mt-1 opacity-80">Certified Dealer & Service Agents</span>
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
