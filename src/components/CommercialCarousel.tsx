import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Auto-import all images in src/assets whose filename contains "Commercial" (case-insensitive)
const globbedCase = import.meta.glob('../assets/*Commercial*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const globbedLower = import.meta.glob('../assets/*commercial*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const rawEntries = [
  ...Object.entries(globbedCase),
  ...Object.entries(globbedLower),
];
// Sort by filename for stable order
rawEntries.sort((a, b) => a[0].localeCompare(b[0]));
const commercialImages = Array.from(new Set(rawEntries.map(([, v]) => v)));

// Fallback remote images if none present to avoid blank UI
const fallbackImages = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
];

const isUnsplashImage = (url: string) => url.startsWith('https://images.unsplash.com/');
const buildUnsplashSrcSet = (url: string) => {
  try {
    const widths = [400, 800, 1200];
    return widths
      .map((width) => {
        const u = new URL(url);
        u.searchParams.set('w', String(width));
        u.searchParams.set('auto', 'format');
        u.searchParams.set('fit', 'crop');
        return `${u.toString()} ${width}w`;
      })
      .join(', ');
  } catch {
    return undefined;
  }
};
const unsplashSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

export default function CommercialCarousel() {
  const images = commercialImages.length ? commercialImages : fallbackImages;

  // Align focal point to bottom-center (vertical 100%) for all images
  const positions = images.map(() => 'object-[50%_100%]');

  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const timer = useRef<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const start = () => {
    if (!api) return;
    if (timer.current) return;
    timer.current = window.setInterval(() => {
      api?.scrollNext();
    }, 1680);
  };
  const stop = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => () => stop(), []);
  useEffect(() => () => stop(), []);

  return (
    <div
      onMouseEnter={start}
      onMouseLeave={stop}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="absolute inset-0">
        <CarouselContent className="h-full cursor-grab active:cursor-grabbing select-none">
          {images.map((src, i) => (
            <CarouselItem
              key={i}
            >
              {(() => {
                const srcSet = isUnsplashImage(src) ? buildUnsplashSrcSet(src) : undefined;
                return (
                  <button
                    type="button"
                    aria-label={`Zoom commercial fitout ${i + 1}`}
                    className="group relative h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    onClick={() => {
                      if (api && !api.clickAllowed()) return;
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={src}
                      alt={`Commercial fitout ${i + 1}`}
                      className={`w-full h-full object-cover ${positions[i]}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={i === 0 ? "high" : "low"}
                      srcSet={srcSet}
                      sizes={srcSet ? unsplashSizes : undefined}
                      width={400}
                      height={300}
                    />
                  </button>
                );
              })()}
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Drag to scroll; arrows hidden intentionally */}
      </Carousel>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-[95vw] w-auto">
          <div className="flex items-center justify-center w-[95vw] h-[85vh]">
            <img
              src={images[lightboxIndex]}
              alt={`Commercial fitout ${lightboxIndex + 1} enlarged`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
