import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

const resolveAsset = (name: string) => new URL(`../assets/${name}`, import.meta.url).href;
const residentialImages = [
  'Residential 1.jpeg',
  'Residential 2.jpeg',
  'Residential 3.jpeg',
  'Residential 5.jpeg',
  'Residential 6.jpeg',
].map(resolveAsset);

export default function ResidentialCarousel() {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const timer = useRef<number | null>(null);

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
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted"
    >
      <Carousel setApi={setApi} className="absolute inset-0">
        <CarouselContent className="h-full">
          {residentialImages.map((src, i) => (
            <CarouselItem key={i} className="">
              <img
                src={src}
                alt={`Residential project ${i + 1}`}
                className="w-full h-full object-contain object-center"
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
    </div>
  );
}
