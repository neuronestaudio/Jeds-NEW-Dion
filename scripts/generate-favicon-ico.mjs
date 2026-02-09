import fs from 'fs';
import { resolve } from 'path';
import pngToIco from 'png-to-ico';

async function run() {
  const publicDir = resolve(process.cwd(), 'public');
  const sizes = [16, 32, 48, 64];
  const inputs = sizes.map((s) => resolve(publicDir, `favicon-${s}.png`));
  inputs.forEach((p) => {
    if (!fs.existsSync(p)) {
      console.error('Missing PNG:', p);
      process.exit(1);
    }
  });
  const buf = await pngToIco(inputs);
  const out = resolve(publicDir, 'favicon.ico');
  fs.writeFileSync(out, buf);
  console.log('Wrote', out);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
