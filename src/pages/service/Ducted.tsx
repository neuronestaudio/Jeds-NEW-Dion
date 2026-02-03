import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import QuoteForm from '@/components/QuoteForm';

const Ducted = () => {
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Ducted Air Conditioning',
    provider: { '@type': 'LocalBusiness', name: 'JED Airconditioning' },
    areaServed: { '@type': 'City', name: 'Sydney' },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Services', item: 'https://jedairconditioning.com.au/services' },
      { '@type': 'ListItem', position: 2, name: 'Ducted Air Conditioning', item: 'https://jedairconditioning.com.au/service/ducted-air-conditioning' },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Ducted Air Conditioning Installation & Upgrades | Sydney</title>
        <meta name="description" content="Whole-home ducted air conditioning installation and upgrades in Sydney. Discreet, powerful climate control with professional design." />
        <link rel="canonical" href="https://jedairconditioning.com.au/service/ducted-air-conditioning" />
        <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Ducted Air Conditioning in Sydney</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mb-10">Enjoy seamless comfort throughout your home with custom-designed ducted systems. We manage design, installation, and commissioning.</p>
          <div className="glass-card p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4">Benefits of Ducted Systems</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Whole-home climate control</li>
              <li>Discreet vents and minimal visual impact</li>
              <li>Zoning options for energy efficiency</li>
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

export default Ducted;
