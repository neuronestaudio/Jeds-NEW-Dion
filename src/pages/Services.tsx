import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Services = () => {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Services',
        item: 'https://jedairconditioning.com.au/services',
      },
    ],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which air conditioning system is best for my home?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It depends on your layout, insulation, and budget. Split systems suit single rooms, while ducted systems provide whole-home comfort with zoning.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you provide free quotes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer free quotes across Sydney. Share your requirements and we will recommend the most efficient solution.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are you licensed and insured?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We are fully licensed and insured, and our installations include a workmanship warranty.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Air Conditioning Services in Sydney | Installation, Repairs & Maintenance</title>
        <meta name="description" content="Comprehensive air conditioning services across Sydney: split system installation, ducted systems, and fast repairs." />
        <link rel="canonical" href="https://jedairconditioning.com.au/services" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <Header />
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Air Conditioning Services in Sydney</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10">Installation, repairs, and maintenance for residential and commercial properties.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/service/split-system-installation" className="group p-6 bg-card/50 border border-border/30 rounded-2xl hover:border-primary/30 hover:bg-card/80 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-semibold">SS</span>
              </div>
              <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Split System Installation</h2>
              <p className="text-muted-foreground text-sm">Energy-efficient split systems for homes and small offices.</p>
            </Link>
            <Link to="/service/ducted-air-conditioning" className="group p-6 bg-card/50 border border-border/30 rounded-2xl hover:border-primary/30 hover:bg-card/80 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-semibold">DA</span>
              </div>
              <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Ducted Air Conditioning</h2>
              <p className="text-muted-foreground text-sm">Whole-home comfort with concealed ducted systems.</p>
            </Link>
            <Link to="/service/aircon-repair" className="group p-6 bg-card/50 border border-border/30 rounded-2xl hover:border-primary/30 hover:bg-card/80 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-primary font-semibold">AR</span>
              </div>
              <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Repairs & Diagnostics</h2>
              <p className="text-muted-foreground text-sm">Fast, accurate diagnosis and repair for all brands.</p>
            </Link>
          </div>
          <div className="glass-card p-6 md:p-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold">Which air conditioning system is best for my home?</h3>
                <p>It depends on your layout, insulation, and budget. Split systems suit single rooms, while ducted systems provide whole-home comfort with zoning.</p>
              </div>
              <div>
                <h3 className="font-semibold">Do you provide free quotes?</h3>
                <p>Yes, we offer free quotes across Sydney. Share your requirements and we will recommend the most efficient solution.</p>
              </div>
              <div>
                <h3 className="font-semibold">Are you licensed and insured?</h3>
                <p>Yes. We are fully licensed and insured, and our installations include a workmanship warranty.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Services;
