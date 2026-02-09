import { Jimp } from 'jimp';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function generate() {
  const srcPath = resolve(__dirname, '../src/assets/Jedlogo.jpg');
  const outDir = resolve(__dirname, '../public');

  if (!fs.existsSync(srcPath)) {
    console.error('Source logo not found:', srcPath);
    process.exit(1);
  }

  await ensureDir(outDir);

  const image = await Jimp.read(srcPath);
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  const size = Math.min(w, h);
  const x = Math.floor((w - size) / 2);
  const y = Math.floor((h - size) / 2);

  // Crop center square and prepare base
  const square = image.clone().crop({ x, y, w: size, h: size });

  const sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512];
  for (const s of sizes) {
    const outPath = resolve(outDir, s === 180 ? 'apple-touch-icon.png' : `favicon-${s}.png`);
    const resized = square.clone().resize({ w: s, h: s });
    resized.write(outPath);
    console.log('Wrote', outPath);
  }

  // Default favicon.png (64x64)
  const defaultFavicon = resolve(outDir, 'favicon.png');
  square.clone().resize({ w: 64, h: 64 }).write(defaultFavicon);
  console.log('Wrote', defaultFavicon);

  console.log('Favicon generation complete.');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
