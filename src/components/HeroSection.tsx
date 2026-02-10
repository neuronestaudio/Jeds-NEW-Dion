import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import jedLogo from '@/assets/Jedlogo.jpg';
import QuoteFormInline from '@/components/QuoteFormInline';
import daikinLogo from '@/assets/Daikin.png';
import haierLogo from '@/assets/Haier.png';

// Lazy load 3D component
const Hero3DCanvas = () => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  
  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGL(false);
      return;
    }
    
    // Dynamically import 3D component
    import('./Hero3D').then((mod) => {
      setComponent(() => mod.Hero3DCanvas);
    }).catch(() => {
      setHasWebGL(false);
    });
  }, []);

  if (!hasWebGL) {
    return <Hero3DFallback />;
  }

  if (!Component) {
    return <Hero3DFallback />;
  }

  return <Component />;
};

// Fallback for non-WebGL browsers
function Hero3DFallback() {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
      <div className="relative w-64 h-64 md:w-[500px] md:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          style={{ animation: 'spin 40s linear infinite' }}
        >
          <defs>
            <linearGradient id="heroSnowflakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(197, 47%, 58%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(197, 42%, 43%)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <g transform="translate(50, 50)" fill="none" stroke="url(#heroSnowflakeGradient)" strokeWidth="1.5">
            {[0, 45, 90, 135].map((angle) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <line x1="0" y1="-8" x2="0" y2="-42" />
                <line x1="0" y1="8" x2="0" y2="42" />
                <line x1="-10" y1="-30" x2="0" y2="-38" />
                <line x1="10" y1="-30" x2="0" y2="-38" />
                <line x1="-10" y1="30" x2="0" y2="38" />
                <line x1="10" y1="30" x2="0" y2="38" />
              </g>
            ))}
            <circle r="6" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export function HeroSection() {
  const HERO_VIDEO = import.meta.env.VITE_HERO_VIDEO_URL || '/hero-bg.mp4';
  // Prefer local bundled assets; fall back to remote SVGs if they fail to load
  const DAIKIN_LOGO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Daikin-Logo.svg';
  const HAIER_LOGO_FALLBACK = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Haier_logo.svg';
  const [videoError, setVideoError] = useState(false);
  const [play, setPlay] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPlay(true), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      
      {/* Background: Prefer video, fallback to 3D */}
      <div className="absolute inset-0 overflow-hidden">
        {videoError || !play ? (
          <Suspense fallback={<Hero3DFallback />}>
            <Hero3DCanvas />
          </Suspense>
        ) : (
          <video
            className={`w-full h-full object-cover transition-opacity duration-1000 ${videoVisible ? 'opacity-80' : 'opacity-0'}`}
            poster={jedLogo}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onError={() => setVideoError(true)}
            onLoadedData={() => setVideoVisible(true)}
            onCanPlay={() => setVideoVisible(true)}
            onPlay={() => setVideoVisible(true)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
            {/* Optional secondary source if provided in public */}
            <source src="/hero-bg.webm" type="video/webm" />
          </video>
        )}
      </div>
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Hero copy */}
          <div className="max-w-2xl text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs sm:text-sm font-medium mb-6 max-w-full"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="flex items-center gap-2 flex-wrap">
              Daikin & Haier Certified Dealer / Trained Service Agents
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-1.5 py-0.5 rounded-md text-foreground h-7 sm:h-8">
                <img
                  src={daikinLogo}
                  alt="Daikin logo"
                  className="h-5 sm:h-6 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                  width="72"
                  height="24"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = DAIKIN_LOGO_FALLBACK; }}
                />
                <img
                  src={haierLogo}
                  alt="Haier logo"
                  className="h-5 sm:h-6 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                  width="72"
                  height="24"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = HAIER_LOGO_FALLBACK; }}
                />
              </span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
          >
            Experts in <span className="text-gradient">Air Conditioning Servicing</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            Professional installation, service & repairs for residential and commercial properties. 
            5-year workmanship warranty on all installations.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-start mb-12"
          >
            <Button variant="hero" size="xl" asChild>
              <a href="/contact#quote" className="flex items-center gap-2">
                Get a Free Quote
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="tel:0434308070" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                0434 308 070
              </a>
            </Button>
          </motion.div>

          {/* Certification logos moved into badge above */}

          {/* Quick service selector removed per request */}
          </div>

          {/* Right: Inline quote form */}
          <div className="mt-6 lg:mt-0">
            <QuoteFormInline />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <a 
          href="#services" 
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs uppercase tracking-wider">Explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}

export default HeroSection;
