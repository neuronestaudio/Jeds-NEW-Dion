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
const positions = [
  'object-[50%_100%]',
  'object-[50%_100%]',
  'object-[50%_100%]',
  'object-[50%_100%]',
];

export default function ResidentialCarousel() {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const timer = useRef<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const start = () => {
    if (!api) return;
    if (timer.current) return;
    timer.current = window.setInterval(() => {
      api?.scrollNext();
    }, 1440);
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
          {residentialImages.map((src, i) => (
            <CarouselItem
              key={i}
              className="cursor-zoom-in"
              onPointerDown={(e) => {
                pointerStart.current = { x: e.clientX, y: e.clientY };
                dragged.current = false;
              }}
              onPointerMove={(e) => {
                if (!pointerStart.current) return;
                const dx = e.clientX - pointerStart.current.x;
                const dy = e.clientY - pointerStart.current.y;
                if (Math.hypot(dx, dy) > 8) dragged.current = true;
              }}
              onPointerUp={() => {
                if (!dragged.current) {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }
                pointerStart.current = null;
                dragged.current = false;
              }}
              onPointerCancel={() => {
                pointerStart.current = null;
                dragged.current = false;
              }}
            >
              <img
                src={src}
                alt={`Residential project ${i + 1}`}
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
              src={residentialImages[lightboxIndex]}
              alt={`Residential project ${lightboxIndex + 1} enlarged`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
