/**
 * Rebuild every animated-logo asset from the supplied render, in one go:
 *
 *   public/hero-sting.mp4                     the hero lockup (also the Why JED watermark)
 *   src/assets/hero/lockup.png                its held final frame
 *   public/textures/lockup-mask.png           the settled mark as an alpha shape (the sheen)
 *   public/splash-lockup.mp4                  the entrance splash build
 *   src/assets/hero/splash-lockup-still.png   its held final frame
 *
 * They share one source on purpose. The still IS the clip's last frame and the
 * mask IS the still, so the fallback, the first paint, the animation's end and
 * the sheen can never drift apart. Never regenerate one without the others.
 *
 * SOURCE
 * `media/hero-source-emblem.mp4` is the client's corrected render (supplied
 * 20 Sep 2026 as JED-hero-desktop-FINAL-HOLD.mp4). It replaces
 * `media/hero-source.mp4`, which is kept only for history: that one built the
 * mark around a generic GEAR, which is not JED's logo — theirs is the
 * snowflake-compass emblem used in the header — and it carried a third line
 * reading "SERVICE - MAINTENAANCE - INSTALATION", misspelled twice, which the
 * old crop existed to hide. The new render has the real emblem from the first
 * frame, no third line, and a true-black plate (mean luma 0.5), which is what
 * the blend-mode keying in .hero-lockup needs.
 *
 * A 854x480 mobile cut was supplied too. It is the same composition at lower
 * resolution, so nothing is built from it.
 *
 * THE HERO CROP
 * Cropped flush to the SETTLED mark, the intro plays cut off: the emblem swings
 * out to x=94 on the way in, 112px left of where it settles, and the letters
 * overshoot to x=1084 on the right. So the frame is the settled mark's box
 * grown symmetrically until it holds every frame of the animation: 1102x360 at
 * (88,150) — measured against this render, the union of all ink is x 94..1084,
 * y 161..501, and the settled mark is x 206..1071, y 166..499. That is the SAME
 * box the gear render used, so the element keeps its exact geometry. The
 * settled mark is 78.6% of the frame's width here (the gear one was 75%); the
 * CSS box in .hero-lockup-wrap is scaled by the reciprocal so the logo prints
 * at the same size as before — see index.css.
 *
 * TIMING
 * The render's own, untouched. Ink first appears on frame 6 and the last
 * motion is frame 97; the clip runs from there to 13 frames past the end of
 * motion and stops. The element holds its last frame anyway, and the hero's
 * sheen waits for `ended`, so a long tail only delays it.
 *
 * THE SPLASH
 * Full width and 520 tall at y=106 — the geometry the splash CSS was laid out
 * against — and the same build compressed to 2.5s, because the splash
 * dismisses itself 400ms after `ended` with a 3.4s hard cap.
 *
 *   node scripts/build-hero-sting.mjs
 */
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const SOURCE = 'media/hero-source-emblem.mp4';
const FPS = 24;

/** 0-indexed. Frames 0-4 are black; 96 is the last frame with motion. */
const FIRST_INK_FRAME = 5;
const LAST_MOTION_FRAME = 96;

const HERO = {
  video: 'public/hero-sting.mp4',
  still: 'src/assets/hero/lockup.png',
  mask: 'public/textures/lockup-mask.png',
  crop: { w: 1102, h: 360, x: 88, y: 150 },
  /** Frames held after motion stops, so the clip ends on a settled mark. */
  tailFrames: 13,
};

const SPLASH = {
  video: 'public/splash-lockup.mp4',
  still: 'src/assets/hero/splash-lockup-still.png',
  crop: { w: 1280, h: 520, x: 0, y: 106 },
  seconds: 2.5,
};

const ffmpeg = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: 'inherit' });
const cropFilter = ({ w, h, x, y }) => `crop=${w}:${h}:${x}:${y}`;
const ENCODE = ['-an', '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
const lastFrame = (video, png) => ffmpeg(['-sseof', '-0.2', '-i', video, '-frames:v', '1', '-update', '1', png]);

// ---- hero lockup -----------------------------------------------------------
ffmpeg([
  '-i', SOURCE,
  '-vf', [
    `trim=start_frame=${FIRST_INK_FRAME}:end_frame=${LAST_MOTION_FRAME + HERO.tailFrames + 1}`,
    'setpts=PTS-STARTPTS',
    cropFilter(HERO.crop),
    `fps=${FPS}`,
  ].join(','),
  ...ENCODE, '-crf', '22',
  HERO.video,
]);
lastFrame(HERO.video, HERO.still);

// The sheen's mask: the settled mark's white ink becomes alpha, so a moving
// band of light can be clipped to the letters and the emblem and nothing else.
ffmpeg([
  '-i', HERO.still,
  '-vf', "format=yuva444p,geq=lum=255:cb=128:cr=128:a='clip((lum(X\\,Y)-40)*255/175\\,0\\,255)'",
  '-frames:v', '1', '-update', '1',
  HERO.mask,
]);

// ---- entrance splash -------------------------------------------------------
const buildFrames = LAST_MOTION_FRAME - FIRST_INK_FRAME + 1;
const speed = ((SPLASH.seconds * FPS) / buildFrames).toFixed(6);
ffmpeg([
  '-i', SOURCE,
  '-vf', [
    `trim=start_frame=${FIRST_INK_FRAME}:end_frame=${LAST_MOTION_FRAME + 1}`,
    'setpts=PTS-STARTPTS',
    cropFilter(SPLASH.crop),
    `setpts=${speed}*PTS`,
    `fps=${FPS}`,
  ].join(','),
  ...ENCODE, '-crf', '23',
  SPLASH.video,
]);
lastFrame(SPLASH.video, SPLASH.still);

for (const f of [HERO.video, HERO.still, HERO.mask, SPLASH.video, SPLASH.still]) {
  console.log(`${f}  ${(statSync(f).size / 1024).toFixed(0)} KB`);
}
