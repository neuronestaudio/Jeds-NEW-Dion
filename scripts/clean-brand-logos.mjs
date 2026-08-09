/**
 * Turn the supplied Daikin/Haier PNGs into trimmed, transparent marks.
 *
 * Both ship as artwork on a near-black plate with different amounts of
 * built-in padding, which is why they render as dark boxes and at visually
 * different sizes no matter what CSS height you give them.
 *
 * Two passes:
 *
 * 1. Un-composite against the known plate colour. A hard "is this pixel dark?"
 *    threshold would leave a dark fringe on every anti-aliased edge, so alpha
 *    is derived from each pixel's distance from the plate and the original
 *    colour is recovered with c = bg + (p - bg) / a. That keeps the blue in
 *    the Daikin mark true instead of muddying it toward the background.
 * 2. Trim fully transparent rows/columns, so both marks are tight to their own
 *    ink and a shared CSS height renders them at the same optical weight.
 *
 * Reads the originals and writes *-clean.png, so it is safe to re-run.
 *
 *   node scripts/clean-brand-logos.mjs
 */
import { Jimp } from 'jimp';

const LOGOS = [
  { src: 'src/assets/Daikin.png', out: 'src/assets/daikin-clean.png' },
  { src: 'src/assets/Haier.png', out: 'src/assets/haier-clean.png' },
];

/** Distance beyond which a pixel counts as fully opaque ink. */
const FULL_OPACITY_DISTANCE = 90;
/** Anything this close to the plate colour is treated as pure background. */
const BACKGROUND_TOLERANCE = 14;

const clamp255 = (n) => Math.max(0, Math.min(255, Math.round(n)));

async function clean({ src, out }) {
  const img = await Jimp.read(src);
  const { width, height, data } = img.bitmap;

  // Sample the four corners and take the median-ish average as the plate colour,
  // rather than assuming pure black — these plates are #16181c-ish.
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ].map(([x, y]) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  });
  const bg = [0, 1, 2].map((c) => corners.reduce((s, p) => s + p[c], 0) / corners.length);

  img.scan(0, 0, width, height, function (x, y, idx) {
    const px = [data[idx], data[idx + 1], data[idx + 2]];
    const distance = Math.max(...px.map((c, i) => Math.abs(c - bg[i])));

    if (distance <= BACKGROUND_TOLERANCE) {
      data[idx + 3] = 0;
      return;
    }

    const alpha = Math.min(1, distance / FULL_OPACITY_DISTANCE);
    // Recover the un-composited colour so edges do not darken toward the plate.
    for (let c = 0; c < 3; c++) {
      data[idx + c] = clamp255(bg[c] + (px[c] - bg[c]) / alpha);
    }
    data[idx + 3] = clamp255(alpha * 255);
  });

  // Trim transparent margins so both marks are flush to their ink.
  let top = height, left = width, right = -1, bottom = -1;
  img.scan(0, 0, width, height, function (x, y, idx) {
    if (data[idx + 3] > 8) {
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  });

  if (right < 0) throw new Error(`${src}: everything came out transparent`);

  img.crop({ x: left, y: top, w: right - left + 1, h: bottom - top + 1 });
  await img.write(out);

  const w = right - left + 1;
  const h = bottom - top + 1;
  console.log(
    `${out}  ${w}x${h}  aspect ${(w / h).toFixed(2)}  ` +
      `(plate rgb(${bg.map((n) => Math.round(n)).join(',')}), trimmed ${width}x${height})`
  );
}

for (const logo of LOGOS) await clean(logo);
