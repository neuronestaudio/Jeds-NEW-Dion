import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

/**
 * "Our Recent Work" as two continuously-scrolling rows travelling in opposite
 * directions.
 *
 * Each row holds two identical copies of its tiles and slides by exactly -50%,
 * so copy 2 arrives where copy 1 started and the loop never seams. Tiles carry
 * a right margin rather than the track carrying `gap`, because a gap would make
 * the track an odd half-gap wider than twice a copy and the loop would jump.
 *
 * Hovering anywhere in a strip pauses both rows (see .marquee-strip in
 * index.css) so a moving tile can actually be clicked.
 */

// Resolved through import.meta.glob rather than `new URL(..., import.meta.url)`
// so the server render and the browser agree on the asset URL — the URL form
// resolves against a file:// path during Astro's build.
const assetModules = import.meta.glob('../assets/*.{jpeg,jpg,png}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;
const resolveAsset = (name: string) => assetModules[`../assets/${name}`] ?? '';

type Tile = {
  file: string;
  title: string;
  location: string;
  type: 'Residential' | 'Commercial';
};

const ROW_ONE: Tile[] = [
  { file: 'Residential 1.jpeg', title: 'Modern Home Split System', location: 'Parramatta', type: 'Residential' },
  { file: 'MS 1.jpeg', title: 'Multi-Head Split System', location: 'Bondi', type: 'Residential' },
  { file: 'Ducted system install 1.jpeg', title: 'Ducted System Installation', location: 'Castle Hill', type: 'Residential' },
  { file: 'Residential 2.jpeg', title: 'Modern Home Split System', location: 'Parramatta', type: 'Residential' },
  { file: 'MS 2.jpeg', title: 'Multi-Head Split System', location: 'Bondi', type: 'Residential' },
  { file: 'Residential 3.jpeg', title: 'Modern Home Split System', location: 'Parramatta', type: 'Residential' },
  { file: 'Ducted system install 2.jpeg', title: 'Ducted System Installation', location: 'Castle Hill', type: 'Residential' },
  { file: 'MS 3.jpeg', title: 'Multi-Head Split System', location: 'Bondi', type: 'Residential' },
  { file: 'Residential 5.jpeg', title: 'Modern Home Split System', location: 'Parramatta', type: 'Residential' },
  { file: 'Residential 6.jpeg', title: 'Modern Home Split System', location: 'Parramatta', type: 'Residential' },
];

const ROW_TWO: Tile[] = [
  { file: 'Commercial 1.jpeg', title: 'Commercial Fitout', location: 'North Sydney', type: 'Commercial' },
  { file: 'Apartment 1.jpeg', title: 'Apartment HVAC Fitout — Daikin VRV / VRF', location: 'Chatswood', type: 'Commercial' },
  { file: 'JED action 1.jpeg', title: 'JED in Action', location: 'Western Sydney', type: 'Commercial' },
  { file: 'Commercial 2.jpeg', title: 'Commercial Fitout', location: 'North Sydney', type: 'Commercial' },
  { file: 'Apartment 2.jpeg', title: 'Apartment HVAC Fitout — Daikin VRV / VRF', location: 'Chatswood', type: 'Commercial' },
  { file: 'Commercial 3.jpeg', title: 'Commercial Fitout', location: 'North Sydney', type: 'Commercial' },
  { file: 'Jed Action 2.jpeg', title: 'JED in Action', location: 'Western Sydney', type: 'Commercial' },
  { file: 'commercial 4.jpeg', title: 'Commercial Fitout', location: 'North Sydney', type: 'Commercial' },
  { file: 'Commercial.jpeg', title: 'Commercial Fitout', location: 'North Sydney', type: 'Commercial' },
];

function MarqueeTile({ tile, onOpen }: { tile: Tile; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Enlarge ${tile.title}, ${tile.location}`}
      className="group/tile relative mr-4 w-[240px] shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-border/30 transition-colors duration-300 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:mr-5 sm:w-[300px] lg:w-[360px]"
    >
      <img
        src={resolveAsset(tile.file)}
        alt={`${tile.title} — ${tile.location}`}
        loading="lazy"
        decoding="async"
        width={360}
        height={270}
        className="aspect-[4/3] w-full object-cover object-[50%_100%] transition-transform duration-500 group-hover/tile:scale-[1.04]"
      />

      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/25 to-transparent opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100" />

      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-300 group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
        <span className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
          {tile.type}
        </span>
        <span className="block truncate text-sm font-semibold">{tile.title}</span>
        <span className="block text-xs text-muted-foreground">{tile.location}</span>
      </span>
    </button>
  );
}

function MarqueeRow({
  tiles,
  direction,
  duration,
  onOpen,
}: {
  tiles: Tile[];
  direction: 'left' | 'right';
  duration: number;
  onOpen: (tile: Tile) => void;
}) {
  const copy = (hidden: boolean) => (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {tiles.map((tile, i) => (
        <MarqueeTile key={`${tile.file}-${i}`} tile={tile} onOpen={() => onOpen(tile)} />
      ))}
    </div>
  );

  return (
    <div
      className={`marquee-track flex w-max ${
        direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
      }`}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      {copy(false)}
      {copy(true)}
    </div>
  );
}

export function WorkMarquee() {
  const [active, setActive] = useState<Tile | null>(null);

  return (
    <>
      {/* overflow-hidden is load-bearing: the tracks are `w-max` and several
          thousand pixels wide, so without it the whole document scrolls
          sideways on mobile. Slightly different speeds per row stop the two
          drifting in lockstep. */}
      <div className="marquee-strip marquee-mask flex flex-col gap-4 overflow-hidden sm:gap-5">
        <MarqueeRow tiles={ROW_ONE} direction="left" duration={70} onOpen={setActive} />
        <MarqueeRow tiles={ROW_TWO} direction="right" duration={85} onOpen={setActive} />
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="w-auto max-w-[95vw] border-none bg-transparent p-0 shadow-none">
          <div className="flex h-[85vh] w-[95vw] flex-col items-center justify-center gap-4">
            {active && (
              <>
                <img
                  src={resolveAsset(active.file)}
                  alt={`${active.title} — ${active.location} enlarged`}
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
                <p className="text-center text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{active.title}</span>
                  {' · '}
                  {active.location}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default WorkMarquee;
