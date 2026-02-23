import https from 'https';

const TARGET = process.env.CORS_CHECK_URL || 'https://hooks.jedairconditioning.com.au/api/quote';
const ORIGIN = process.env.CORS_ORIGIN || 'https://jedairconditioning.com.au';

function request(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ res, data });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function printResult(label, result) {
  const { res, data } = result;
  const headers = res.headers || {};
  console.log(`\n${label}`);
  console.log('Status:', res.statusCode);
  console.log('Access-Control-Allow-Origin:', headers['access-control-allow-origin'] || '(missing)');
  console.log('Access-Control-Allow-Methods:', headers['access-control-allow-methods'] || '(missing)');
  console.log('Access-Control-Allow-Headers:', headers['access-control-allow-headers'] || '(missing)');
  if (data) {
    const bodyPreview = data.length > 400 ? `${data.slice(0, 400)}...` : data;
    console.log('Body preview:', bodyPreview.replace(/\s+/g, ' ').trim());
  }
}

async function run() {
  const url = new URL(TARGET);

  const preflightOptions = {
    method: 'OPTIONS',
    hostname: url.hostname,
    path: url.pathname + url.search,
    headers: {
      Origin: ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  };

  const postOptions = {
    method: 'POST',
    hostname: url.hostname,
    path: url.pathname + url.search,
    headers: {
      Origin: ORIGIN,
      'Content-Type': 'application/json',
    },
  };

  console.log('Checking CORS for:', TARGET);
  console.log('Origin:', ORIGIN);

  const preflight = await request(preflightOptions);
  printResult('Preflight (OPTIONS)', preflight);

  const post = await request(postOptions);
  printResult('POST (no body)', post);
}

run().catch((err) => {
  console.error('CORS check failed:', err.message || err);
  process.exit(1);
});
