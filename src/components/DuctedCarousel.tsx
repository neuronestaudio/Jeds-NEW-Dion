import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const resolveAsset = (name: string) => new URL(`../assets/${name}`, import.meta.url).href;
const ductedImages = [
  'Ducted system install 1.jpeg',
  'Ducted system install 2.jpeg',
].map(resolveAsset);

export default function DuctedCarousel() {
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
        <CarouselContent className="h-full">
          {ductedImages.map((src, i) => (
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
                alt={`Ducted system install ${i + 1}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                decoding="async"
                width={400}
                height={300}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-2 md:-left-3 top-1/2 -translate-y-1/2" />
        <CarouselNext className="hidden sm:flex -right-2 md:-right-3 top-1/2 -translate-y-1/2" />
      </Carousel>
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-[95vw]">
          <img
            src={ductedImages[lightboxIndex]}
            alt={`Ducted system install ${lightboxIndex + 1} enlarged`}
            className="w-[95vw] max-w-5xl max-h-[85vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
