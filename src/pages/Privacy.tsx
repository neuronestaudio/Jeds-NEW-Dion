import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | JED Air Conditioning</title>
        <meta name="description" content="Privacy policy for JED Air Conditioning." />
        <link rel="canonical" href="https://jedairconditioning.com.au/privacy" />
      </Helmet>
      <Header />
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-4">
          This page explains how JED Air Conditioning collects, uses, and protects customer information.
        </p>
        <p className="text-muted-foreground">
          For questions about data handling, contact us at JED_AIR@outlook.com.
        </p>
      </section>
      <Footer />
    </div>
  );
}
