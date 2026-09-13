import { useState, type CSSProperties } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

/**
 * "Our Recent Work" as two continuously-scrolling rows of full-bleed,
 * contiguous diagonal panels — a detailing-studio gallery wall, not rounded
 * cards in a carousel. Geometry lives in .wgallery* (index.css), the same
 * skew-the-box / counter-skew-the-photo technique as ServicePathways.
 *
 * Each row holds two identical copies of its tiles and slides by exactly -50%,
 * so copy 2 arrives where copy 1 started and the loop never seams. Panels
 * touch edge to edge (a 1px negative margin kills the anti-aliasing seam,
 * not a real gap) — a `gap` would make the track an odd half-gap wider than
 * twice a copy and the loop would jump.
 *
 * Hovering anywhere in a strip pauses both rows (see .marquee-strip in
 * index.css) so a moving panel can actually be clicked.
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
      className="wgallery__panel"
      style={{ ['--img' as string]: `url("${resolveAsset(tile.file)}")` } as CSSProperties}
    >
      {/* The image is a background on a counter-skewed layer, not an <img> —
          object-fit can't be skew-compensated with a scale offset the way a
          plain background-image can. */}
      <span className="wgallery__img" aria-hidden="true" />
      <span className="wgallery__cap">
        <span className="wgallery__cap-inner">
          <span className="wgallery__cap-type">{tile.type}</span>
          <span className="wgallery__cap-loc">{tile.location}</span>
        </span>
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
      className={`marquee-track wgallery flex w-max ${
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
      {/* No mask this time: a masked fade reads as a card carousel with soft
          edges; a full-bleed gallery wall of contiguous panels should run
          flush to both edges of the viewport instead. */}
      <div className="marquee-strip flex flex-col gap-1 overflow-hidden sm:gap-1.5">
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
