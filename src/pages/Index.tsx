import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import ServicePathways from '@/components/ServicePathways';
import ServicesGrid from '@/components/ServicesGrid';
import BrandsSection from '@/components/BrandsSection';
import ProjectsGallery from '@/components/ProjectsGallery';
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
        <link rel="canonical" href="https://www.jedairconditioning.com.au/" />
        <meta property="og:title" content="JED Air Conditioning | Sydney Air Conditioning Specialists" />
        <meta property="og:description" content="Daikin certified dealer. Professional installation, repairs & maintenance. 5-year workmanship warranty." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_AU" />
        <meta property="og:image" content="https://jedairconditioning.com.au/favicon-512.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://jedairconditioning.com.au/favicon-512.png" />
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
      
      {/* Hero with 3D animation */}
      <HeroSection />
      
      {/* Trust signals immediately after hero */}
      <TrustBar />
      
      {/* Clear pathways for user decision */}
      <ServicePathways />
      
      {/* Brand credibility */}
      <BrandsSection />
      
      {/* Detailed services grid */}
      <ServicesGrid />
      
      {/* Featured projects */}
      <ProjectsGallery />
      
      {/* Why choose us - trust building */}
      <WhyChooseUs />
      
      {/* Process explanation */}
      <ProcessSection />
      
      {/* Social proof */}
      <ReviewsSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
