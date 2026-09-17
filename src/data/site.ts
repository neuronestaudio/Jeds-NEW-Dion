export const SITE = {
  name: 'JED Air Conditioning',
  // www is the primary domain on Vercel — the apex 308s to it — so every
  // canonical, sitemap URL and JSON-LD @id must use www or they point at a redirect.
  url: 'https://www.jedairconditioning.com.au',
  phoneDisplay: '0434 308 070',
  phoneTel: 'tel:0434308070',
  phoneE164: '+61434308070',
  email: 'JED_AIR@outlook.com',
  hoursDisplay: 'Mon–Sat: 7am – 6pm',
  ogImage: '/og-image.png',
  // The Facebook link in the footer points at a personal profile, not a
  // business Page, so it is deliberately not listed here — add the real Page
  // URL once it exists.
  sameAs: [
    'https://www.instagram.com/jed_airconditioning/',
    'https://www.linkedin.com/company/jed-air-conditioning/',
  ],
} as const;

export const BUSINESS_ID = `${SITE.url}/#business`;

const offerCatalog = {
  '@type': 'OfferCatalog',
  name: 'Air Conditioning Services',
  itemListElement: [
    'Daikin Air Conditioning — Certified Dealer & Warranty Service Agent',
    'Split System Installation',
    'Ducted Air Conditioning',
    'Multi-Head Split Systems',
    'Air Conditioning Repairs & Diagnostics',
    'Preventive Maintenance',
    'Commercial Air Conditioning',
  ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
};

/** The one business entity every page's structured data hangs off. */
export const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HVACBusiness',
  '@id': BUSINESS_ID,
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}${SITE.ogImage}`,
  description:
    'Sydney air conditioning specialists. Daikin & Haier certified dealer providing professional installation, servicing and repairs across the North Shore, Eastern Suburbs and greater Sydney.',
  // Trading since 2013; the footer states the same thing in words.
  foundingDate: '2013',
  telephone: SITE.phoneE164,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sydney',
    addressRegion: 'NSW',
    addressCountry: 'AU',
  },
  areaServed: [
    { '@type': 'City', name: 'Sydney' },
    { '@type': 'AdministrativeArea', name: 'North Shore, Sydney' },
    { '@type': 'AdministrativeArea', name: 'Eastern Suburbs, Sydney' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:00',
      closes: '18:00',
    },
  ],
  priceRange: '$$',
  sameAs: SITE.sameAs,
  hasOfferCatalog: offerCatalog,
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
