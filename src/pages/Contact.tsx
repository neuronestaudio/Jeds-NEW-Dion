import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Get a Free Air Conditioning Quote | Sydney</title>
        <meta name="description" content="Request a free quote for air conditioning installation, repairs, or maintenance in Sydney." />
        <link rel="canonical" href="https://jedairconditioning.com.au/contact" />
      </Helmet>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Get a Free Quote</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10">Tell us about your AC needs and we’ll respond promptly.</p>
          <div id="quote" className="glass-card p-6 md:p-8">
            <QuoteForm />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
