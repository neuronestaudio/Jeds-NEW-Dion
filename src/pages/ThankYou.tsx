import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Thank You | JED Air Conditioning</title>
        <meta
          name="description"
          content="Thanks for your quote request. A member of our team will contact you within 1 business day."
        />
        <link rel="canonical" href="https://www.jedairconditioning.com.au/thank-you" />
      </Helmet>

      <Header />

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card/40 p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Thank You</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your quote request has been received. We will contact you within 1 business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="/">Back to Home</a>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <a href="tel:0434308070">Call 0434 308 070</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;
