/**
 * Turn the supplied brand artwork into trimmed, transparent marks.
 *
 * The supplied files are screenshots, not artwork: every one is a near-black
 * plate, and most of them additionally carry the logo inside a white rounded
 * chip. Dropped into a card that is itself a rounded panel, they render as a
 * box inside a box inside a box, at whatever size each screenshot happened to
 * be cropped to. This script reduces each file to its ink on transparency, so
 * the page can size and colour them itself.
 *
 * Two shapes of source, detected from the corner pixel:
 *
 * - `plate`   — ink sits directly on the dark plate (Daikin, Haier).
 * - `chip`    — ink sits on a white chip which sits on the dark plate
 *               (every third-party brand mark).
 *
 * Both end up as dark/brand-coloured ink on transparency, so the page can show
 * the real colours on a light surface and flip the whole mark to white on a
 * dark one with a single CSS filter. Haier's mark is white in the original and
 * is inverted here for that reason — see NORMALISE_TO_DARK.
 *
 * Un-compositing is done properly rather than with a hard threshold, which
 * would leave a fringe on every anti-aliased edge:
 *
 *   plate: alpha from distance to the plate colour, then c = bg + (p - bg) / a
 *   chip:  alpha = 1 - min(r,g,b)/255,          then c = (p - (1 - a)·255) / a
 *
 * The chip formula is the standard un-multiply against white: it keeps a
 * saturated red fully opaque and red, turns mid grey into 50%-opaque black,
 * and leaves pure white fully transparent — which is what makes the white
 * counters inside marks like Samsung read as holes rather than as paint.
 *
 * Marks are finally scaled 2x so they still resolve on a HiDPI screen at the
 * ~40px the marquee renders them at. Reads originals, writes new files, so it
 * is safe to re-run.
 *
 *   node scripts/clean-brand-logos.mjs
 */
import { Jimp } from 'jimp';

const OUT_DIR = 'src/assets/brands-clean';

/** Marks whose ink is light in the original and must be flipped to dark. */
const NORMALISE_TO_DARK = new Set(['haier']);

const LOGOS = [
  { slug: 'daikin', src: 'src/assets/Daikin.png' },
  { slug: 'haier', src: 'src/assets/Haier.png' },
  { slug: 'fujitsu', src: 'src/assets/brands/fujitsu.jpg' },
  { slug: 'mitsubishi', src: 'src/assets/brands/mitsubishi_electric.png' },
  { slug: 'panasonic', src: 'src/assets/brands/panasonic.png' },
  { slug: 'samsung', src: 'src/assets/brands/samsung.png' },
  { slug: 'lg', src: 'src/assets/brands/lg.png' },
  { slug: 'carrier', src: 'src/assets/brands/carrier.png' },
  { slug: 'toshiba', src: 'src/assets/brands/toshiba.png' },
  { slug: 'hitachi', src: 'src/assets/brands/hitachi.png' },
  { slug: 'actronair', src: 'src/assets/brands/actronair.png' },
  { slug: 'braemar', src: 'src/assets/brands/braemar.png' },
];

/** Distance beyond which a pixel counts as fully opaque ink (plate sources). */
const FULL_OPACITY_DISTANCE = 90;
/** Anything this close to the plate colour is treated as pure background. */
const BACKGROUND_TOLERANCE = 14;
/** min(r,g,b) at or above this counts as part of the white chip. */
const CHIP_BRIGHTNESS = 170;
/** Pixels trimmed off the chip's edge, to drop its border and rounded corners. */
const CHIP_INSET = 4;
/** Output scale, so a ~40px render still has pixels on a 2x display. */
const SCALE = 2;
/** Hard cap: 2x the 144px slot the marquee renders a mark into. */
const MAX_WIDTH = 320;

const clamp255 = (n) => Math.max(0, Math.min(255, Math.round(n)));
const px = (data, idx) => [data[idx], data[idx + 1], data[idx + 2]];

/** Bounding box of pixels satisfying `hit`, or null if there are none. */
function bounds(img, hit) {
  const { width, height, data } = img.bitmap;
  let top = height, left = width, right = -1, bottom = -1;
  img.scan(0, 0, width, height, function (x, y, idx) {
    if (!hit(data, idx)) return;
    if (y < top) top = y;
    if (y > bottom) bottom = y;
    if (x < left) left = x;
    if (x > right) right = x;
  });
  return right < 0 ? null : { x: left, y: top, w: right - left + 1, h: bottom - top + 1 };
}

