import puppeteer from 'puppeteer';

const SITE_URL = 'https://jedairconditioning.com.au/';

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  const ts = new Date().toISOString();

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
    await page.waitForSelector('#serviceType', { visible: true });
    await page.waitForSelector('#message', { visible: true });

    console.log('Filling form fields...');
    await page.type('#name', `UI Form Test ${ts}`);
    // Use owner's AU number as customer phone to validate receipt
    await page.type('#phone', '+61420806960');
    await page.type('#email', 'copilot-ui-test@example.com');

    // Select service type (repair)
    await page.select('#serviceType', 'repair');

    await page.type('#message', `Automated UI submission at ${ts}`);

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
