import { motion } from 'framer-motion';
import daikinLogo from '@/assets/Daikin.png?url';
import haierLogo from '@/assets/Haier.png?url';
import fujitsuLogo from '@/assets/brands/fujitsu.jpg?url';

// Eagerly import brand logos placed under src/assets/brands.
// `query: '?url'` — under Astro a plain image import is a metadata object.
const logoModules = import.meta.glob('../assets/brands/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
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
  { name: 'Fujitsu', featured: false, logo: fujitsuLogo },
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

const SCROLL_DURATION_S = 34;

export function BrandsSection() {
  const brandTiles = brands.map((brand) => {
    const slug = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return {
      ...brand,
      logo: brand.logo || findLogo(slug, brand.name),
    };
  });

  const copy = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {brandTiles.map((brand) => (
        <div key={`${brand.name}-${hidden ? 'b' : 'a'}`} className="mr-3 shrink-0 sm:mr-4 lg:mr-5">
          <div className="flex h-16 min-w-[140px] items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] px-5 shadow-[0_14px_30px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:h-[72px] sm:min-w-[160px] sm:px-6">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-7 w-auto object-contain opacity-90 sm:h-8"
                loading="lazy"
                decoding="async"
                width="110"
                height="32"
              />
            ) : (
              <span className="text-sm font-medium tracking-[0.16em] text-foreground/80 uppercase">{brand.name}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="border-y border-border/30 bg-[linear-gradient(180deg,rgba(9,14,20,0.72),rgba(9,14,20,0.28))] py-5 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="marquee-strip marquee-mask overflow-hidden"
      >
        <div
          className="marquee-track flex w-max animate-marquee-left"
          style={{ ['--marquee-duration' as string]: `${SCROLL_DURATION_S}s` }}
        >
          {copy(false)}
          {copy(true)}
        </div>
      </motion.div>
    </section>
  );
}

export default BrandsSection;
