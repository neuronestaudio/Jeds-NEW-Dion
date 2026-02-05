import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const resolveAsset = (name: string) => new URL(`../assets/${name}`, import.meta.url).href;
const residentialImages = [
  'Residential 1.jpeg',
  'Residential 2.jpeg',
  'Residential 3.jpeg',
  'Residential 5.jpeg',
].map(resolveAsset);

export default function ResidentialCarousel() {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const timer = useRef<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const start = () => {
    if (!api) return;
    if (timer.current) return;
    timer.current = window.setInterval(() => {
      api?.scrollNext();
    }, 1200);
  };
  const stop = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => () => stop(), []);
  useEffect(() => {
    // Auto-play on touch devices where hover isn't available
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
          {residentialImages.map((src, i) => (
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
                alt={`Residential project ${i + 1}`}
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
            src={residentialImages[lightboxIndex]}
            alt={`Residential project ${lightboxIndex + 1} enlarged`}
            className="w-[95vw] max-w-5xl max-h-[85vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
