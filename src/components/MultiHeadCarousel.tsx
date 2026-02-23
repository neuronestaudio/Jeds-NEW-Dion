import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Attempt to auto-import local images that match common naming for multi-head split systems
const globMSCase = import.meta.glob('../assets/*MS*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const globMSLower = import.meta.glob('../assets/*ms*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const globMultiHead = import.meta.glob('../assets/*Multi*Head*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const rawEntries = [
  ...Object.entries(globMSCase),
  ...Object.entries(globMSLower),
  ...Object.entries(globMultiHead),
].filter(([path]) => !/samsung/i.test(path));
rawEntries.sort((a, b) => a[0].localeCompare(b[0]));
const multiHeadImages = Array.from(new Set(rawEntries.map(([, v]) => v)));

// Fallback remote images (replace with provided assets when available)
const fallbackImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
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

export default function MultiHeadCarousel() {
  const images = multiHeadImages.length ? multiHeadImages : fallbackImages;
  const positionClass = 'object-contain object-center';

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
                    aria-label={`Zoom multi-head split system ${i + 1}`}
                    className="group relative h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    onClick={() => {
                      if (api && !api.clickAllowed()) return;
                      setLightboxIndex(i);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={src}
                      alt={`Multi-head split system ${i + 1}`}
                      className={`w-full h-full ${positionClass}`}
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
      </Carousel>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-[95vw] w-auto">
          <div className="flex items-center justify-center w-[95vw] h-[85vh]">
            <img
              src={images[lightboxIndex]}
              alt={`Multi-head split system ${lightboxIndex + 1} enlarged`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
