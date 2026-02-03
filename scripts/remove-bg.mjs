import { Jimp } from 'jimp';

async function run() {
  const srcPath = 'src/assets/jed-logo.jpeg';
  const outPath = 'src/assets/jed-logo.png';

  const img = await Jimp.read(srcPath);

  const { width, height, data } = img.bitmap;

  img.scan(0, 0, width, height, function (x, y, idx) {
    const r = data[idx + 0];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // alpha channel is idx + 3

    const diffRG = Math.abs(r - g);
    const diffGB = Math.abs(g - b);
    const diffRB = Math.abs(r - b);
    const isGrayish = diffRG < 12 && diffGB < 12 && diffRB < 12; // low chroma
    const isWhite = r > 240 && g > 240 && b > 240; // keep pure white strokes
    const isDark = r < 30 && g < 30 && b < 30; // keep pure dark if any

    if (isGrayish && !isWhite && !isDark) {
      // Make background pixels transparent
      data[idx + 3] = 0;
    }
  });

  await img.write(outPath);
  console.log(`Wrote transparent logo: ${outPath}`);
}

run().catch((err) => {
  console.error('Failed to process logo:', err);
  process.exit(1);
});
