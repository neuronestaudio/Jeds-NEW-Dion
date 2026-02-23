import { Jimp } from 'jimp';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generate() {
  const srcPath = resolve(__dirname, '../src/assets/Jedlogo.jpg');
  const outPath = resolve(__dirname, '../public/og-image.png');

  if (!fs.existsSync(srcPath)) {
    console.error('Source logo not found:', srcPath);
    process.exit(1);
  }

  const canvas = new Jimp({ width: 1200, height: 630, color: '#0b1220' });
  const logo = await Jimp.read(srcPath);
  logo.scaleToFit({ w: 520, h: 520 });

  const x = Math.floor((canvas.bitmap.width - logo.bitmap.width) / 2);
  const y = Math.floor((canvas.bitmap.height - logo.bitmap.height) / 2);
  canvas.composite(logo, x, y);

  await canvas.write(outPath);
  console.log('Wrote', outPath);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
