import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How soon will you contact me back?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We typically respond the same business day, and for urgent repairs we aim to call within a few hours.'
        }
      },
      {
        '@type': 'Question',
        name: 'What information helps speed up a quote?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Room size, property type, existing AC (if any), and any brand preferences help us provide an accurate quote faster.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you service all of Sydney?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we provide Sydney-wide service. Share your suburb and we will confirm availability.'
        }
      }
    ]
  };
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Get a Free Air Conditioning Quote | Sydney</title>
        <meta name="description" content="Request a free quote for air conditioning installation, repairs, or maintenance in Sydney." />
        <link rel="canonical" href="https://www.jedairconditioning.com.au/contact" />
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Get a Free Quote</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10">Tell us about your AC needs and we’ll respond promptly.</p>
          <div id="quote" className="glass-card p-6 md:p-8">
            <QuoteForm />
          </div>
          <div className="glass-card p-6 md:p-8 mt-10">
            <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold">How soon will you contact me back?</h3>
                <p>We typically respond the same business day, and for urgent repairs we aim to call within a few hours.</p>
              </div>
              <div>
                <h3 className="font-semibold">What information helps speed up a quote?</h3>
                <p>Room size, property type, existing AC (if any), and any brand preferences help us provide an accurate quote faster.</p>
              </div>
              <div>
                <h3 className="font-semibold">Do you service all of Sydney?</h3>
                <p>Yes, we provide Sydney-wide service. Share your suburb and we will confirm availability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
