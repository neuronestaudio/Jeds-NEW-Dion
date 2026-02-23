import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Service | JED Air Conditioning</title>
        <meta name="description" content="Terms of service for JED Air Conditioning." />
        <link rel="canonical" href="https://jedairconditioning.com.au/terms" />
      </Helmet>
      <Header />
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-4">
          These terms outline the use of services provided by JED Air Conditioning.
        </p>
        <p className="text-muted-foreground">
          For questions about these terms, contact us at JED_AIR@outlook.com.
        </p>
      </section>
      <Footer />
    </div>
  );
}
