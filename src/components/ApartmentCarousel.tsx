import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Auto-import Apartment images (case-insensitive) e.g., "Apartment 1.jpeg", "apartment-2.png"
const globbedCase = import.meta.glob('../assets/*Apartment*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const globbedLower = import.meta.glob('../assets/*apartment*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const rawEntries = [
  ...Object.entries(globbedCase),
  ...Object.entries(globbedLower),
];
rawEntries.sort((a, b) => a[0].localeCompare(b[0]));
const apartmentImages = Array.from(new Set(rawEntries.map(([, v]) => v)));

// Fallback remote images until assets are present
const fallbackImages = [
  'https://images.unsplash.com/photo-1600585154160-4f3d78b2b151?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531788989007-9f0955d91f6f?w=800&auto=format&fit=crop',
];

export default function ApartmentCarousel() {
  const images = apartmentImages.length ? apartmentImages : fallbackImages;
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
    }, 2240); // match site-wide cadence (hover-only, faster by 25%)
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
              className="cursor-zoom-in"
              onClick={() => {
                if (api && !api.clickAllowed()) return;
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
            >
              <img
                src={src}
                alt={`Apartment install ${i + 1}`}
                className={`w-full h-full object-cover ${positions[i]}`}
                loading="lazy"
                decoding="async"
                width={400}
                height={300}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-[95vw] w-auto">
          <div className="flex items-center justify-center w-[95vw] h-[85vh]">
            <img
              src={images[lightboxIndex]}
              alt={`Apartment install ${lightboxIndex + 1} enlarged`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
