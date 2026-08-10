import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import ServicePathways from '@/components/ServicePathways';
import ServicesGrid from '@/components/ServicesGrid';
import BrandsSection from '@/components/BrandsSection';
import ProjectsGallery from '@/components/ProjectsGallery';
import SocialReels from '@/components/SocialReels';
import WhyChooseUs from '@/components/WhyChooseUs';
import ProcessSection from '@/components/ProcessSection';
import ReviewsSection from '@/components/ReviewsSection';
// Removed standalone QuoteForm since it's now inline in hero
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Daikin & Haier Air Conditioning Installation Sydney | JED Air Conditioning</title>
        <meta name="description" content="Authorised Daikin & Haier installation specialists in Sydney. Professional ducted & split system air conditioning installs, service & repairs. Get a free quote now." />
        <link rel="canonical" href="https://jedairconditioning.com.au/" />
        <meta property="og:title" content="JED Air Conditioning | Sydney Air Conditioning Specialists" />
        <meta property="og:description" content="Daikin certified dealer. Professional installation, repairs & maintenance. 5-year workmanship warranty." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_AU" />
        <meta property="og:image" content="https://jedairconditioning.com.au/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://jedairconditioning.com.au/og-image.png" />
        <script type="application/ld+json">
          {`
            {
              "@context":"https://schema.org",
              "@type":"LocalBusiness",
              "name":"JED Air Conditioning",
              "telephone":"+61434308070",
              "email":"JED_AIR@outlook.com",
              "address":{"@type":"PostalAddress","addressLocality":"Sydney","addressRegion":"NSW","addressCountry":"AU"},
              "areaServed":{"@type":"City","name":"Sydney"},
              "priceRange":"$$"
            }
          `}
        </script>
      </Helmet>
      <Header />
      
      {/* Hero */}
      <HeroSection />

      {/* Brand credibility strip directly after hero */}
      <BrandsSection />

      {/* Clear pathways for user decision */}
      <ServicePathways />
      
      {/* Social proof after service pathways */}
      <ReviewsSection />

      {/* Trust signals beneath reviews */}
      <TrustBar />
      
      {/* Detailed services grid */}
      <ServicesGrid />
      
      {/* Featured projects */}
      <ProjectsGallery />

      {/* Instagram reels - the team and jobs on camera */}
      <SocialReels />

      {/* Why choose us - trust building */}
      <WhyChooseUs />
      
      {/* Process explanation */}
      <ProcessSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
