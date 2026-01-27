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
import QuoteForm from '@/components/QuoteForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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

      {/* Secondary conversion - quote form at bottom */}
      <QuoteForm />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
