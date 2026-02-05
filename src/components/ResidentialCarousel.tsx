import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

const resolveAsset = (name: string) => new URL(`../assets/${name}`, import.meta.url).href;
const residentialImages = [
  'Residential 1.jpeg',
  'Residential 2.jpeg',
  'Residential 3.jpeg',
  'Residential 4.jpeg',
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

  return (
    <div onMouseEnter={start} onMouseLeave={stop} onTouchStart={start} onTouchEnd={stop}>
      <Carousel setApi={setApi} className="relative">
        <CarouselContent className="aspect-[4/3]">
          {residentialImages.map((src, i) => (
            <CarouselItem key={i} className="">
              <img
                src={src}
                alt={`Residential project ${i + 1}`}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
                decoding="async"
                width={400}
                height={300}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 top-1/2 -translate-y-1/2" />
        <CarouselNext className="-right-3 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}
