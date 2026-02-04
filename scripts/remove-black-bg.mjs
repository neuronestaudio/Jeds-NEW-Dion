import { Jimp } from 'jimp';

async function run() {
  const srcPath = 'src/assets/jedlogo-1.jpg';
  const outPath = 'src/assets/jedlogo-1.png';

  const img = await Jimp.read(srcPath);
  const { width, height, data } = img.bitmap;

  img.scan(0, 0, width, height, function (x, y, idx) {
    const r = data[idx + 0];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    // Treat very dark pixels (black background) as transparent
    const isNearBlack = r < 20 && g < 20 && b < 20;
    if (isNearBlack) {
      data[idx + 3] = 0;
      return;
    }

    // Normalize faint gray to solid white for crisp logo
    const luminance = (r + g + b) / 3;
    if (luminance > 200 && a > 0) {
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
