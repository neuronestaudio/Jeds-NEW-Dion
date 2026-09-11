import { ArrowRight, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { trackEvent } from '@/lib/analytics';
import { SITE } from '@/data/site';

type Props = {
  /** Where the quote button goes — usually the page's own form anchor. */
  quoteHref?: string;
  quoteLabel?: string;
  /** GA4 `location` param so suburb-page clicks are distinguishable from the hero's. */
  location: string;
  align?: 'center' | 'start';
};

export function CtaRow({ quoteHref = '#quote', quoteLabel = 'Get a Free Quote', location, align = 'start' }: Props) {
  const justify = align === 'center' ? 'justify-center' : 'justify-center lg:justify-start';
  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${justify}`}>
      <Button variant="hero" size="xl" asChild>
        <a
          href={quoteHref}
          className="flex items-center gap-2 w-full sm:w-auto justify-center"
          onClick={() => trackEvent('cta_click', { location, type: 'quote' })}
        >
          {quoteLabel}
          <ArrowRight className="w-5 h-5" />
        </a>
      </Button>
      <Button variant="heroOutline" size="xl" asChild>
        <a
          href={SITE.phoneTel}
          className="flex items-center gap-2 w-full sm:w-auto justify-center"
          onClick={() => trackEvent('cta_click', { location, type: 'call' })}
        >
          <Phone className="w-5 h-5" />
          {SITE.phoneDisplay}
        </a>
      </Button>
    </div>
  );
}

export default CtaRow;
