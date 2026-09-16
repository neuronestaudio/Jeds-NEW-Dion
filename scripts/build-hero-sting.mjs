/**
 * Rebuild the hero lockup sting (public/hero-sting.mp4) and its held final
 * frame (src/assets/hero/lockup.png) from the supplied render.
 *
 * `media/hero-source.mp4` is the raw 1280x720 logo animation. Two things in
 * it can never reach the page:
 *
 * 1. It opens on a bright title card carrying the generator's watermark,
 *    which dissolves away over the first 13 frames.
 * 2. The settled logo has a third line under the wordmark reading
 *    "SERVICE - MAINTENAANCE - INSTALATION". Both of those words are
 *    misspelled in the render, so the crop stops above that line.
 *
 * The previous crop was flush to the SETTLED mark (842x326, ink 2px from the
 * edge). That is the tightest box that fits the end state — but not the
 * animation: measured against the raw render, the letters swing out to
 * x=96 on the way in (133px left of where they settle) and overshoot to
 * x=1085 on the right, and the wordmark drops to y=502. A flush crop
 * therefore cut the mark off for the whole intro, which is what "the
 * airconditioning's cut off" was.
 *
 * So the frame is the settled mark's box grown symmetrically until it holds
 * every frame of the animation with 5px to spare: 1102x360 at (88,150),
 * which still clears the misspelled tagline (its highest ink is y=516) by
 * 6px. The settled mark is 75% of that width, so the CSS box is scaled up by the
 * reciprocal to keep the logo the same size on screen — see index.css.
 *
 * Timing is preserved exactly: the shipped clip ran 248 frames at 24fps with
 * motion ending at 152, i.e. the trimmed render compressed to 152 frames and
 * then holding its last frame for four seconds.
 *
 *   node scripts/build-hero-sting.mjs
 */
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const SOURCE = 'media/hero-source.mp4';
const VIDEO_OUT = 'public/hero-sting.mp4';
const STILL_OUT = 'src/assets/hero/lockup.png';

/** First frame after the title card (and its watermark) has dissolved. */
const TRIM_START_FRAME = 14;
const FPS = 24;
/** Frames of animation in the source once the head is gone. */
const SOURCE_FRAMES = 181;
/** Frames the animation is re-timed onto, and the held tail after it. */
const MOTION_FRAMES = 152;
const HOLD_FRAMES = 96;

/** Crop that holds every frame of the animation. See the note above. */
const CROP = { w: 1102, h: 360, x: 88, y: 150 };

const speed = (MOTION_FRAMES / SOURCE_FRAMES).toFixed(6);
const crop = `crop=${CROP.w}:${CROP.h}:${CROP.x}:${CROP.y}`;

execFileSync('ffmpeg', [
  '-y', '-v', 'error', '-i', SOURCE,
  '-vf', [
    `trim=start_frame=${TRIM_START_FRAME}`,
    'setpts=PTS-STARTPTS',
    crop,
    `setpts=${speed}*PTS`,
    // Hold the settled mark rather than ending on it: the element plays once
    // and then shows its last frame anyway, but this keeps the file's own
    // length (and therefore any timing measured against it) unchanged.
    `tpad=stop_mode=clone:stop_duration=${(HOLD_FRAMES / FPS).toFixed(4)}`,
    `fps=${FPS}`,
  ].join(','),
  '-an',
  '-c:v', 'libx264', '-profile:v', 'high', '-crf', '23',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  VIDEO_OUT,
], { stdio: 'inherit' });

// The still is the clip's own final frame, so the fallback and the first
// paint are the same image the animation resolves to.
execFileSync('ffmpeg', [
  '-y', '-v', 'error', '-sseof', '-0.5', '-i', VIDEO_OUT,
  '-frames:v', '1', '-update', '1', STILL_OUT,
], { stdio: 'inherit' });

for (const f of [VIDEO_OUT, STILL_OUT]) {
  console.log(`${f}  ${(statSync(f).size / 1024).toFixed(0)} KB`);
}
