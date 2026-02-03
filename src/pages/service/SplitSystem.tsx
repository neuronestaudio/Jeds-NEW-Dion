import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import QuoteForm from '@/components/QuoteForm';

const SplitSystem = () => {
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Split System Installation',
    provider: { '@type': 'LocalBusiness', name: 'JED Airconditioning' },
    areaServed: { '@type': 'City', name: 'Sydney' },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Services', item: 'https://jedairconditioning.com.au/services' },
      { '@type': 'ListItem', position: 2, name: 'Split System Installation', item: 'https://jedairconditioning.com.au/service/split-system-installation' },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Split System Air Conditioning Installation | Sydney</title>
        <meta name="description" content="Energy-efficient split system air conditioning installation across Sydney. Professional advice and warranty-backed workmanship." />
        <link rel="canonical" href="https://jedairconditioning.com.au/service/split-system-installation" />
        <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Split System Air Conditioning Installation in Sydney</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mb-10">We install efficient split systems tailored to your space and budget. Get expert guidance on sizing and placement to maximize comfort and savings.</p>
          <div className="glass-card p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Split Systems?</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Cost-effective for individual rooms</li>
              <li>Fast installation with minimal disruption</li>
              <li>Quiet, efficient operation with modern inverter technology</li>
            </ul>
          </div>
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Request a Quote</h2>
            <QuoteForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SplitSystem;
