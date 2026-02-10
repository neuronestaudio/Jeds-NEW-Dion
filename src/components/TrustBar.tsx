import { Shield, Award, Clock, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const trustItems = [
  {
    icon: Award,
    label: 'Certified Technicians',
    sublabel: 'Licensed & Insured',
  },
  {
    icon: Wrench,
    label: 'Service Agents',
    sublabel: 'All Major Brands',
  },
  {
    icon: Shield,
    label: '5-Year Warranty',
    sublabel: 'On All Labour',
  },
  {
    icon: Clock,
    label: '10+ Years',
    sublabel: 'Experience',
  },
];

// General brands (exclude Daikin & Haier). Logos will be auto-detected from src/assets/brands
const brandItems = [
  { name: 'ActronAir', slug: 'actronair' },
  { name: 'Braemar', slug: 'braemar' },
  { name: 'Carrier', slug: 'carrier' },
  { name: 'Hitachi', slug: 'hitachi' },
  { name: 'LG', slug: 'lg' },
  { name: 'Mitsubishi Electric', slug: 'mitsubishi-electric' },
  { name: 'Panasonic', slug: 'panasonic' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Toshiba', slug: 'toshiba' },
  // Keep text-only if no logo provided yet
  { name: 'Fujitsu General', slug: 'fujitsu' },
] as const;

// Eagerly import any brand logos dropped into src/assets/brands
const logoModules = import.meta.glob('../assets/brands/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
// Also look in src/assets root to support existing logo placement
const logoModulesRoot = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const logoByFile: Record<string, string> = {};
for (const [path, url] of Object.entries({ ...logoModules, ...logoModulesRoot })) {
  const base = path.split('/').pop()?.toLowerCase() || '';
  logoByFile[base] = url;
}

function findLogo(slug: string, name: string): string | undefined {
  const normalizedSlug = slug.replace(/[^a-z0-9]/g, '').toLowerCase();
  const normalizedName = name.replace(/[^a-z0-9]/g, '').toLowerCase();
  for (const [base, url] of Object.entries(logoByFile)) {
    const b = base.replace(/[^a-z0-9]/g, '');
    if (b.includes(normalizedSlug) || b.includes(normalizedName)) return url;
  }
  return undefined;
}

export function TrustBar() {
  return (
    <section className="py-6 md:py-8 bg-card/50 border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm md:text-base text-foreground">{item.label}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{item.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* General brands chips (exclude Daikin & Haier). Auto-render logos when available. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
          aria-label="Brands we service"
        >
          <div className="overflow-x-auto">
            <div className="flex items-center gap-2 md:gap-3 whitespace-nowrap pb-1">
              {brandItems.map(({ name, slug }) => {
                const logo = findLogo(slug, name);
                return (
                  <span
                    key={name}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/40 bg-card/60 text-xs md:text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                    title={name}
                  >
                    {logo ? (
                      <img
                        src={logo}
                        alt={`${name} logo`}
                        className="h-6 md:h-8 w-auto object-contain"
                        loading="lazy"
                        decoding="async"
                        width={68}
                        height={24}
                      />
                    ) : (
                      <span className="font-medium">{name}</span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TrustBar;
