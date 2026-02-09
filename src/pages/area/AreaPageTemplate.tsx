import { Helmet } from 'react-helmet-async';
import QuoteForm from '@/components/QuoteForm';

type Props = {
  city: string;
  slug: string;
  blurb?: string;
};

export default function AreaPageTemplate({ city, slug, blurb }: Props) {
  const title = `Air Conditioning Services in ${city} | JED Air Conditioning`;
  const description = blurb || `Installation, service and repairs in ${city}. Daikin & Haier certified dealer and manufacturer‑trained service agents.`;
  const canonical = `https://www.jedairconditioning.com.au/service-area/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'JED Air Conditioning',
    url: canonical,
    areaServed: city,
    makesOffer: [
      { '@type': 'Service', name: 'Split System Installation' },
      { '@type': 'Service', name: 'Ducted Air Conditioning' },
      { '@type': 'Service', name: 'Aircon Repair & Diagnostics' }
    ],
    brand: [
      { '@type': 'Brand', name: 'Daikin' },
      { '@type': 'Brand', name: 'Haier' }
    ]
  };

  return (
    <div className="py-16 md:py-24 container mx-auto px-4">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Air Conditioning in {city}</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Daikin & Haier certified dealer and manufacturer‑trained service agents. We install, service,
        and repair systems in {city} with fast turnaround and genuine parts.
      </p>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="font-semibold mb-2">What we do</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Split system and ducted installations</li>
            <li>• Manufacturer‑approved servicing and diagnostics</li>
            <li>• Rapid repairs with genuine parts</li>
            <li>• Residential and commercial</li>
          </ul>
        </div>
        <div>
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
