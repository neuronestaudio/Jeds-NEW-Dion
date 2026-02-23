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
            >
              <button
                type="button"
                aria-label={`Zoom residential project ${i + 1}`}
                className="group relative h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => {
                  if (api && !api.clickAllowed()) return;
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={src}
                  alt={`Residential project ${i + 1}`}
                  className={`w-full h-full object-cover ${positions[i]}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "low"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  width={400}
                  height={300}
                />
              </button>
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
