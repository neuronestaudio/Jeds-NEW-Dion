import puppeteer from 'puppeteer';

const SITE_URL = 'https://jedairconditioning.com.au/';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.replace(/^--/, '');
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : 'true';
      out[key] = val;
    }
  }
  return out;
}

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  const ts = new Date().toISOString();
  const args = parseArgs();
  const phoneArg = process.env.TEST_CUSTOMER_PHONE || args.phone || '+61420806960';
  const emailArg = args.email || 'copilot-ui-test@example.com';
  const nameArg = args.name || `UI Form Test ${ts}`;
  const messageArg = args.message || `Automated UI submission at ${ts}`;
  const addressArg = args.address || '1 Martin Place, Sydney NSW 2000';
  // Wizard steps 1 and 2 are chosen by their visible label, not a select value.
  const serviceLabelArg = args.service || 'Repair / Breakdown';
  const urgencyLabelArg = args.urgency || 'Within the next few days';

  try {
    console.log('Navigating to site...');
    await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });

    // Scroll to the quote section to ensure lazy components mount
    await page.evaluate(() => {
      const el = document.querySelector('#quote');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // The form is a 3-step wizard: service -> urgency -> contact details.
    // Steps 1 and 2 are tap targets, so drive them by their visible label.
    const clickByText = async (label) => {
      const clicked = await page.evaluate((text) => {
        const btn = Array.from(document.querySelectorAll('form button[type="button"]')).find(
          (el) => (el.textContent || '').includes(text)
        );
        if (!btn) return false;
        btn.click();
        return true;
      }, label);
      if (!clicked) throw new Error(`Could not find wizard option: ${label}`);
    };

    console.log(`Step 1 - service: ${serviceLabelArg}`);
    await page.waitForSelector('form button[type="button"]', { visible: true });
    await clickByText(serviceLabelArg);

    console.log(`Step 2 - urgency: ${urgencyLabelArg}`);
    await page.waitForFunction(
      () => !!Array.from(document.querySelectorAll('form *')).find((el) =>
        /How soon do you need it/i.test(el.textContent || '')
      ),
      { timeout: 10000 }
    );
    await clickByText(urgencyLabelArg);

    console.log('Step 3 - contact details...');
    await page.waitForSelector('#bottom-quote-name', { visible: true, timeout: 10000 });
    await page.type('#bottom-quote-name', nameArg);
    await page.type('#bottom-quote-phone', phoneArg);
    await page.type('#bottom-quote-email', emailArg);

    // Type the address, then dismiss the Places suggestion list so it cannot
    // sit over the submit button. Submitting typed-but-unselected text is a
    // valid path — it arrives in GHL flagged addressVerified: false.
    await page.type('#bottom-quote-address', addressArg);
    await page.keyboard.press('Escape');

    await page.type('#bottom-quote-message', messageArg);

    console.log('Submitting form...');
    await page.click('form button[type="submit"]');

    // Wait for success toast text
    await page.waitForFunction(
      () => !!document.body.querySelector('*') && !!Array.from(document.querySelectorAll('*')).find(el => /Quote Request Sent!/i.test(el.textContent || '')),
      { timeout: 20000 }
    );
    console.log('Success toast detected: Quote Request Sent!');

    console.log('Form submission complete. Please check for SMS delivery.');
  } catch (err) {
    console.error('Form submission failed:', err?.message || err);
    throw err;
  } finally {
    await browser.close();
  }
}

run().catch(() => process.exit(1));