async function clean({ slug, src }) {
  const img = await Jimp.read(src);
  const corner = px(img.bitmap.data, 0);
  const cornerIsDark = Math.max(...corner) < 120;

  if (cornerIsDark) {
    // Sample all four corners for the plate colour — these are #16181c-ish,
    // not pure black.
    const { width, height, data } = img.bitmap;
    const corners = [
      [0, 0],
      [width - 1, 0],
      [0, height - 1],
      [width - 1, height - 1],
    ].map(([x, y]) => px(data, (y * width + x) * 4));
    const bg = [0, 1, 2].map((c) => corners.reduce((s, p) => s + p[c], 0) / corners.length);

    // Is there a white chip sitting on the plate? If so, crop to inside it and
    // let the chip pass below do the un-compositing; the plate never survives.
    const isBright = (data, idx) => Math.min(...px(data, idx)) >= CHIP_BRIGHTNESS;
    const chip = bounds(img, isBright);
    // A chip is a solid filled rectangle. White *lettering* on the plate (the
    // Haier mark) also produces a wide bright bounding box, so the deciding
    // test is how much of that box is actually filled — a chip is nearly all
    // of it, lettering is a fraction. Without this, Haier gets cropped to its
    // own glyphs and then erased by the white pass below.
    let brightInBox = 0;
    if (chip) {
      img.scan(chip.x, chip.y, chip.w, chip.h, function (x, y, idx) {
        if (isBright(this.bitmap.data, idx)) brightInBox++;
      });
    }
    const chipIsReal =
      chip && chip.w > width * 0.4 && chip.h > height * 0.3 && brightInBox / (chip.w * chip.h) > 0.6;

    if (chipIsReal) {
      // Scaled with the source: a fixed 4px clears the border on a 165px-wide
      // screenshot but leaves a hairline frame on the 1024px Fujitsu one.
      const inset = Math.max(CHIP_INSET, Math.round(width * 0.015));
      img.crop({
        x: chip.x + inset,
        y: chip.y + inset,
        w: Math.max(1, chip.w - inset * 2),
        h: Math.max(1, chip.h - inset * 2),
      });
    } else {
      img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        const p = px(this.bitmap.data, idx);
        const distance = Math.max(...p.map((c, i) => Math.abs(c - bg[i])));
        if (distance <= BACKGROUND_TOLERANCE) {
          this.bitmap.data[idx + 3] = 0;
          return;
        }
        const alpha = Math.min(1, distance / FULL_OPACITY_DISTANCE);
        for (let c = 0; c < 3; c++) {
          this.bitmap.data[idx + c] = clamp255(bg[c] + (p[c] - bg[c]) / alpha);
        }
        this.bitmap.data[idx + 3] = clamp255(alpha * 255);
      });
    }
  }

  // Un-multiply against white for anything still sitting on a light ground.
  if (!cornerIsDark || bounds(img, (data, idx) => data[idx + 3] < 250) === null) {
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      const p = px(this.bitmap.data, idx);
      const alpha = 1 - Math.min(...p) / 255;
      // The sources are compressed screenshots, so "white" is really a haze of
      // 250-254s. Left alone that becomes a field of barely-there pixels which
      // PNG cannot run-length away — it tripled the file sizes — and shows as a
      // faint halo once the dark theme flips the mark to white.
      if (alpha <= 0.06) {
        this.bitmap.data[idx + 3] = 0;
        return;
      }
      for (let c = 0; c < 3; c++) {
        this.bitmap.data[idx + c] = clamp255((p[c] - (1 - alpha) * 255) / alpha);
      }
      this.bitmap.data[idx + 3] = clamp255(alpha * 255);
    });
  }

  if (NORMALISE_TO_DARK.has(slug)) {
    // Keep the shape, flip the ink dark so the light theme can show it and the
    // dark theme's white filter has something to work on.
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      for (let c = 0; c < 3; c++) this.bitmap.data[idx + c] = 24;
    });
  }

  const ink = bounds(img, (data, idx) => data[idx + 3] > 8);
  if (!ink) throw new Error(`${src}: everything came out transparent`);
  img.crop(ink);
  // 2x the widest slot the marquee gives a mark, and no more: the Daikin and
  // Fujitsu sources are big enough to emit 1600px PNGs for a 144px box.
  const targetW = Math.min(img.bitmap.width * SCALE, MAX_WIDTH);
  img.resize({ w: Math.round(targetW), h: Math.round((targetW / img.bitmap.width) * img.bitmap.height) });

  const out = `${OUT_DIR}/${slug}.png`;
  await img.write(out);
  const { width: w, height: h } = img.bitmap;
  console.log(`${out.padEnd(38)} ${w}x${h}  aspect ${(w / h).toFixed(2)}  (from ${src})`);
}

for (const logo of LOGOS) await clean(logo);
