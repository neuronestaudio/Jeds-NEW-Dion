import { motion } from 'framer-motion';
// Marks cleaned by scripts/clean-brand-logos.mjs: ink on transparency, trimmed
// flush, 2x for HiDPI. The supplied files were screenshots of a white chip on a
// dark plate, which is why they used to render as a box inside a box.
// `?url` — under Astro a plain image import is a metadata object, not a string.
import daikin from '@/assets/brands-clean/daikin.png?url';
import haier from '@/assets/brands-clean/haier.png?url';
import fujitsu from '@/assets/brands-clean/fujitsu.png?url';
import mitsubishi from '@/assets/brands-clean/mitsubishi.png?url';
import panasonic from '@/assets/brands-clean/panasonic.png?url';
import samsung from '@/assets/brands-clean/samsung.png?url';
import lg from '@/assets/brands-clean/lg.png?url';
import carrier from '@/assets/brands-clean/carrier.png?url';
import toshiba from '@/assets/brands-clean/toshiba.png?url';
import hitachi from '@/assets/brands-clean/hitachi.png?url';
import actronair from '@/assets/brands-clean/actronair.png?url';
import braemar from '@/assets/brands-clean/braemar.png?url';

type Brand = {
  name: string;
  logo: string;
  /**
   * Optical size correction. Marks are trimmed to their own ink, so a
   * single CSS height renders a two-line lockup (Mitsubishi) far heavier than
   * a wide wordmark (Toshiba). These nudge each one back onto the same
   * apparent weight; 1 is the default box.
   */
  scale?: number;
};

const BRANDS: Brand[] = [
  { name: 'Daikin', logo: daikin },
  { name: 'Haier', logo: haier, scale: 0.86 },
  { name: 'Mitsubishi Electric', logo: mitsubishi, scale: 1.12 },
  { name: 'Fujitsu', logo: fujitsu, scale: 0.92 },
  { name: 'Panasonic', logo: panasonic },
  { name: 'Samsung', logo: samsung, scale: 0.94 },
  { name: 'LG', logo: lg, scale: 0.82 },
  { name: 'Carrier', logo: carrier },
  { name: 'Toshiba', logo: toshiba, scale: 0.96 },
  { name: 'Hitachi', logo: hitachi, scale: 0.96 },
  { name: 'ActronAir', logo: actronair },
  { name: 'Braemar', logo: braemar },
];

const SCROLL_DURATION_S = 40;

export function BrandsSection() {
  const copy = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {BRANDS.map((brand) => (
        <div key={`${brand.name}-${hidden ? 'b' : 'a'}`} className="mr-3 shrink-0 sm:mr-4">
          {/* Glass tile: translucent surface + blur so the wash behind shows
              through, a bright top edge and a darker rim so the panel has a
              findable edge on both themes. */}
          <div className="brand-tile flex h-[78px] min-w-[180px] items-center justify-center px-7 sm:h-[88px] sm:min-w-[204px] sm:px-8">
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              /* Brand colours on the light theme; one flat white silhouette on
                 the dark one, where navy and near-black marks would vanish.
                 The box is fixed (see .brand-logo) rather than sized by the
                 file, so a mark that has not decoded yet still holds its space
                 instead of collapsing the tile to nothing. */
              className="brand-logo dark:brightness-0 dark:invert"
              style={{ ['--logo-scale' as string]: brand.scale ?? 1 }}
              /* Eager: the strip sits directly under the hero, and a lazy mark
                 in the off-screen half of the marquee scrolls in blank. */
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Brands we install and service"
      className="relative isolate overflow-hidden border-y border-border/40 py-7 sm:py-9"
    >
      {/* Something for the glass to blur: a soft wash rather than flat colour. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_20%_0%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(50%_120%_at_85%_100%,hsl(var(--primary)/0.08),transparent_60%)] bg-muted/40 dark:bg-[linear-gradient(180deg,hsl(240_7%_8%),hsl(240_7%_6%))]"
      />
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
