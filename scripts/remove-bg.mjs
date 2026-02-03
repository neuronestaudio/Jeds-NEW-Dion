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
    const a = data[idx + 3];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max - min; // simple chroma proxy
    const luminance = (r + g + b) / 3;

    const isWhite = luminance > 245; // pure/near white logo strokes
    const isDark = luminance < 25;   // any solid dark we keep

    // Background heuristic: low saturation (gray) and mid luminance (checkerboard)
    const isGrayBg = saturation < 18 && luminance > 80 && luminance < 240;

    if (isGrayBg && !isWhite && !isDark) {
      data[idx + 3] = 0; // transparent
      return;
    }

    // Edge cleanup: brighten near-white anti-aliased pixels to solid white
    if (saturation < 25 && luminance >= 225 && a > 0) {
      data[idx + 0] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 255;
    }
  });

  await img.write(outPath);
  console.log(`Wrote transparent logo: ${outPath}`);
}

run().catch((err) => {
  console.error('Failed to process logo:', err);
  process.exit(1);
});
