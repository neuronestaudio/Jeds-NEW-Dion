import { useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const resolveAsset = (name: string) => new URL(`../assets/${name}`, import.meta.url).href;
const ductedImages = [
  'Ducted system install 1.jpeg',
  'Ducted system install 2.jpeg',
].map(resolveAsset);
const positions = [
  'object-[50%_100%]',
  'object-[50%_100%]',
];

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
              src={ductedImages[lightboxIndex]}
              alt={`Ducted system install ${lightboxIndex + 1} enlarged`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
