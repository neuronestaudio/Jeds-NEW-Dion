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

export default function CommercialCarousel() {
  const images = commercialImages.length ? commercialImages : fallbackImages;

  const positions = images.map((_, i) => 'object-center');
  if (positions.length) {
    if (positions[0] !== undefined) positions[0] = 'object-[40%_50%]';
    if (positions[1] !== undefined) positions[1] = 'object-[60%_50%]';
    if (positions[2] !== undefined) positions[2] = 'object-center';
    if (positions[3] !== undefined) positions[3] = 'object-[50%_45%]';
    if (positions[4] !== undefined) positions[4] = 'object-[50%_55%]';
    if (positions[5] !== undefined) positions[5] = 'object-center';
  }

  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const timer = useRef<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const start = () => {
    if (!api) return;
    if (timer.current) return;
    timer.current = window.setInterval(() => {
      api?.scrollNext();
    }, 1400);
  };
  const stop = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => () => stop(), []);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      start();
      return () => stop();
    }
  }, [api]);

  return (
    <div
      onMouseEnter={start}
      onMouseLeave={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
    >
      <Carousel setApi={setApi} className="absolute inset-0">
        <CarouselContent className="h-full cursor-grab active:cursor-grabbing select-none">
          {images.map((src, i) => (
            <CarouselItem
              key={i}
              className="cursor-zoom-in"
              onClick={() => {
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
            >
              <img
                src={src}
                alt={`Commercial fitout ${i + 1}`}
                className={`w-full h-full object-cover ${positions[i]}`}
                loading="lazy"
                decoding="async"
                width={400}
                height={300}
              />
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
