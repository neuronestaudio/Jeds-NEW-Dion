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
  const serviceArg = args.service || 'repair';
  const nameArg = args.name || `UI Form Test ${ts}`;
  const messageArg = args.message || `Automated UI submission at ${ts}`;
  const addressArg = args.address || '1 Martin Place, Sydney NSW 2000';

  try {
    console.log('Navigating to site...');
    await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });

    // Scroll to the quote section to ensure lazy components mount
    await page.evaluate(() => {
      const el = document.querySelector('#quote');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Wait for form fields
    await page.waitForSelector('#name', { visible: true });
    await page.waitForSelector('#phone', { visible: true });
    await page.waitForSelector('#email', { visible: true });
    await page.waitForSelector('#address', { visible: true });
    await page.waitForSelector('#serviceType', { visible: true });
    await page.waitForSelector('#message', { visible: true });

    console.log('Filling form fields...');
    await page.type('#name', nameArg);
    await page.type('#phone', phoneArg);
    await page.type('#email', emailArg);

    // Type the address, then dismiss the Places suggestion list so it cannot
    // sit over the submit button. Submitting typed-but-unselected text is a
    // valid path — it arrives in GHL flagged addressVerified: false.
    await page.type('#address', addressArg);
    await page.keyboard.press('Escape');

    // Select service type (repair)
    await page.select('#serviceType', serviceArg);

    await page.type('#message', messageArg);

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
