import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import QuoteForm from '@/components/QuoteForm';

const SplitSystem = () => {
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Split System Installation',
    provider: { '@type': 'LocalBusiness', name: 'JED Air Conditioning' },
    areaServed: { '@type': 'City', name: 'Sydney' },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Services', item: 'https://www.jedairconditioning.com.au/services' },
      { '@type': 'ListItem', position: 2, name: 'Split System Installation', item: 'https://www.jedairconditioning.com.au/service/split-system-installation' },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long does a split system installation take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most installations are completed within a day, depending on unit size and placement.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you help with sizing and placement?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We assess your room size and layout to recommend the right capacity and optimal wall location.'
        }
      },
      {
        '@type': 'Question',
        name: 'What brands do you install?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We install leading brands including Daikin and Haier, tailored to your budget and preferences.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Split System Air Conditioning Installation | Sydney</title>
        <meta name="description" content="Energy-efficient split system air conditioning installation across Sydney. Professional advice and warranty-backed workmanship." />
        <link rel="canonical" href="https://www.jedairconditioning.com.au/service/split-system-installation" />
        <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
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
          <div className="glass-card p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold">How long does a split system installation take?</h3>
                <p>Most installations are completed within a day, depending on unit size and placement.</p>
              </div>
              <div>
                <h3 className="font-semibold">Do you help with sizing and placement?</h3>
                <p>Yes. We assess your room size and layout to recommend the right capacity and optimal wall location.</p>
              </div>
              <div>
                <h3 className="font-semibold">What brands do you install?</h3>
                <p>We install leading brands including Daikin and Haier, tailored to your budget and preferences.</p>
              </div>
            </div>
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
