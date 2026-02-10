import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Auto-import JED in action local images
const globJedUpper = import.meta.glob('../assets/*JED*action*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const globJedMixed = import.meta.glob('../assets/*Jed*Action*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const rawEntries = [
  ...Object.entries(globJedUpper),
  ...Object.entries(globJedMixed),
];
rawEntries.sort((a, b) => a[0].localeCompare(b[0]));
const jedImages = Array.from(new Set(rawEntries.map(([, v]) => v)));

const fallbackImages = [
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
];

export default function JEDActionCarousel() {
  const images = jedImages.length ? jedImages : fallbackImages;
  const positions = images.map(() => 'object-center');

  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const timer = useRef<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const start = () => {
    if (!api) return;
    if (timer.current) return;
    timer.current = window.setInterval(() => {
      api?.scrollNext();
    }, 2800);
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
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
            >
              <img
                src={src}
                alt={`JED in action ${i + 1}`}
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
              alt={`JED in action ${lightboxIndex + 1} enlarged`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
