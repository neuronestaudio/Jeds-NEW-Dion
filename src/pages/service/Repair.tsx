import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import QuoteForm from '@/components/QuoteForm';

const Repair = () => {
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Air Conditioning Repair',
    provider: { '@type': 'LocalBusiness', name: 'JED Airconditioning' },
    areaServed: { '@type': 'City', name: 'Sydney' },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Services', item: 'https://jedairconditioning.com.au/services' },
      { '@type': 'ListItem', position: 2, name: 'Air Conditioning Repairs', item: 'https://jedairconditioning.com.au/service/aircon-repair' },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do you offer emergency repairs?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We provide rapid response for urgent breakdowns across Sydney.'
        }
      },
      {
        '@type': 'Question',
        name: 'What brands do you repair?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We service and repair most major brands, including Daikin and Haier.'
        }
      },
      {
        '@type': 'Question',
        name: 'Should I repair or replace?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We diagnose the issue and provide repair vs replace advice based on age, condition, and cost-effectiveness.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Air Conditioning Repairs & Maintenance | Sydney</title>
        <meta name="description" content="Fast, reliable air conditioning repairs and maintenance across Sydney. Diagnostics for all major brands." />
        <link rel="canonical" href="https://jedairconditioning.com.au/service/aircon-repair" />
        <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Air Conditioning Repairs in Sydney</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mb-10">We diagnose and fix common AC issues quickly: leaks, electrical faults, airflow, thermostat problems, and more.</p>
          <div className="glass-card p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4">Common Faults We Fix</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>No cooling or heating</li>
              <li>Unusual noises or vibrations</li>
              <li>Water leaks and drainage issues</li>
            </ul>
          </div>
          <div className="glass-card p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold">Do you offer emergency repairs?</h3>
                <p>Yes. We provide rapid response for urgent breakdowns across Sydney.</p>
              </div>
              <div>
                <h3 className="font-semibold">What brands do you repair?</h3>
                <p>We service and repair most major brands, including Daikin and Haier.</p>
              </div>
              <div>
                <h3 className="font-semibold">Should I repair or replace?</h3>
                <p>We diagnose the issue and provide repair vs replace advice based on age, condition, and cost-effectiveness.</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Request a Repair</h2>
            <QuoteForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Repair;
